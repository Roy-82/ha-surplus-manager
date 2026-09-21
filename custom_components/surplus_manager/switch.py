"""Hauptschalter des Überschussmanagers."""

from __future__ import annotations

from homeassistant.components.switch import SwitchEntity
from homeassistant.helpers.entity import DeviceInfo

from .const import DOMAIN


async def async_setup_entry(hass, entry, async_add_entities):
    manager = hass.data[DOMAIN][entry.entry_id]
    async_add_entities([SurplusManagerSwitch(manager)], True)


class SurplusManagerSwitch(SwitchEntity):
    _attr_icon = "mdi:home-lightning-bolt"

    def __init__(self, manager):
        self.manager = manager
        self._attr_unique_id = f"{manager.entry_id}_enabled"
        self._attr_name = f"{manager.name} Regelung"
        self._remove_listener = None

    @property
    def is_on(self):
        return self.manager.enabled

    async def async_turn_on(self, **kwargs):
        await self.manager.async_set_enabled(True)

    async def async_turn_off(self, **kwargs):
        await self.manager.async_set_enabled(False)

    async def async_added_to_hass(self):
        self._remove_listener = self.manager.add_listener(self.async_write_ha_state)

    async def async_will_remove_from_hass(self):
        if self._remove_listener:
            self._remove_listener()
            self._remove_listener = None

    @property
    def device_info(self):
        return DeviceInfo(
            identifiers={(DOMAIN, self.manager.entry_id)},
            name=self.manager.name,
            manufacturer="Lokal",
            model="PV-Überschussmanager",
        )
