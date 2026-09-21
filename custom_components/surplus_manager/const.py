"""Konstanten für den Überschussmanager."""

DOMAIN = "surplus_manager"
PLATFORMS = ["sensor", "switch"]

CONF_NAME = "name"
CONF_GRID_POWER_ENTITY = "grid_power_entity"
CONF_EXPORT_IS_NEGATIVE = "export_is_negative"
CONF_RESERVE_W = "reserve_w"
CONF_MAX_IMPORT_W = "max_import_w"
CONF_START_DELAY_S = "start_delay_s"
CONF_STOP_DELAY_S = "stop_delay_s"
CONF_SETTLE_S = "settle_s"
CONF_SCAN_INTERVAL_S = "scan_interval_s"

DEFAULT_NAME = "Überschussmanager"
DEFAULT_EXPORT_IS_NEGATIVE = True
DEFAULT_RESERVE_W = 150
DEFAULT_MAX_IMPORT_W = 100
DEFAULT_START_DELAY_S = 60
DEFAULT_STOP_DELAY_S = 30
DEFAULT_SETTLE_S = 20
DEFAULT_SCAN_INTERVAL_S = 5

STORAGE_VERSION = 1
STORAGE_KEY_PREFIX = "surplus_manager"

SERVICE_ADD_CONSUMER = "add_consumer"
SERVICE_UPDATE_CONSUMER = "update_consumer"
SERVICE_REMOVE_CONSUMER = "remove_consumer"
SERVICE_MOVE_CONSUMER = "move_consumer"
SERVICE_SET_CONSUMER_ENABLED = "set_consumer_enabled"
SERVICE_SET_ENABLED = "set_enabled"
SERVICE_SET_MANUAL = "set_manual"
SERVICE_SET_MODE = "set_mode"

MODE_AUTO = "auto"
MODE_TEST = "test"
MODE_PAUSE = "pause"
VALID_MODES = [MODE_AUTO, MODE_TEST, MODE_PAUSE]

SERVICE_ADD_BATTERY_GUARD = "add_battery_guard"
SERVICE_UPDATE_BATTERY_GUARD = "update_battery_guard"
SERVICE_REMOVE_BATTERY_GUARD = "remove_battery_guard"
