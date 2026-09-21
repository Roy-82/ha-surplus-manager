"""Regellogik des Überschussmanagers."""

from __future__ import annotations

import asyncio
from datetime import timedelta
import logging
import time
import uuid
from typing import Any, Callable

from homeassistant.core import HomeAssistant
from homeassistant.helpers.event import async_track_time_interval
from homeassistant.helpers.storage import Store

from .const import (
    CONF_GRID_POWER_ENTITY,
    CONF_EXPORT_IS_NEGATIVE,
    CONF_RESERVE_W,
    CONF_MAX_IMPORT_W,
    CONF_START_DELAY_S,
    CONF_STOP_DELAY_S,
    CONF_SETTLE_S,
    CONF_SCAN_INTERVAL_S,
    DEFAULT_EXPORT_IS_NEGATIVE,
    DEFAULT_RESERVE_W,
    DEFAULT_MAX_IMPORT_W,
    DEFAULT_START_DELAY_S,
    DEFAULT_STOP_DELAY_S,
    DEFAULT_SETTLE_S,
    DEFAULT_SCAN_INTERVAL_S,
    STORAGE_VERSION,
    STORAGE_KEY_PREFIX,
    MODE_AUTO,
    MODE_TEST,
    MODE_PAUSE,
    VALID_MODES,
)

_LOGGER = logging.getLogger(__name__)


def _as_float(value: Any, default: float = 0.0) -> float:
    try:
        return float(value)
    except (TypeError, ValueError):
        return default


def _seconds_left(until_ts: float, now: float) -> int:
    return max(0, int(round(until_ts - now)))


