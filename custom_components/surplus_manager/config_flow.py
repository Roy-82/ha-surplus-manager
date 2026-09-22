"""Config Flow und Optionen für den Überschussmanager."""

from __future__ import annotations

import voluptuous as vol

from homeassistant import config_entries
from homeassistant.helpers import selector

from .const import (
    DOMAIN,
    CONF_NAME,
    CONF_GRID_POWER_ENTITY,
    CONF_EXPORT_IS_NEGATIVE,
    CONF_RESERVE_W,
    CONF_MAX_IMPORT_W,
    CONF_START_DELAY_S,
    CONF_STOP_DELAY_S,
    CONF_SETTLE_S,
    CONF_SCAN_INTERVAL_S,
    CONF_LANGUAGE,
    DEFAULT_NAME,
    DEFAULT_EXPORT_IS_NEGATIVE,
    DEFAULT_RESERVE_W,
    DEFAULT_MAX_IMPORT_W,
    DEFAULT_START_DELAY_S,
    DEFAULT_STOP_DELAY_S,
    DEFAULT_SETTLE_S,
    DEFAULT_SCAN_INTERVAL_S,
    DEFAULT_LANGUAGE,
    SUPPORTED_LANGUAGES,
)


def _schema(values: dict):
    return vol.Schema(
        {
            vol.Required(CONF_NAME, default=values.get(CONF_NAME, DEFAULT_NAME)): str,
            vol.Required(
                CONF_LANGUAGE,
                default=values.get(CONF_LANGUAGE, DEFAULT_LANGUAGE),
            ): selector.SelectSelector(
                selector.SelectSelectorConfig(
                    options=SUPPORTED_LANGUAGES,
                    mode=selector.SelectSelectorMode.DROPDOWN,
                    translation_key="language",
                )
            ),
            vol.Required(
                CONF_GRID_POWER_ENTITY,
                default=values.get(CONF_GRID_POWER_ENTITY),
            ): selector.EntitySelector(selector.EntitySelectorConfig(domain=["sensor"])),
            vol.Required(
                CONF_EXPORT_IS_NEGATIVE,
                default=values.get(CONF_EXPORT_IS_NEGATIVE, DEFAULT_EXPORT_IS_NEGATIVE),
            ): bool,
            vol.Required(
                CONF_RESERVE_W,
                default=values.get(CONF_RESERVE_W, DEFAULT_RESERVE_W),
            ): selector.NumberSelector(
                selector.NumberSelectorConfig(
                    min=0, max=5000, step=10,
                    mode=selector.NumberSelectorMode.BOX,
                    unit_of_measurement="W",
                )
            ),
            vol.Required(
                CONF_MAX_IMPORT_W,
                default=values.get(CONF_MAX_IMPORT_W, DEFAULT_MAX_IMPORT_W),
            ): selector.NumberSelector(
                selector.NumberSelectorConfig(
                    min=0, max=5000, step=10,
                    mode=selector.NumberSelectorMode.BOX,
                    unit_of_measurement="W",
                )
            ),
            vol.Required(
                CONF_START_DELAY_S,
                default=values.get(CONF_START_DELAY_S, DEFAULT_START_DELAY_S),
            ): selector.NumberSelector(
                selector.NumberSelectorConfig(
                    min=0, max=900, step=5,
                    mode=selector.NumberSelectorMode.BOX,
                    unit_of_measurement="s",
                )
            ),
            vol.Required(
                CONF_STOP_DELAY_S,
                default=values.get(CONF_STOP_DELAY_S, DEFAULT_STOP_DELAY_S),
            ): selector.NumberSelector(
                selector.NumberSelectorConfig(
                    min=0, max=900, step=5,
                    mode=selector.NumberSelectorMode.BOX,
                    unit_of_measurement="s",
                )
            ),
            vol.Required(
                CONF_SETTLE_S,
                default=values.get(CONF_SETTLE_S, DEFAULT_SETTLE_S),
            ): selector.NumberSelector(
                selector.NumberSelectorConfig(
                    min=0, max=300, step=5,
                    mode=selector.NumberSelectorMode.BOX,
                    unit_of_measurement="s",
                )
            ),
            vol.Required(
                CONF_SCAN_INTERVAL_S,
                default=values.get(CONF_SCAN_INTERVAL_S, DEFAULT_SCAN_INTERVAL_S),
            ): selector.NumberSelector(
                selector.NumberSelectorConfig(
                    min=2, max=60, step=1,
                    mode=selector.NumberSelectorMode.BOX,
                    unit_of_measurement="s",
                )
            ),
        }
    )


class SurplusManagerConfigFlow(config_entries.ConfigFlow, domain=DOMAIN):
    VERSION = 1

    async def async_step_user(self, user_input=None):
        if user_input is not None:
            await self.async_set_unique_id("surplus_manager_main")
            self._abort_if_unique_id_configured()
            return self.async_create_entry(
                title=user_input.get(CONF_NAME, DEFAULT_NAME),
                data=user_input,
            )

        return self.async_show_form(step_id="user", data_schema=_schema({}))

    @staticmethod
    def async_get_options_flow(config_entry):
        return SurplusManagerOptionsFlow(config_entry)


class SurplusManagerOptionsFlow(config_entries.OptionsFlow):
    def __init__(self, config_entry):
        self.config_entry = config_entry

    async def async_step_init(self, user_input=None):
        current = dict(self.config_entry.data)
        current.update(self.config_entry.options)

        if user_input is not None:
            return self.async_create_entry(title="", data=user_input)

        return self.async_show_form(step_id="init", data_schema=_schema(current))
