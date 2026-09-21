"""Überschussmanager Integration."""

from __future__ import annotations

from pathlib import Path

import voluptuous as vol

from homeassistant.core import HomeAssistant, ServiceCall
from homeassistant.components.http import StaticPathConfig
from homeassistant.config_entries import ConfigEntry
from homeassistant.helpers import config_validation as cv

from .const import (
    DOMAIN,
    PLATFORMS,
    SERVICE_ADD_CONSUMER,
    SERVICE_UPDATE_CONSUMER,
    SERVICE_REMOVE_CONSUMER,
    SERVICE_MOVE_CONSUMER,
    SERVICE_SET_CONSUMER_ENABLED,
    SERVICE_SET_ENABLED,
    SERVICE_SET_MANUAL,
    SERVICE_SET_MODE,
    SERVICE_ADD_BATTERY_GUARD,
    SERVICE_UPDATE_BATTERY_GUARD,
    SERVICE_REMOVE_BATTERY_GUARD,
    VALID_MODES,
)
from .manager import SurplusManager

SERVICE_ENTRY = vol.Required("config_entry_id")
SERVICE_CONSUMER_ID = vol.Required("consumer_id")


async def async_setup(hass: HomeAssistant, config: dict) -> bool:
    hass.data.setdefault(DOMAIN, {})

    frontend_dir = Path(__file__).parent / "frontend"
    await hass.http.async_register_static_paths(
        [StaticPathConfig("/surplus_manager", str(frontend_dir), False)]
    )

    async def _get_manager(call: ServiceCall) -> SurplusManager:
        entry_id = call.data["config_entry_id"]
        manager = hass.data[DOMAIN].get(entry_id)
        if not manager:
            raise ValueError(f"Unbekannter Überschussmanager: {entry_id}")
        return manager

    async def add_consumer(call: ServiceCall):
        manager = await _get_manager(call)
        data = dict(call.data)
        data.pop("config_entry_id", None)
        await manager.async_add_consumer(data)

    async def update_consumer(call: ServiceCall):
        manager = await _get_manager(call)
        data = dict(call.data)
        consumer_id = data.pop("consumer_id")
        data.pop("config_entry_id", None)
        await manager.async_update_consumer(consumer_id, data)

    async def remove_consumer(call: ServiceCall):
        manager = await _get_manager(call)
        await manager.async_remove_consumer(call.data["consumer_id"])

    async def move_consumer(call: ServiceCall):
        manager = await _get_manager(call)
        await manager.async_move_consumer(
            call.data["consumer_id"],
            order=call.data.get("order", "start"),
            direction=call.data.get("direction"),
            position=call.data.get("position"),
        )

    async def set_consumer_enabled(call: ServiceCall):
        manager = await _get_manager(call)
        await manager.async_set_consumer_enabled(
            call.data["consumer_id"], call.data["enabled"]
        )

    async def set_enabled(call: ServiceCall):
        manager = await _get_manager(call)
        await manager.async_set_enabled(call.data["enabled"])

    async def set_manual(call: ServiceCall):
        manager = await _get_manager(call)
        await manager.async_set_manual(
            call.data["consumer_id"], call.data["enabled"]
        )

    async def set_mode(call: ServiceCall):
        manager = await _get_manager(call)
        await manager.async_set_mode(call.data["mode"])

    async def add_battery_guard(call: ServiceCall):
        manager = await _get_manager(call)
        data = dict(call.data)
        data.pop("config_entry_id", None)
        await manager.async_add_battery_guard(data)

    async def update_battery_guard(call: ServiceCall):
        manager = await _get_manager(call)
        data = dict(call.data)
        guard_id = data.pop("guard_id")
        data.pop("config_entry_id", None)
        await manager.async_update_battery_guard(guard_id, data)

    async def remove_battery_guard(call: ServiceCall):
        manager = await _get_manager(call)
        await manager.async_remove_battery_guard(call.data["guard_id"])

    if not hass.services.has_service(DOMAIN, SERVICE_ADD_CONSUMER):
        common_consumer_fields = {
            vol.Required("name"): cv.string,
            vol.Required("entity_id"): cv.entity_id,
            vol.Required("power_w"): vol.Coerce(float),
            vol.Optional("power_sensor_entity", default=""): vol.Any("", cv.entity_id),
            vol.Optional("enabled", default=True): cv.boolean,
            vol.Optional("min_on_s", default=900): vol.Coerce(float),
            vol.Optional("min_off_s", default=300): vol.Coerce(float),
            vol.Optional("climate_mode", default=""): cv.string,
            vol.Optional("target_temp"): vol.Coerce(float),
        }

        hass.services.async_register(
            DOMAIN,
            SERVICE_ADD_CONSUMER,
            add_consumer,
            schema=vol.Schema({SERVICE_ENTRY: cv.string, **common_consumer_fields}),
        )

        update_fields = {
            vol.Optional("name"): cv.string,
            vol.Optional("entity_id"): cv.entity_id,
            vol.Optional("power_w"): vol.Coerce(float),
            vol.Optional("power_sensor_entity"): vol.Any("", cv.entity_id),
            vol.Optional("enabled"): cv.boolean,
            vol.Optional("min_on_s"): vol.Coerce(float),
            vol.Optional("min_off_s"): vol.Coerce(float),
            vol.Optional("climate_mode"): cv.string,
            vol.Optional("target_temp"): vol.Any(None, vol.Coerce(float)),
        }
        hass.services.async_register(
            DOMAIN,
            SERVICE_UPDATE_CONSUMER,
            update_consumer,
            schema=vol.Schema(
                {
                    SERVICE_ENTRY: cv.string,
                    SERVICE_CONSUMER_ID: cv.string,
                    **update_fields,
                }
            ),
        )

        hass.services.async_register(
            DOMAIN,
            SERVICE_REMOVE_CONSUMER,
            remove_consumer,
            schema=vol.Schema(
                {SERVICE_ENTRY: cv.string, SERVICE_CONSUMER_ID: cv.string}
            ),
        )

        hass.services.async_register(
            DOMAIN,
            SERVICE_MOVE_CONSUMER,
            move_consumer,
            schema=vol.Schema(
                {
                    SERVICE_ENTRY: cv.string,
                    SERVICE_CONSUMER_ID: cv.string,
                    vol.Optional("direction"): vol.In(["up", "down"]),
                    vol.Optional("position"): vol.Coerce(int),
                    vol.Optional("order", default="start"): vol.In(["start", "stop"]),
                }
            ),
        )

        hass.services.async_register(
            DOMAIN,
            SERVICE_SET_CONSUMER_ENABLED,
            set_consumer_enabled,
            schema=vol.Schema(
                {
                    SERVICE_ENTRY: cv.string,
                    SERVICE_CONSUMER_ID: cv.string,
                    vol.Required("enabled"): cv.boolean,
                }
            ),
        )

        hass.services.async_register(
            DOMAIN,
            SERVICE_SET_ENABLED,
            set_enabled,
            schema=vol.Schema(
                {SERVICE_ENTRY: cv.string, vol.Required("enabled"): cv.boolean}
            ),
        )

        hass.services.async_register(
            DOMAIN,
            SERVICE_SET_MANUAL,
            set_manual,
            schema=vol.Schema(
                {
                    SERVICE_ENTRY: cv.string,
                    SERVICE_CONSUMER_ID: cv.string,
                    vol.Required("enabled"): cv.boolean,
                }
            ),
        )

        hass.services.async_register(
            DOMAIN,
            SERVICE_SET_MODE,
            set_mode,
            schema=vol.Schema(
                {
                    SERVICE_ENTRY: cv.string,
                    vol.Required("mode"): vol.In(VALID_MODES),
                }
            ),
        )

        battery_fields = {
            vol.Required("name"): cv.string,
            vol.Required("entity_id"): cv.entity_id,
            vol.Optional("enabled", default=True): cv.boolean,
            vol.Optional("discharge_positive", default=True): cv.boolean,
            vol.Required("threshold_w"): vol.Coerce(float),
        }

        hass.services.async_register(
            DOMAIN,
            SERVICE_ADD_BATTERY_GUARD,
            add_battery_guard,
            schema=vol.Schema({SERVICE_ENTRY: cv.string, **battery_fields}),
        )
        hass.services.async_register(
            DOMAIN,
            SERVICE_UPDATE_BATTERY_GUARD,
            update_battery_guard,
            schema=vol.Schema({
                SERVICE_ENTRY: cv.string,
                vol.Required("guard_id"): cv.string,
                vol.Optional("name"): cv.string,
                vol.Optional("entity_id"): cv.entity_id,
                vol.Optional("enabled"): cv.boolean,
                vol.Optional("discharge_positive"): cv.boolean,
                vol.Optional("threshold_w"): vol.Coerce(float),
            }),
        )
        hass.services.async_register(
            DOMAIN,
            SERVICE_REMOVE_BATTERY_GUARD,
            remove_battery_guard,
            schema=vol.Schema({
                SERVICE_ENTRY: cv.string,
                vol.Required("guard_id"): cv.string,
            }),
        )

    return True


async def async_setup_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    entry.async_on_unload(entry.add_update_listener(_async_update_listener))
    manager = SurplusManager(hass, entry)
    await manager.async_load()

    hass.data.setdefault(DOMAIN, {})
    hass.data[DOMAIN][entry.entry_id] = manager

    await hass.config_entries.async_forward_entry_setups(entry, PLATFORMS)
    await manager.async_start()
    return True


async def async_unload_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    manager = hass.data[DOMAIN].get(entry.entry_id)
    if manager:
        await manager.async_stop()

    ok = await hass.config_entries.async_unload_platforms(entry, PLATFORMS)
    if ok:
        hass.data[DOMAIN].pop(entry.entry_id, None)
    return ok


async def _async_update_listener(hass: HomeAssistant, entry: ConfigEntry) -> None:
    """Integration nach geänderten Optionen neu laden."""
    await hass.config_entries.async_reload(entry.entry_id)