class SurplusManager:
    """Verwaltet Verbraucher und regelt nach Netzleistung."""

    def __init__(self, hass: HomeAssistant, entry) -> None:
        self.hass = hass
        self.entry = entry
        self.entry_id = entry.entry_id
        self.name = entry.title

        data = dict(entry.data)
        data.update(entry.options)
        self.grid_power_entity = data[CONF_GRID_POWER_ENTITY]
        self.export_is_negative = data.get(
            CONF_EXPORT_IS_NEGATIVE, DEFAULT_EXPORT_IS_NEGATIVE
        )
        self.reserve_w = float(data.get(CONF_RESERVE_W, DEFAULT_RESERVE_W))
        self.max_import_w = float(data.get(CONF_MAX_IMPORT_W, DEFAULT_MAX_IMPORT_W))
        self.start_delay_s = float(data.get(CONF_START_DELAY_S, DEFAULT_START_DELAY_S))
        self.stop_delay_s = float(data.get(CONF_STOP_DELAY_S, DEFAULT_STOP_DELAY_S))
        self.settle_s = float(data.get(CONF_SETTLE_S, DEFAULT_SETTLE_S))
        self.scan_interval_s = float(
            data.get(CONF_SCAN_INTERVAL_S, DEFAULT_SCAN_INTERVAL_S)
        )

        self.store = Store(
            hass,
            STORAGE_VERSION,
            f"{STORAGE_KEY_PREFIX}.{self.entry_id}",
        )

        self.enabled = True
        self.mode = MODE_AUTO
        self.consumers: list[dict[str, Any]] = []
        self.battery_guards: list[dict[str, Any]] = []

        self.grid_power_w: float | None = None
        self.export_w: float = 0.0
        self.import_w: float = 0.0
        self.grid_valid: bool = False
        self.test_action: str = ""

        self._listeners: set[Callable[[], None]] = set()
        self._unsub_timer = None
        self._lock = asyncio.Lock()
        self._last_action_ts = 0.0
        self._start_candidate_id: str | None = None
        self._start_candidate_since: float | None = None
        self._import_since: float | None = None

    async def async_load(self) -> None:
        stored = await self.store.async_load() or {}
        self.enabled = bool(stored.get("enabled", True))
        stored_mode = str(stored.get("mode", MODE_AUTO))
        self.mode = stored_mode if stored_mode in VALID_MODES else MODE_AUTO

        self.battery_guards = [self._normalize_battery_guard(x) for x in stored.get("battery_guards", [])]

        raw = stored.get("consumers", [])
        self.consumers = []
        had_stop_priority = []
        for item in raw:
            had_stop_priority.append("stop_priority" in item)
            self.consumers.append(self._normalize_consumer(item))

        # Migration aus älteren Versionen:
        # AUS-Priorität standardmäßig = bisheriges Verhalten, also EIN rückwärts.
        if self.consumers and not all(had_stop_priority):
            count = len(self.consumers)
            for index, consumer in enumerate(self.consumers):
                consumer["stop_priority"] = count - index
            await self._save()

        self._normalize_stop_priorities()

    async def async_start(self) -> None:
        self._unsub_timer = async_track_time_interval(
            self.hass,
            self._async_tick,
            timedelta(seconds=self.scan_interval_s),
        )
        await self.async_evaluate()

    async def async_stop(self) -> None:
        if self._unsub_timer:
            self._unsub_timer()
            self._unsub_timer = None

    def add_listener(self, callback: Callable[[], None]) -> Callable[[], None]:
        self._listeners.add(callback)

        def _remove():
            self._listeners.discard(callback)

        return _remove

    def _notify(self) -> None:
        for callback in list(self._listeners):
            try:
                callback()
            except Exception:  # noqa: BLE001
                _LOGGER.exception("Fehler beim Aktualisieren einer Entität")

    async def _save(self) -> None:
        await self.store.async_save(
            {
                "enabled": self.enabled,
                "mode": self.mode,
                "battery_guards": self.battery_guards,
                "consumers": self.consumers,
            }
        )

    def _normalize_consumer(self, item: dict[str, Any]) -> dict[str, Any]:
        now = time.time()
        climate_mode = str(item.get("climate_mode") or "")
        if climate_mode == "auto":
            climate_mode = "heat_cool"

        return {
            "id": str(item.get("id") or uuid.uuid4().hex),
            "name": str(item.get("name") or item.get("entity_id") or "Verbraucher"),
            "entity_id": str(item.get("entity_id") or ""),
            "power_sensor_entity": str(item.get("power_sensor_entity") or ""),
            "enabled": bool(item.get("enabled", True)),
            "power_w": max(0.0, _as_float(item.get("power_w"), 0.0)),
            "min_on_s": max(0.0, _as_float(item.get("min_on_s"), 900.0)),
            "min_off_s": max(0.0, _as_float(item.get("min_off_s"), 300.0)),
            "climate_mode": climate_mode,
            "target_temp": (
                None
                if item.get("target_temp") in (None, "")
                else _as_float(item.get("target_temp"), 0.0)
            ),
            "stop_priority": max(1, int(_as_float(item.get("stop_priority"), 1))),
            "managed_on": bool(item.get("managed_on", False)),
            "manual_on": bool(item.get("manual_on", False)),
            "last_on_ts": _as_float(item.get("last_on_ts"), 0.0),
            "last_off_ts": _as_float(item.get("last_off_ts"), now),
            "last_error": str(item.get("last_error") or ""),
        }

    def _normalize_battery_guard(self, item: dict[str, Any]) -> dict[str, Any]:
        return {
            "id": str(item.get("id") or uuid.uuid4().hex),
            "name": str(item.get("name") or item.get("entity_id") or "Speicher"),
            "entity_id": str(item.get("entity_id") or ""),
            "enabled": bool(item.get("enabled", True)),
            "discharge_positive": bool(item.get("discharge_positive", True)),
            "threshold_w": max(0.0, _as_float(item.get("threshold_w"), 300.0)),
        }

    def _find_battery_guard(self, guard_id: str) -> dict[str, Any] | None:
        return next((g for g in self.battery_guards if g["id"] == guard_id), None)

    def _battery_discharge_w(self, guard: dict[str, Any]) -> float | None:
        state = self.hass.states.get(guard["entity_id"])
        if state is None:
            return None
        try:
            value = float(state.state)
        except (TypeError, ValueError):
            return None
        unit = str(state.attributes.get("unit_of_measurement") or "").lower()
        if unit == "kw":
            value *= 1000.0
        return max(0.0, value if guard.get("discharge_positive", True) else -value)

    def _battery_guard_trigger(self) -> tuple[bool, str]:
        offenders = []
        for guard in self.battery_guards:
            if not guard.get("enabled"):
                continue
            discharge = self._battery_discharge_w(guard)
            if discharge is not None and discharge > guard["threshold_w"]:
                offenders.append(
                    f"{guard['name']} {int(round(discharge))} W > {int(round(guard['threshold_w']))} W"
                )
        return bool(offenders), "; ".join(offenders)

    def _find(self, consumer_id: str) -> dict[str, Any] | None:
        return next((c for c in self.consumers if c["id"] == consumer_id), None)

    def _normalize_stop_priorities(self) -> None:
        ordered = sorted(
            self.consumers,
            key=lambda c: (c.get("stop_priority", 9999), c["name"].lower()),
        )
        for idx, consumer in enumerate(ordered, start=1):
            consumer["stop_priority"] = idx

    def _read_grid(self) -> bool:
        state = self.hass.states.get(self.grid_power_entity)
        if state is None:
            self.grid_power_w = None
            self.export_w = 0.0
            self.import_w = 0.0
            self.grid_valid = False
            return False

        try:
            value = float(state.state)
        except (TypeError, ValueError):
            self.grid_power_w = None
            self.export_w = 0.0
            self.import_w = 0.0
            self.grid_valid = False
            return False

        self.grid_power_w = value
        self.grid_valid = True
        if self.export_is_negative:
            self.export_w = max(0.0, -value)
            self.import_w = max(0.0, value)
        else:
            self.export_w = max(0.0, value)
            self.import_w = max(0.0, -value)
        return True

    def _entity_is_on(self, entity_id: str) -> bool:
        state = self.hass.states.get(entity_id)
        if state is None:
            return False
        value = state.state.lower()
        if value in {"off", "idle", "unavailable", "unknown"}:
            return False
        if entity_id.startswith("climate."):
            return value != "off"
        return value not in {"off", "unavailable", "unknown"}

    def _entity_available(self, entity_id: str) -> bool:
        state = self.hass.states.get(entity_id)
        return state is not None and state.state.lower() not in {"unavailable", "unknown"}

    def _read_power_sensor(self, entity_id: str) -> float | None:
        if not entity_id:
            return None
        state = self.hass.states.get(entity_id)
        if state is None:
            return None
        try:
            value = float(state.state)
        except (TypeError, ValueError):
            return None

        # Sensoren können W oder kW liefern.
        unit = str(state.attributes.get("unit_of_measurement") or "").lower()
        if unit == "kw":
            value *= 1000.0
        return max(0.0, value)

    async def async_add_battery_guard(self, data: dict[str, Any]) -> dict[str, Any]:
        guard = self._normalize_battery_guard({
            "id": uuid.uuid4().hex,
            "name": data["name"],
            "entity_id": data["entity_id"],
            "enabled": data.get("enabled", True),
            "discharge_positive": data.get("discharge_positive", True),
            "threshold_w": data.get("threshold_w", 300),
        })
        self.battery_guards.append(guard)
        await self._save()
        self._notify()
        return guard

    async def async_update_battery_guard(self, guard_id: str, data: dict[str, Any]) -> None:
        guard = self._find_battery_guard(guard_id)
        if not guard:
            raise ValueError(f"Unbekannter Speicherwächter: {guard_id}")
        for key in ("name", "entity_id", "enabled", "discharge_positive", "threshold_w"):
            if key in data:
                guard[key] = data[key]
        norm = self._normalize_battery_guard(guard)
        guard.clear()
        guard.update(norm)
        await self._save()
        self._notify()

    async def async_remove_battery_guard(self, guard_id: str) -> None:
        guard = self._find_battery_guard(guard_id)
        if not guard:
            return
        self.battery_guards.remove(guard)
        await self._save()
        self._notify()

    async def async_set_enabled(self, enabled: bool) -> None:
        self.enabled = bool(enabled)
        self._reset_timers()
        await self._save()
        self._notify()

    async def async_set_mode(self, mode: str) -> None:
        if mode not in VALID_MODES:
            raise ValueError(f"Ungültiger Modus: {mode}")
        self.mode = mode
        self.test_action = ""
        self._reset_timers()
        await self._save()
        self._notify()

    async def async_add_consumer(self, data: dict[str, Any]) -> dict[str, Any]:
        consumer = self._normalize_consumer(
            {
                "id": uuid.uuid4().hex,
                "name": data["name"],
                "entity_id": data["entity_id"],
                "power_sensor_entity": data.get("power_sensor_entity", ""),
                "enabled": data.get("enabled", True),
                "power_w": data.get("power_w", 0),
                "min_on_s": data.get("min_on_s", 900),
                "min_off_s": data.get("min_off_s", 300),
                "climate_mode": data.get("climate_mode", ""),
                "target_temp": data.get("target_temp"),
                "stop_priority": len(self.consumers) + 1,
            }
        )
        self.consumers.append(consumer)
        self._normalize_stop_priorities()
        await self._save()
        self._notify()
        return consumer

    async def async_update_consumer(self, consumer_id: str, data: dict[str, Any]) -> None:
        consumer = self._find(consumer_id)
        if not consumer:
            raise ValueError(f"Unbekannter Verbraucher: {consumer_id}")

        for key in (
            "name",
            "entity_id",
            "power_sensor_entity",
            "enabled",
            "power_w",
            "min_on_s",
            "min_off_s",
            "climate_mode",
            "target_temp",
        ):
            if key in data:
                consumer[key] = data[key]

        normalized = self._normalize_consumer(consumer)
        consumer.clear()
        consumer.update(normalized)
        await self._save()
        self._notify()

    async def async_remove_consumer(self, consumer_id: str) -> None:
        consumer = self._find(consumer_id)
        if not consumer:
            return
        self.consumers.remove(consumer)
        self._normalize_stop_priorities()
        await self._save()
        self._reset_timers()
        self._notify()

    async def async_move_consumer(
        self,
        consumer_id: str,
        order: str = "start",
        direction: str | None = None,
        position: int | None = None,
    ) -> None:
        if order not in {"start", "stop"}:
            raise ValueError(f"Ungültige Reihenfolge: {order}")

        if order == "start":
            ordered = self.consumers
        else:
            ordered = sorted(
                self.consumers,
                key=lambda c: (c.get("stop_priority", 9999), c["name"].lower()),
            )

        idx = next((i for i, c in enumerate(ordered) if c["id"] == consumer_id), None)
        if idx is None:
            return

        if position is not None:
            target_idx = max(0, min(len(ordered) - 1, int(position) - 1))
        elif direction == "up":
            target_idx = idx - 1
        elif direction == "down":
            target_idx = idx + 1
        else:
            return

        if target_idx < 0 or target_idx >= len(ordered) or target_idx == idx:
            return

        item = ordered.pop(idx)
        ordered.insert(target_idx, item)

        if order == "start":
            self.consumers = ordered
        else:
            for pos, consumer in enumerate(ordered, start=1):
                consumer["stop_priority"] = pos

        await self._save()
        self._reset_timers()
        self._notify()

    async def async_set_consumer_enabled(
        self, consumer_id: str, enabled: bool
    ) -> None:
        consumer = self._find(consumer_id)
        if not consumer:
            raise ValueError(f"Unbekannter Verbraucher: {consumer_id}")
        consumer["enabled"] = bool(enabled)
        await self._save()
        self._reset_timers()
        self._notify()

    async def async_set_manual(self, consumer_id: str, enabled: bool) -> None:
        consumer = self._find(consumer_id)
        if not consumer:
            raise ValueError(f"Unbekannter Verbraucher: {consumer_id}")

        if enabled:
            await self._manual_turn_on(consumer)
        else:
            await self._manual_turn_off(consumer)

    async def _async_tick(self, _now) -> None:
        await self.async_evaluate()

    def _reset_timers(self) -> None:
        self._start_candidate_id = None
        self._start_candidate_since = None
        self._import_since = None

    def _stop_candidates(self) -> list[dict[str, Any]]:
        return sorted(
            self.consumers,
            key=lambda c: (c.get("stop_priority", 9999), c["name"].lower()),
        )

    async def async_evaluate(self) -> None:
        async with self._lock:
            now = time.time()
            grid_ok = self._read_grid()
            self.test_action = ""

            # Sicherer Sensorfehler-Modus:
            # Bei ungültigem Netzsensor keine automatische Schaltung.
            if not grid_ok:
                self._reset_timers()
                self._notify()
                return

            if not self.enabled:
                self._reset_timers()
                self._notify()
                return

            if self.mode == MODE_PAUSE:
                self._reset_timers()
                self._notify()
                return

            if now - self._last_action_ts < self.settle_s:
                self._notify()
                return

            # 1) Abschalten bei Netzbezug ODER zu hoher Speicherentladung.
            battery_trigger, battery_reason = self._battery_guard_trigger()
            if self.import_w > self.max_import_w or battery_trigger:
                if self._import_since is None:
                    self._import_since = now

                if now - self._import_since >= self.stop_delay_s:
                    for consumer in self._stop_candidates():
                        if consumer.get("manual_on"):
                            continue
                        if not consumer.get("managed_on"):
                            continue
                        if now - consumer.get("last_on_ts", 0) < consumer["min_on_s"]:
                            continue

                        if self.mode == MODE_TEST:
                            reason = battery_reason or f"Netzbezug {int(round(self.import_w))} W"
                            self.test_action = f"AUS: {consumer['name']} · {reason}"
                            self._notify()
                            return

                        await self._turn_off(consumer)
                        self._last_action_ts = time.time()
                        self._import_since = None
                        self._start_candidate_id = None
                        self._start_candidate_since = None
                        self._notify()
                        return
            else:
                self._import_since = None

            # 2) Verbraucher streng nach EIN-Reihenfolge zuschalten.
            for consumer in self.consumers:
                if not consumer["enabled"]:
                    continue
                if consumer.get("manual_on"):
                    continue
                if self._entity_is_on(consumer["entity_id"]):
                    continue
                if not self._entity_available(consumer["entity_id"]):
                    # Ein nicht verfügbares Gerät darf niedrigere Prioritäten
                    # nicht dauerhaft blockieren.
                    continue
                if now - consumer.get("last_off_ts", 0) < consumer["min_off_s"]:
                    # Mindestpause einer höheren Priorität blockiert bewusst.
                    self._start_candidate_id = None
                    self._start_candidate_since = None
                    self._notify()
                    return

                needed = consumer["power_w"] + self.reserve_w
                if self.export_w >= needed:
                    if self._start_candidate_id != consumer["id"]:
                        self._start_candidate_id = consumer["id"]
                        self._start_candidate_since = now
                        self._notify()
                        return

                    if (
                        self._start_candidate_since is not None
                        and now - self._start_candidate_since >= self.start_delay_s
                    ):
                        if self.mode == MODE_TEST:
                            self.test_action = f"EIN: {consumer['name']}"
                            self._notify()
                            return

                        await self._turn_on(consumer)
                        self._last_action_ts = time.time()
                        self._start_candidate_id = None
                        self._start_candidate_since = None
                        self._import_since = None
                        self._notify()
                        return

                    self._notify()
                    return

                # Strenge Priorität: reicht es für dieses Gerät nicht, wird
                # kein niedriger priorisiertes Gerät daran vorbeigelassen.
                self._start_candidate_id = None
                self._start_candidate_since = None
                self._notify()
                return

            self._start_candidate_id = None
            self._start_candidate_since = None
            self._notify()

    async def _climate_turn_on(self, consumer: dict[str, Any], prefix: str = "") -> None:
        entity_id = consumer["entity_id"]
        hvac_mode = consumer.get("climate_mode") or "heat"
        if hvac_mode == "auto":
            hvac_mode = "heat_cool"

        # Verifizierter Weg für die HANTECH/ESPHome Climate-Entitäten:
        # zuerst HVAC-Modus, dann nach bestätigtem Einschalten die Temperatur.
        await self.hass.services.async_call(
            "climate",
            "set_hvac_mode",
            {"entity_id": entity_id, "hvac_mode": hvac_mode},
            blocking=True,
        )

        switched_on = False
        for _ in range(12):
            await asyncio.sleep(1)
            if self._entity_is_on(entity_id):
                switched_on = True
                break

        if not switched_on:
            raise RuntimeError(
                f"{prefix}HVAC-Modus wurde gesendet, die Climate-Entität blieb "
                "nach 12 Sekunden auf 'off'."
            )

        if consumer.get("target_temp") is not None:
            await self.hass.services.async_call(
                "climate",
                "set_temperature",
                {
                    "entity_id": entity_id,
                    "temperature": consumer["target_temp"],
                },
                blocking=True,
            )

    async def _generic_turn_on(self, entity_id: str, prefix: str = "") -> None:
        await self.hass.services.async_call(
            "homeassistant",
            "turn_on",
            {"entity_id": entity_id},
            blocking=True,
        )
        await asyncio.sleep(1)
        if not self._entity_is_on(entity_id):
            raise RuntimeError(
                f"{prefix}Einschaltbefehl wurde gesendet, die Entität blieb aus."
            )

    async def _turn_on(self, consumer: dict[str, Any]) -> None:
        entity_id = consumer["entity_id"]
        try:
            if entity_id.startswith("climate."):
                await self._climate_turn_on(consumer)
            else:
                await self._generic_turn_on(entity_id)

            now = time.time()
            consumer["managed_on"] = True
            consumer["manual_on"] = False
            consumer["last_on_ts"] = now
            consumer["last_error"] = ""
            await self._save()
            self._notify()
            _LOGGER.info("Überschussmanager EIN: %s", consumer["name"])
        except Exception as err:  # noqa: BLE001
            consumer["managed_on"] = False
            consumer["last_error"] = str(err)
            await self._save()
            self._notify()
            _LOGGER.exception("Einschalten fehlgeschlagen: %s", consumer["name"])

    async def _climate_turn_off(self, entity_id: str) -> None:
        """Climate zuverlässig ausschalten und Rückmeldung prüfen."""
        # Der HVAC-Modus 'off' gehört bei den verwendeten Climate-Entitäten
        # zu den gültigen Modi und ist deshalb der bevorzugte Weg.
        await self.hass.services.async_call(
            "climate",
            "set_hvac_mode",
            {"entity_id": entity_id, "hvac_mode": "off"},
            blocking=True,
        )

        for _ in range(8):
            await asyncio.sleep(1)
            if not self._entity_is_on(entity_id):
                return

        # Fallback für Integrationen, die turn_off separat implementieren.
        if self.hass.services.has_service("climate", "turn_off"):
            await self.hass.services.async_call(
                "climate",
                "turn_off",
                {"entity_id": entity_id},
                blocking=True,
            )
            for _ in range(4):
                await asyncio.sleep(1)
                if not self._entity_is_on(entity_id):
                    return

        raise RuntimeError(
            "Ausschaltbefehl wurde gesendet, die Climate-Entität blieb eingeschaltet."
        )

    async def _generic_turn_off(self, entity_id: str) -> None:
        await self.hass.services.async_call(
            "homeassistant",
            "turn_off",
            {"entity_id": entity_id},
            blocking=True,
        )
        for _ in range(3):
            await asyncio.sleep(1)
            if not self._entity_is_on(entity_id):
                return
        raise RuntimeError(
            "Ausschaltbefehl wurde gesendet, die Entität blieb eingeschaltet."
        )

    async def _turn_off(self, consumer: dict[str, Any]) -> bool:
        entity_id = consumer["entity_id"]
        try:
            if entity_id.startswith("climate."):
                await self._climate_turn_off(entity_id)
            else:
                await self._generic_turn_off(entity_id)

            now = time.time()
            consumer["managed_on"] = False
            consumer["last_off_ts"] = now
            consumer["last_error"] = ""
            await self._save()
            self._notify()
            _LOGGER.info("Überschussmanager AUS: %s", consumer["name"])
            return True
        except Exception as err:  # noqa: BLE001
            consumer["last_error"] = str(err)
            await self._save()
            self._notify()
            _LOGGER.exception("Ausschalten fehlgeschlagen: %s", consumer["name"])
            return False

    async def _manual_turn_on(self, consumer: dict[str, Any]) -> None:
        entity_id = consumer["entity_id"]
        try:
            if entity_id.startswith("climate."):
                await self._climate_turn_on(consumer, "Manuelles Einschalten: ")
            else:
                await self._generic_turn_on(entity_id, "Manuelles Einschalten: ")

            now = time.time()
            consumer["manual_on"] = True
            consumer["managed_on"] = False
            consumer["last_on_ts"] = now
            consumer["last_error"] = ""
            self._reset_timers()
            await self._save()
            self._notify()
            _LOGGER.info("Überschussmanager MANUELL EIN: %s", consumer["name"])
        except Exception as err:  # noqa: BLE001
            consumer["manual_on"] = False
            consumer["last_error"] = str(err)
            await self._save()
            self._notify()
            _LOGGER.exception("Manuelles Einschalten fehlgeschlagen: %s", consumer["name"])

    async def _manual_turn_off(self, consumer: dict[str, Any]) -> None:
        success = await self._turn_off(consumer)
        if success:
            consumer["manual_on"] = False
            consumer["managed_on"] = False
            self._reset_timers()
            await self._save()
            self._notify()
            _LOGGER.info("Überschussmanager MANUELL AUS / AUTO: %s", consumer["name"])
        else:
            # Bei fehlgeschlagenem Ausschalten bleibt die manuelle Sperre aktiv.
            # So greift AUTO nicht unerwartet in einen unklaren Zustand ein.
            consumer["manual_on"] = True
            await self._save()
            self._notify()

    def _reason_for_consumer(
        self,
        consumer: dict[str, Any],
        index: int,
        now: float,
        is_on: bool,
        available: bool,
    ) -> tuple[str, int]:
        """Gibt (Grund, Countdown in Sekunden) zurück."""

        if consumer.get("last_error"):
            return "Fehler – Details über !", 0
        if not available:
            return "Entität nicht verfügbar", 0
        if consumer.get("manual_on"):
            if is_on:
                return "Manuell eingeschaltet – AUTO gesperrt", 0
            return "Manueller Modus – extern ausgeschaltet", 0
        if not consumer.get("enabled"):
            return "Für AUTO gesperrt", 0
        if not self.grid_valid:
            return "Netzsensor nicht verfügbar – keine Automatik", 0
        if not self.enabled:
            return "Regelung ausgeschaltet", 0
        if self.mode == MODE_PAUSE:
            return "Pause – keine automatische Schaltung", 0
        if self.mode == MODE_TEST:
            if self.test_action:
                return f"Testmodus · {self.test_action}", 0
            return "Testmodus – beobachtet nur", 0

        if is_on:
            if consumer.get("managed_on"):
                remaining = _seconds_left(
                    consumer.get("last_on_ts", 0) + consumer["min_on_s"], now
                )
                if remaining:
                    return "Mindestlaufzeit", remaining
                if self.import_w > self.max_import_w:
                    return "Läuft · wartet ggf. auf AUS-Priorität", 0
                return "Automatisch eingeschaltet", 0
            return "Extern eingeschaltet – Automatik schaltet es nicht ab", 0

        remaining = _seconds_left(
            consumer.get("last_off_ts", 0) + consumer["min_off_s"], now
        )
        if remaining:
            return "Mindestpause", remaining

        # Höhere Prioritäten erklären, warum dieser Verbraucher nicht dran ist.
        for higher in self.consumers[:index]:
            if not higher.get("enabled") or higher.get("manual_on"):
                continue
            if self._entity_is_on(higher["entity_id"]):
                continue
            if not self._entity_available(higher["entity_id"]):
                continue
            higher_remaining = _seconds_left(
                higher.get("last_off_ts", 0) + higher["min_off_s"], now
            )
            if higher_remaining:
                return f"Wartet auf höhere Priorität: {higher['name']}", higher_remaining
            higher_needed = higher["power_w"] + self.reserve_w
            if self.export_w < higher_needed:
                return f"Höhere Priorität wartet: {higher['name']}", 0

        needed = consumer["power_w"] + self.reserve_w
        if self.export_w < needed:
            return f"Zu wenig Überschuss · benötigt {int(round(needed))} W", 0

        if self._start_candidate_id == consumer["id"] and self._start_candidate_since:
            remaining = _seconds_left(
                self._start_candidate_since + self.start_delay_s, now
            )
            if remaining:
                return "Einschaltverzögerung", remaining

        if now - self._last_action_ts < self.settle_s:
            remaining = _seconds_left(self._last_action_ts + self.settle_s, now)
            return "Beruhigungszeit nach Schaltung", remaining

        return "Bereit zum Einschalten", 0

    @property
    def state_attributes(self) -> dict[str, Any]:
        now = time.time()
        consumers = []
        total_active_power_w = 0.0

        for idx, consumer in enumerate(self.consumers, start=1):
            item = dict(consumer)
            entity_state = self.hass.states.get(consumer["entity_id"])
            is_on = self._entity_is_on(consumer["entity_id"])
            available = self._entity_available(consumer["entity_id"])
            current_power_w = self._read_power_sensor(
                consumer.get("power_sensor_entity", "")
            )

            if is_on:
                total_active_power_w += (
                    current_power_w
                    if current_power_w is not None
                    else consumer["power_w"]
                )

            reason, countdown = self._reason_for_consumer(
                consumer,
                idx - 1,
                now,
                is_on,
                available,
            )

            item["priority"] = idx
            item["start_priority"] = idx
            item["stop_priority"] = consumer.get(
                "stop_priority", len(self.consumers) - idx + 1
            )
            item["entity_state"] = entity_state.state if entity_state else "unavailable"
            item["is_on"] = is_on
            item["available"] = available
            item["current_power_w"] = (
                None if current_power_w is None else round(current_power_w, 1)
            )
            item["reason"] = reason
            item["countdown_s"] = countdown
            consumers.append(item)

        battery_trigger, battery_reason = self._battery_guard_trigger()
        battery_guards = []
        for guard in self.battery_guards:
            discharge = self._battery_discharge_w(guard)
            battery_guards.append({
                **guard,
                "discharge_w": None if discharge is None else round(discharge, 1),
                "triggered": bool(
                    guard.get("enabled")
                    and discharge is not None
                    and discharge > guard["threshold_w"]
                ),
            })

        return {
            "config_entry_id": self.entry_id,
            "grid_power_entity": self.grid_power_entity,
            "grid_power_w": self.grid_power_w,
            "grid_valid": self.grid_valid,
            "export_w": round(self.export_w, 1),
            "import_w": round(self.import_w, 1),
            "reserve_w": self.reserve_w,
            "max_import_w": self.max_import_w,
            "start_delay_s": self.start_delay_s,
            "stop_delay_s": self.stop_delay_s,
            "settle_s": self.settle_s,
            "enabled": self.enabled,
            "mode": self.mode,
            "test_action": self.test_action,
            "total_active_power_w": round(total_active_power_w, 1),
            "battery_guard_triggered": battery_trigger,
            "battery_guard_reason": battery_reason,
            "battery_guards": battery_guards,
            "consumers": consumers,
        }