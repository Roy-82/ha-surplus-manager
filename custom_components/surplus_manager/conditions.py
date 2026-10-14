"""Validated per-consumer conditions, independent of Home Assistant."""
import math
import re

DEFAULTS = dict(control_mode="surplus", soc_entity="", soc_start=80.0, soc_stop=70.0,
                pv_entity="", pv_start_w=7000.0, pv_stop_w=5000.0,
                window_start="", window_end="", allow_discharge=False)


def normalize_conditions(value):
    if not isinstance(value, dict) or set(value) - set(DEFAULTS):
        raise ValueError("Ungültige Bedingungen")
    result = {**DEFAULTS, **value}
    if result["control_mode"] not in {"surplus", "conditions"}:
        raise ValueError("Ungültiger Regelmodus")
    if not isinstance(result["allow_discharge"], bool):
        raise ValueError("allow_discharge muss ein Wahrheitswert sein")
    for key in ("soc_entity", "pv_entity"):
        if not isinstance(result[key], str) or (result[key] and not re.fullmatch(r"sensor\.[a-z0-9_]+", result[key])):
            raise ValueError("Bitte eine gültige Sensor-Entität auswählen")
    for start, stop, maximum in (("soc_start", "soc_stop", 100), ("pv_start_w", "pv_stop_w", math.inf)):
        result[start], result[stop] = float(result[start]), float(result[stop])
        if not all(math.isfinite(result[k]) for k in (start, stop)) or not 0 <= result[stop] < result[start] <= maximum:
            raise ValueError("Einschaltschwelle muss größer als Ausschaltschwelle sein (SoC: 0–100 %)")
    for key in ("window_start", "window_end"):
        if not isinstance(result[key], str) or (result[key] and not re.fullmatch(r"(?:[01]\d|2[0-3]):[0-5]\d", result[key])):
            raise ValueError("Zeitfenster benötigt Uhrzeiten im Format HH:MM")
    if bool(result["window_start"]) != bool(result["window_end"]) or (result["window_start"] and result["window_start"] == result["window_end"]):
        raise ValueError("Zeitfenster benötigt unterschiedliche Start- und Endzeiten")
    if result["control_mode"] == "conditions" and not any(result[k] for k in ("soc_entity", "pv_entity", "window_start")):
        raise ValueError("Bedingungsbetrieb benötigt mindestens eine Bedingung")
    return result


def evaluate_conditions(config, running, read_value, local_now):
    for entity_key, start, stop, label, power in (
        ("soc_entity", "soc_start", "soc_stop", "Akkuladestand", False),
        ("pv_entity", "pv_start_w", "pv_stop_w", "PV-Leistung", True),
    ):
        if not config[entity_key]:
            continue
        value = read_value(config[entity_key], power)
        if value is None or not math.isfinite(value) or value < 0 or (not power and value > 100):
            return False, f"{label}: Sensor nicht verfügbar oder ungültig"
        threshold = config[stop if running else start]
        if (value <= threshold if running else value < threshold):
            return False, f"{label}: Schwelle nicht erreicht ({value:g} / {threshold:g})"
    start, end = config["window_start"], config["window_end"]
    if start:
        current = local_now.strftime("%H:%M")
        inside = start <= current < end if start < end else current >= start or current < end
        if not inside:
            return False, "Außerhalb des Zeitfensters"
    return True, "Bedingungen erfüllt"
