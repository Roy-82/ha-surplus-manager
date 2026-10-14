"""Control regressions using deterministic clocks and HA boundary doubles."""
from datetime import datetime
from pathlib import Path
import sys
from types import ModuleType, SimpleNamespace
import unittest
from unittest.mock import AsyncMock, patch

ROOT = Path(__file__).resolve().parents[1] / 'custom_components/surplus_manager'
# Load only the manager and its dependencies, not the integration service setup.
package = ModuleType('surplus_under_test')
package.__path__ = [str(ROOT)]
sys.modules[package.__name__] = package
for name in ['homeassistant', 'homeassistant.core', 'homeassistant.helpers',
             'homeassistant.helpers.event', 'homeassistant.helpers.storage',
             'homeassistant.util', 'homeassistant.util.dt']:
    sys.modules[name] = ModuleType(name)
sys.modules['homeassistant.core'].HomeAssistant = object
sys.modules['homeassistant.helpers.event'].async_track_time_interval = lambda *args: None
sys.modules['homeassistant.helpers.storage'].Store = lambda *args: SimpleNamespace(async_save=AsyncMock(), async_load=AsyncMock(return_value={}))
sys.modules['homeassistant.util'].dt = sys.modules['homeassistant.util.dt']
sys.modules['homeassistant.util.dt'].now = lambda: datetime(2026, 10, 14, 12)
from surplus_under_test.conditions import normalize_conditions, evaluate_conditions
from surplus_under_test.manager import SurplusManager


class Conditions(unittest.TestCase):
    def check(self, values, running=False, hour=12, minute=0, **settings):
        config = normalize_conditions(settings)
        return evaluate_conditions(config, running, lambda e, p: values.get(e), datetime(2026, 10, 14, hour, minute))[0]

    def test_legacy_defaults(self):
        self.assertEqual(normalize_conditions({})['control_mode'], 'surplus')
        self.assertTrue(self.check({}))

    def test_soc_hysteresis(self):
        for value, start, run in [(80, True, True), (79, False, True), (70, False, False), (69, False, False)]:
            with self.subTest(value=value):
                self.assertEqual(self.check({'sensor.soc': value}, soc_entity='sensor.soc'), start)
                self.assertEqual(self.check({'sensor.soc': value}, running=True, soc_entity='sensor.soc'), run)

    def test_and_not_or(self):
        config = dict(soc_entity='sensor.soc', pv_entity='sensor.pv')
        self.assertFalse(self.check({'sensor.soc': 90, 'sensor.pv': 6900}, **config))
        self.assertFalse(self.check({'sensor.soc': 79, 'sensor.pv': 9000}, **config))
        self.assertTrue(self.check({'sensor.soc': 80, 'sensor.pv': 7000}, **config))

    def test_invalid_sensor_values_fail_closed(self):
        for value in [None, float('nan'), float('inf'), -1, 101]:
            self.assertFalse(self.check({'sensor.soc': value}, soc_entity='sensor.soc', running=True))

    def test_windows_and_boundaries(self):
        for hour, expected in [(10, False), (11, True), (16, True), (17, False)]:
            self.assertEqual(self.check({}, hour=hour, window_start='11:00', window_end='17:00'), expected)
        for hour, expected in [(21, False), (22, True), (0, True), (5, True), (6, False)]:
            self.assertEqual(self.check({}, hour=hour, window_start='22:00', window_end='06:00'), expected)

    def test_reject_invalid_configuration(self):
        for settings in [dict(control_mode='bad'), dict(control_mode='conditions'), dict(soc_start=70, soc_stop=80), dict(soc_start=101), dict(pv_stop_w=float('nan')), dict(window_start='25:00', window_end='06:00'), dict(window_start='11:00'), dict(window_start='11:00', window_end='11:00'), dict(allow_discharge='false'), dict(soc_entity='switch.soc'), dict(unexpected=1)]:
            with self.subTest(settings=settings), self.assertRaises((ValueError, TypeError)):
                normalize_conditions(settings)


class Manager(unittest.IsolatedAsyncioTestCase):
    def setUp(self):
        self.states = {}
        self.hass = SimpleNamespace(states=SimpleNamespace(get=self.states.get))
        self.manager = SurplusManager(self.hass, SimpleNamespace(entry_id='test', title='Test', data={'grid_power_entity': 'sensor.grid'}, options={}))
        self.manager.start_delay_s = 10
        self.manager.stop_delay_s = 10
        self.manager.settle_s = 0
        self.now = 10000.0
        self.clock = patch('surplus_under_test.manager.time.time', side_effect=lambda: self.now)
        self.clock.start()
        self.addCleanup(self.clock.stop)
        self.set_state('sensor.grid', -1000)
        self.manager._turn_on = AsyncMock()
        self.manager._turn_off = AsyncMock(return_value=True)

    def set_state(self, entity, value, unit='W'):
        self.states[entity] = SimpleNamespace(state=str(value), attributes={'unit_of_measurement': unit})

    def consumer(self, name='one', **conditions):
        c = self.manager._normalize_consumer(dict(id=name, name=name, entity_id='switch.'+name, power_w=300, min_on_s=0, min_off_s=0, last_off_ts=0, conditions=conditions))
        self.manager.consumers.append(c)
        self.set_state(c['entity_id'], 'off')
        return c

    def guard(self, value=-1000, positive=True):
        self.manager.battery_guards.append(self.manager._normalize_battery_guard(dict(entity_id='sensor.battery', discharge_positive=positive, threshold_w=50)))
        self.set_state('sensor.battery', value)

    async def tick(self, advance=0):
        self.now += advance
        await self.manager.async_evaluate()

    async def test_legacy_start_delay(self):
        c = self.consumer()
        await self.tick()
        self.manager._turn_on.assert_not_awaited()
        await self.tick(10)
        self.manager._turn_on.assert_awaited_once_with(c)

    async def test_no_surplus_no_legacy_start(self):
        self.consumer()
        self.set_state('sensor.grid', 0)
        await self.tick()
        await self.tick(20)
        self.manager._turn_on.assert_not_awaited()

    async def test_conditional_reallocates_charging_and_handles_kw(self):
        c = self.consumer(control_mode='conditions', soc_entity='sensor.soc', pv_entity='sensor.pv')
        self.set_state('sensor.soc', 85, '%')
        self.set_state('sensor.pv', 7.5, 'kW')
        self.set_state('sensor.grid', 0)
        self.guard()
        await self.tick()
        await self.tick(10)
        self.manager._turn_on.assert_awaited_once_with(c)

    async def test_charging_sign_and_duplicate_sensors(self):
        c = self.consumer(control_mode='conditions', soc_entity='sensor.soc')
        self.guard(value=400, positive=False)
        self.guard(value=400, positive=False)
        self.manager.export_w = self.manager.import_w = 0
        self.assertFalse(self.manager._start_power_ok(c))  # 400 < 300 + 150; not double-counted
        self.set_state('sensor.battery', 500)
        self.assertTrue(self.manager._start_power_ok(c))

    async def test_requires_guard_unless_discharge_allowed(self):
        c = self.consumer(control_mode='conditions', soc_entity='sensor.soc')
        self.set_state('sensor.soc', 90)
        self.set_state('sensor.grid', 0)
        await self.tick()
        await self.tick(10)
        self.manager._turn_on.assert_not_awaited()
        c['conditions']['allow_discharge'] = True
        await self.tick()
        await self.tick(10)
        self.manager._turn_on.assert_awaited_once_with(c)

    async def test_no_start_during_grid_or_battery_protection(self):
        self.consumer(control_mode='conditions', window_start='11:00', window_end='17:00', allow_discharge=True)
        for grid, battery in [(200, -1000), (-1000, 200), (-1000, 'unavailable')]:
            self.set_state('sensor.grid', grid)
            self.manager.battery_guards.clear()
            self.guard(battery)
            await self.tick(20)
            await self.tick(20)
            self.manager._turn_on.assert_not_awaited()

    async def test_condition_stop_debounce_runtime_and_recovery(self):
        c = self.consumer(soc_entity='sensor.soc')
        c.update(managed_on=True, last_on_ts=self.now, min_on_s=30)
        self.set_state(c['entity_id'], 'on')
        self.set_state('sensor.soc', 69)
        await self.tick()
        await self.tick(15)
        self.manager._turn_off.assert_not_awaited()
        self.set_state('sensor.soc', 75)
        await self.tick(15)
        self.set_state('sensor.soc', 70)
        await self.tick()
        self.manager._turn_off.assert_not_awaited()
        await self.tick(10)
        self.manager._turn_off.assert_awaited_once_with(c)

    async def test_failed_condition_sensor_stops_only_managed_load(self):
        c = self.consumer(soc_entity='sensor.soc')
        c.update(managed_on=True, last_on_ts=0)
        self.set_state(c['entity_id'], 'on')
        other = self.consumer('external', soc_entity='sensor.soc')
        self.set_state(other['entity_id'], 'on')
        manual = self.consumer('manual', soc_entity='sensor.soc')
        manual.update(managed_on=True, manual_on=True)
        self.set_state(manual['entity_id'], 'on')
        await self.tick()
        await self.tick(10)
        self.manager._turn_off.assert_awaited_once_with(c)

    async def test_unmet_condition_skips_high_priority(self):
        self.consumer('first', soc_entity='sensor.soc')
        second = self.consumer('second')
        await self.tick()
        await self.tick(10)
        self.manager._turn_on.assert_awaited_once_with(second)

    async def test_eligible_high_priority_still_blocks(self):
        first = self.consumer('first')
        first['power_w'] = 2000
        self.consumer('second')
        await self.tick()
        await self.tick(20)
        self.manager._turn_on.assert_not_awaited()

    async def test_start_delay_resets_on_condition_loss(self):
        self.consumer(soc_entity='sensor.soc')
        self.set_state('sensor.soc', 80)
        await self.tick()
        self.set_state('sensor.soc', 79)
        await self.tick(9)
        self.set_state('sensor.soc', 80)
        await self.tick(2)
        self.manager._turn_on.assert_not_awaited()
        await self.tick(10)
        self.manager._turn_on.assert_awaited_once()

    async def test_test_mode_never_switches(self):
        c = self.consumer()
        self.manager.mode = 'test'
        await self.tick()
        await self.tick(10)
        self.assertIn('EIN', self.manager.test_action)
        c['managed_on'] = True
        c['conditions']['soc_entity'] = 'sensor.soc'
        self.set_state(c['entity_id'], 'on')
        await self.tick()
        await self.tick(10)
        self.assertIn('AUS', self.manager.test_action)
        self.manager._turn_on.assert_not_awaited()
        self.manager._turn_off.assert_not_awaited()

    async def test_invalid_grid_and_kw(self):
        self.consumer()
        for value in ['unknown', 'nan', 'inf']:
            self.set_state('sensor.grid', value)
            await self.tick(20)
            self.assertFalse(self.manager.grid_valid)
        self.set_state('sensor.grid', -1, 'kW')
        await self.tick()
        self.assertEqual(self.manager.export_w, 1000)
        self.manager._turn_on.assert_not_awaited()

    async def test_invalid_update_is_atomic_and_conditions_persist(self):
        c = self.consumer()
        with self.assertRaises(ValueError):
            await self.manager.async_update_consumer(c['id'], {'name': 'changed', 'conditions': {'soc_start': 20}})
        self.assertEqual(c['name'], 'one')
        await self.manager.async_update_consumer(c['id'], {'conditions': {'soc_entity': 'sensor.soc'}})
        saved = self.manager.store.async_save.call_args.args[0]
        self.manager.store.async_load.return_value = saved
        await self.manager.async_load()
        self.assertEqual(self.manager.consumers[0]['conditions']['soc_entity'], 'sensor.soc')


if __name__ == '__main__':
    unittest.main()
