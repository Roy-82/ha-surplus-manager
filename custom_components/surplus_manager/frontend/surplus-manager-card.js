class SurplusManagerCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this._config = {};
    this._hass = null;
    this._selectedId = null;
    this._orderMode = "start";
    this._renderQueued = false;
    this._dragId = null;
  }

  setConfig(config) {
    if (!config.entity) {
      throw new Error("Bitte 'entity:' mit dem Überschussmanager-Sensor angeben.");
    }
    this._config = config;
    this._render();
  }

  set hass(hass) {
    this._hass = hass;
    const editor = this.shadowRoot?.querySelector("#editor");
    const settingsEditor = this.shadowRoot?.querySelector("#settingsEditor");
    const batteryEditor = this.shadowRoot?.querySelector("#batteryEditor");
    if (editor?.open || settingsEditor?.open || batteryEditor?.open) return;
    this._queueRender();
  }

  getCardSize() {
    const st = this._state();
    const count = st?.attributes?.consumers?.length || 1;
    return Math.max(6, Math.ceil((230 + count * 66) / 50));
  }

  _queueRender() {
    if (this._renderQueued) return;
    this._renderQueued = true;
    requestAnimationFrame(() => {
      this._renderQueued = false;
      this._render();
    });
  }

  _state() {
    return this._hass?.states?.[this._config.entity];
  }

  _esc(v) {
    return String(v ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  _fmtW(v) {
    if (v === null || v === undefined || Number.isNaN(Number(v))) return "–";
    const n = Number(v);
    if (Math.abs(n) >= 1000) return `${(n / 1000).toFixed(2)} kW`;
    return `${Math.round(n)} W`;
  }

  _fmtSec(v) {
    const n = Math.max(0, Number(v || 0));
    if (n < 60) return `${Math.ceil(n)} s`;
    const min = Math.floor(n / 60);
    const sec = Math.ceil(n % 60);
    return sec ? `${min}:${String(sec).padStart(2, "0")} min` : `${min} min`;
  }

  _iconFor(c) {
    const state = this._hass?.states?.[c.entity_id];
    if (state?.attributes?.icon) return state.attributes.icon;
    const id = String(c.entity_id || "").toLowerCase();
    const name = String(c.name || "").toLowerCase();
    if (id.startsWith("climate.") || name.includes("klima")) return "mdi:air-conditioner";
    if (name.includes("pool") || name.includes("pumpe")) return "mdi:pump";
    if (name.includes("radiator") || name.includes("heizung")) return "mdi:radiator";
    if (id.startsWith("switch.")) return "mdi:power-socket-de";
    return "mdi:flash";
  }

  _orderedConsumers(attrs) {
    const all = attrs.consumers || [];
    if (this._orderMode === "stop") {
      return [...all].sort((a, b) => (a.stop_priority ?? 9999) - (b.stop_priority ?? 9999));
    }
    return [...all].sort((a, b) => (a.start_priority ?? a.priority ?? 9999) - (b.start_priority ?? b.priority ?? 9999));
  }

  _render() {
    if (!this.shadowRoot) return;
    const state = this._state();

    if (!this._hass || !state) {
      this.shadowRoot.innerHTML = `${this._styles()}<ha-card><div class="error">Entität ${this._esc(this._config.entity)} nicht gefunden.</div></ha-card>`;
      return;
    }

    const a = state.attributes || {};
    const consumers = this._orderedConsumers(a);
    const enabled = !!a.enabled;
    const gridValid = a.grid_valid !== false;
    const mode = a.mode || "auto";
    const batteryGuards = a.battery_guards || [];
    const triggeredBatteries = batteryGuards.filter((g) => g.triggered);
    const batteryStatusText = triggeredBatteries.length
      ? `Speicherentladung ${triggeredBatteries.map((g) => g.name).join(", ")}`
      : batteryGuards.length ? "Speicher OK" : "Kein Speicherwächter";

    this.shadowRoot.innerHTML = `
      ${this._styles()}
      <ha-card>
        <div class="card">
          <div class="header">
            <div>
              <div class="titleRow">
                <ha-icon icon="mdi:home-lightning-bolt"></ha-icon>
                <div class="title">Überschussmanager</div>
              </div>
              <div class="summary">
                <span class="pill export"><ha-icon icon="mdi:transmission-tower-export"></ha-icon> Überschuss ${this._fmtW(a.export_w)}</span>
                <span class="pill import"><ha-icon icon="mdi:transmission-tower-import"></ha-icon> Bezug ${this._fmtW(a.import_w)}</span>
                <span class="pill load"><ha-icon icon="mdi:flash"></ha-icon> Aktive Last ${this._fmtW(a.total_active_power_w)}</span>
                <span class="pill ${!gridValid || triggeredBatteries.length ? "bad" : "ok"}">
                  <ha-icon icon="${!gridValid ? "mdi:network-off" : triggeredBatteries.length ? "mdi:battery-alert" : "mdi:battery-check"}"></ha-icon>
                  ${!gridValid ? "Netzsensor Fehler" : this._esc(batteryStatusText)}
                </span>
                ${mode === "test" ? `<span class="pill testState"><ha-icon icon="mdi:test-tube"></ha-icon> TEST</span>` : ""}
              </div>
            </div>
            <div class="headerActions">
              <button id="settingsButton" class="iconButton" title="Einstellungen" aria-label="Einstellungen">
                <ha-icon icon="mdi:cog"></ha-icon>
              </button>
              <label class="master" title="Gesamte Regelung ein/aus">
                <input id="masterToggle" type="checkbox" ${enabled ? "checked" : ""}>
                <span></span>
              </label>
            </div>
          </div>

          <div class="body">
            <div class="list">
              ${consumers.length
                ? consumers.map((c) => this._row(c)).join("")
                : `<div class="empty"><ha-icon icon="mdi:playlist-plus"></ha-icon><br>Noch keine Verbraucher.<br>Mit <b>+</b> den ersten anlegen.</div>`}
            </div>

            <div class="toolbar">
              <button id="moveUp" title="Eine Position hoch" ${this._selectedId ? "" : "disabled"}>
                <ha-icon icon="mdi:arrow-up-bold"></ha-icon>
              </button>
              <button id="add" title="Verbraucher hinzufügen" class="accent">
                <ha-icon icon="mdi:plus"></ha-icon>
              </button>
              <button id="edit" title="Markierten Verbraucher bearbeiten" ${this._selectedId ? "" : "disabled"}>
                <ha-icon icon="mdi:pencil"></ha-icon>
              </button>
              <button id="remove" title="Markierten Verbraucher entfernen" class="danger" ${this._selectedId ? "" : "disabled"}>
                <ha-icon icon="mdi:minus"></ha-icon>
              </button>
              <button id="moveDown" title="Eine Position runter" ${this._selectedId ? "" : "disabled"}>
                <ha-icon icon="mdi:arrow-down-bold"></ha-icon>
              </button>
            </div>
          </div>

          <div class="listControls">
            <div class="footer">
              ${this._orderMode === "start" ? "Oben = zuerst einschalten" : "Oben = zuerst abschalten"}
              · Zeilen können am PC auch per Drag & Drop sortiert werden
            </div>

            <div class="orderTabs bottomTabs">
              <button id="startOrderTab" class="${this._orderMode === "start" ? "active" : ""}">
                <ha-icon icon="mdi:power-plug"></ha-icon> Reihenfolge beim Einschalten
              </button>
              <button id="stopOrderTab" class="${this._orderMode === "stop" ? "active" : ""}">
                <ha-icon icon="mdi:power-plug-off"></ha-icon> Reihenfolge beim Abschalten
              </button>
            </div>
          </div>
        </div>
      </ha-card>

      <dialog id="settingsEditor">
        <form id="settingsForm">
          <div class="dialogHeader">
            <div class="dialogTitle">Einstellungen</div>
            <button type="button" id="closeSettingsEditor" class="dialogClose" title="Schließen" aria-label="Schließen">×</button>
          </div>

          <div class="settingsSection">
            <div class="sectionTitle">Betriebsart</div>
            <div class="modeBar settingsModeBar">
              <button type="button" data-mode="auto" class="${mode === "auto" ? "active auto" : ""}">
                <ha-icon icon="mdi:auto-mode"></ha-icon> AUTO
              </button>
              <button type="button" data-mode="test" class="test ${mode === "test" ? "active" : ""}">
                <ha-icon icon="mdi:test-tube"></ha-icon> TEST
              </button>
            </div>
            <div class="hint">AUTO regelt normal. TEST simuliert nur und schaltet keine Geräte.</div>
          </div>

          <div class="settingsSection">
            <div class="sectionTitle">Reserve</div>
            <div class="reserveRow">
              <div class="unitInput"><input id="settingsReserve" type="number" min="0" step="10" value="${this._esc(a.reserve_w ?? 150)}"><span>W</span></div>
              <button type="button" id="saveReserve" class="primary compactPrimary">Speichern</button>
            </div>
          </div>

          <div class="settingsSection settingsStatus ${gridValid ? "okBox" : "badBox"}">
            <div class="settingsStatusIcon"><ha-icon icon="${gridValid ? "mdi:check-network" : "mdi:network-off"}"></ha-icon></div>
            <div>
              <div class="sectionTitle">Netzsensor ${gridValid ? "OK" : "Fehler"}</div>
              <div class="meta">${this._esc(a.grid_power_entity || "–")}</div>
            </div>
          </div>

          <button type="button" id="openBatteryEditor" class="settingsSection storageSettings ${a.battery_guard_triggered ? "badBox" : "okBox"}">
            <div class="settingsStatusIcon"><ha-icon icon="${a.battery_guard_triggered ? "mdi:battery-alert" : "mdi:battery-check"}"></ha-icon></div>
            <div class="storageText">
              <div class="sectionTitle">Speicher ${batteryGuards.length}</div>
              <div class="meta">${this._esc(batteryStatusText)}</div>
            </div>
            <ha-icon icon="mdi:chevron-right"></ha-icon>
          </button>
        </form>
      </dialog>

      <dialog id="batteryEditor">
        <form id="batteryForm">
          <div class="dialogHeader">
            <div class="dialogTitle">Speicherwächter</div>
            <button type="button" id="closeBatteryEditor" class="dialogClose" title="Schließen">×</button>
          </div>
          <div class="batteryList">
            ${(a.battery_guards || []).map((g) => `
              <div class="batteryRow">
                <div><b>${this._esc(g.name)}</b><div class="meta">${this._esc(g.entity_id)} · Entladung ${this._fmtW(g.discharge_w)} · Grenze ${this._fmtW(g.threshold_w)}</div></div>
                <div class="batteryActions">
                  <button type="button" class="editBattery" data-id="${this._esc(g.id)}"><ha-icon icon="mdi:pencil"></ha-icon></button>
                  <button type="button" class="deleteBattery danger" data-id="${this._esc(g.id)}"><ha-icon icon="mdi:trash-can-outline"></ha-icon></button>
                </div>
              </div>`).join("") || `<div class="hint">Noch kein Speicherwächter angelegt.</div>`}
          </div>
          <input type="hidden" id="bId">
          <label>Name<input id="bName" placeholder="z. B. Marstek 1"></label>
          <label>Leistungssensor des Speichers<input id="bEntity" placeholder="z. B. sensor.marstek_1_power"></label>
          <div class="two">
            <label>Abschaltschwelle<div class="unitInput"><input id="bThreshold" type="number" min="0" step="10" value="300"><span>W</span></div></label>
            <label>Vorzeichen bei Entladung<select id="bPolarity"><option value="true">Entladung positiv</option><option value="false">Entladung negativ</option></select></label>
          </div>
          <label class="checkLine"><input id="bEnabled" type="checkbox" checked> Speicherwächter aktiv</label>
          <div class="hint">Überschreitet irgendein aktiver Speicher seine Grenze länger als die globale Ausschaltverzögerung, wird nach der AUS-Reihenfolge Last abgeworfen.</div>
          <div class="dialogActions">
            <button type="button" id="resetBatteryForm" class="flat">Neu</button>
            <button type="button" id="saveBattery" class="primary">Speichern</button>
          </div>
        </form>
      </dialog>

      <dialog id="editor">
        <form id="editorForm">
          <div class="dialogHeader">
            <div class="dialogTitle" id="dialogTitle">Verbraucher anlegen</div>
            <button type="button" id="closeEditor" class="dialogClose" title="Schließen" aria-label="Schließen">×</button>
          </div>

          <label>Name
            <input id="fName" required placeholder="z. B. Klimaanlage Wohnzimmer">
          </label>

          <label>Schalt-Entität
            <input id="fEntity" required placeholder="z. B. climate.klimaanlage_wohnzimmer">
          </label>

          <label>Leistungssensor <span class="optional">(optional)</span>
            <input id="fPowerSensor" placeholder="z. B. sensor.klima_wohnzimmer_leistung">
          </label>

          <div class="two">
            <label>Leistungsbedarf
              <div class="unitInput"><input id="fPower" type="number" min="0" step="10" value="800" required><span>W</span></div>
            </label>
            <label>Freigabe
              <select id="fEnabled">
                <option value="true">AUTO aktiv</option>
                <option value="false">gesperrt</option>
              </select>
            </label>
          </div>

          <div class="two">
            <label>Mindestlaufzeit
              <div class="unitInput"><input id="fMinOn" type="number" min="0" step="60" value="900"><span>s</span></div>
            </label>
            <label>Mindestpause
              <div class="unitInput"><input id="fMinOff" type="number" min="0" step="60" value="300"><span>s</span></div>
            </label>
          </div>

          <div id="climateFields" class="climateBox hidden">
            <div class="two">
              <label>Klima-Modus
                <select id="fClimateMode">
                  <option value="heat">Heizen</option>
                  <option value="cool">Kühlen</option>
                  <option value="heat_cool">Heizen/Kühlen</option>
                  <option value="dry">Entfeuchten</option>
                  <option value="fan_only">Nur Lüfter</option>
                </select>
              </label>
              <label>Solltemperatur
                <div class="unitInput"><input id="fTemp" type="number" min="10" max="35" step="0.5" value="21"><span>°C</span></div>
              </label>
            </div>
          </div>

          <div class="hint">
            Der Leistungssensor ist optional. Wenn vorhanden, zeigt die Karte die echte aktuelle Leistung an.
            Ohne Sensor wird für die Summenanzeige der eingetragene Leistungsbedarf verwendet.
          </div>

          <div class="dialogActions">
            <button type="button" id="cancelEditor" class="flat">Abbrechen</button>
            <button type="button" id="saveConsumer" class="primary">Speichern</button>
          </div>
        </form>
      </dialog>
    `;

    this._wire(consumers);
  }

  _row(c) {
    const selected = this._selectedId === c.id;
    const checked = c.enabled ? "checked" : "";
    const stateClass = c.last_error
      ? "errorState"
      : c.manual_on
        ? "manual"
        : c.is_on
          ? "on"
          : "off";

    let stateText = "AUS";
    if (!c.enabled) stateText = "GESPERRT";
    if (c.is_on) stateText = "EIN";
    if (c.manual_on) stateText = "MANUELL EIN";
    if (c.last_error) stateText = "FEHLER";

    const err = c.last_error
      ? `<span class="err" title="${this._esc(c.last_error)}">!</span>`
      : "";

    const powerText = c.current_power_w !== null && c.current_power_w !== undefined
      ? `aktuell ${this._fmtW(c.current_power_w)}`
      : `Soll ${this._fmtW(c.power_w)}`;

    const countdown = Number(c.countdown_s || 0) > 0
      ? `<span class="countdown">${this._fmtSec(c.countdown_s)}</span>`
      : "";

    return `
      <div class="row ${selected ? "selected" : ""}"
           data-id="${this._esc(c.id)}"
           draggable="true">
        <div class="dragHandle" title="Ziehen zum Sortieren"><ha-icon icon="mdi:drag"></ha-icon></div>
        <input class="consumerToggle" type="checkbox" data-id="${this._esc(c.id)}" ${checked}
               title="Für Überschussautomatik freigeben">
        <div class="prio">${this._esc(this._orderMode === "stop" ? c.stop_priority : (c.start_priority ?? c.priority))}</div>
        <ha-icon class="deviceIcon" icon="${this._esc(this._iconFor(c))}"></ha-icon>
        <div class="main">
          <div class="name">${this._esc(c.name)} ${err}</div>
          <div class="meta">
            ${powerText} · EIN ${this._esc(c.start_priority ?? c.priority)} / AUS ${this._esc(c.stop_priority)}
          </div>
          <div class="reason" title="${this._esc(c.reason || "")}">
            ${this._esc(c.reason || "")} ${countdown}
          </div>
        </div>
        <button class="status manualToggle ${stateClass}"
                data-id="${this._esc(c.id)}"
                data-manual="${c.manual_on ? "true" : "false"}"
                title="${c.manual_on ? "Manuell ausschalten und wieder AUTO aktivieren" : "Gerät manuell einschalten"}">
          ${stateText}
        </button>
      </div>
    `;
  }

  _styles() {
    return `
      <style>
        :host {
          --sm-border: color-mix(in srgb, var(--primary-text-color) 16%, transparent);
          --sm-muted: var(--secondary-text-color);
          display: block;
        }
        ha-card { overflow: hidden; }
        .card { padding: 18px; }
        .header {
          display: flex; align-items: flex-start; justify-content: space-between;
          gap: 16px; margin-bottom: 12px;
        }
        .titleRow { display:flex; align-items:center; gap:9px; }
        .titleRow ha-icon { color: var(--primary-color); --mdc-icon-size: 27px; }
        .title { font-size: 24px; font-weight: 650; line-height: 1.2; }
        .summary { display: flex; flex-wrap: wrap; gap: 7px; margin-top: 9px; }
        .headerActions { display:flex; align-items:center; gap:10px; height:36px; }
        .master { display:flex; align-items:center; height:36px; }
        .iconButton {
          width:36px; height:36px; border-radius:50%; border:1px solid var(--sm-border);
          background:var(--secondary-background-color); color:var(--primary-text-color);
          cursor:pointer; display:grid; place-items:center; padding:0;
        }
        .iconButton:hover { filter:brightness(1.08); }
        .iconButton ha-icon { --mdc-icon-size:21px; }
        .pill {
          font-size: 12px; padding: 5px 8px; border-radius: 999px;
          background: var(--secondary-background-color);
          display:flex; align-items:center; gap:4px;
        }
        .pill ha-icon { --mdc-icon-size: 15px; }
        .pill.export, .pill.ok { color: var(--success-color, #43a047); }
        .pill.import { color: var(--warning-color, #fb8c00); }
        .pill.bad { color: var(--error-color); font-weight:700; }

        .batteryConfig {
          border:1px solid var(--sm-border); border-radius:999px; padding:5px 8px;
          background:var(--secondary-background-color); color:var(--primary-text-color);
          cursor:pointer; display:flex; align-items:center; gap:4px; font-size:12px;
        }
        .batteryConfig ha-icon { --mdc-icon-size:15px; }
        .batteryConfig.triggered { color:var(--error-color); border-color:var(--error-color); }
        .batteryBanner {
          display:flex; align-items:center; gap:8px; border-radius:11px; padding:9px 11px;
          margin:8px 0 12px; font-size:12px; line-height:1.35;
          color:var(--error-color);
          background:color-mix(in srgb, var(--error-color) 10%, transparent);
          border:1px solid color-mix(in srgb, var(--error-color) 45%, transparent);
        }
        .batteryList { display:flex; flex-direction:column; gap:8px; margin-bottom:16px; }
        .batteryRow {
          display:flex; align-items:center; justify-content:space-between; gap:10px;
          padding:10px; border:1px solid var(--sm-border); border-radius:10px;
          background:var(--secondary-background-color);
        }
        .batteryActions { display:flex; gap:6px; }
        .batteryActions button {
          width:36px; height:36px; border-radius:50%; border:1px solid var(--sm-border);
          background:var(--card-background-color); color:var(--primary-text-color); cursor:pointer;
        }
        .batteryActions .danger { color:var(--error-color); }
        .checkLine { display:flex; align-items:center; gap:8px; }
        .checkLine input { width:auto; height:auto; margin:0; }

        .safetyBanner, .testBanner {
          display:flex; align-items:center; gap:8px;
          border-radius: 11px; padding: 9px 11px; margin: 8px 0 12px;
          font-size: 12px; line-height:1.35;
        }
        .safetyBanner {
          background: color-mix(in srgb, var(--error-color) 10%, transparent);
          color: var(--error-color);
          border: 1px solid color-mix(in srgb, var(--error-color) 45%, transparent);
        }
        .testBanner {
          background: color-mix(in srgb, var(--warning-color, #fb8c00) 10%, transparent);
          color: var(--primary-text-color);
          border: 1px solid color-mix(in srgb, var(--warning-color, #fb8c00) 35%, transparent);
        }

        .modeBar {
          display:grid; grid-template-columns: repeat(2, 1fr); gap:7px;
          margin: 9px 0 12px;
        }
        .modeBar button, .orderTabs button {
          height: 40px; border-radius: 10px; border:1px solid var(--sm-border);
          background: var(--secondary-background-color);
          color: var(--secondary-text-color);
          cursor:pointer; display:flex; align-items:center; justify-content:center; gap:6px;
          font-weight:600;
        }
        .modeBar button.active, .orderTabs button.active {
          color: var(--primary-color);
          border-color: color-mix(in srgb, var(--primary-color) 60%, var(--sm-border));
          background: color-mix(in srgb, var(--primary-color) 10%, var(--card-background-color));
        }
        .modeBar button.active.test { color: var(--warning-color, #fb8c00); }
        .modeBar button.active.pause { color: var(--secondary-text-color); }
        .modeBar ha-icon, .orderTabs ha-icon { --mdc-icon-size:18px; }

        .orderTabs {
          display:grid; grid-template-columns:1fr 1fr; gap:8px; margin-bottom:12px;
        }
        .bottomTabs { margin-top:8px; margin-bottom:0; }
        .listControls { margin-right:60px; }

        .body { display:grid; grid-template-columns:1fr 50px; gap:10px; }
        .list {
          min-height:220px; border:1px solid var(--sm-border);
          border-radius:16px; overflow:hidden; background:var(--card-background-color);
        }
        .row {
          min-height:66px; display:grid;
          grid-template-columns: 24px 32px 24px 34px minmax(0,1fr) auto;
          align-items:center; gap:5px; padding: 5px 10px;
          border-bottom:1px solid var(--sm-border);
          cursor:pointer; user-select:none;
          transition:none;
        }
        .row:last-child { border-bottom:0; }
        .row:hover { background:color-mix(in srgb, var(--primary-text-color) 5%, transparent); }
        .row.selected { background:color-mix(in srgb, var(--primary-color) 10%, transparent); }
        .row.dragging { opacity:.45; }
        .row.dragover { box-shadow: inset 0 2px 0 var(--primary-color); }

        .dragHandle { color:var(--sm-muted); cursor:grab; display:grid; place-items:center; }
        .dragHandle ha-icon { --mdc-icon-size:18px; }
        .row input[type=checkbox] { width:20px; height:20px; cursor:pointer; }
        .prio { color:var(--sm-muted); font-size:12px; text-align:center; }
        .deviceIcon { color:var(--primary-color); --mdc-icon-size:25px; }
        .main { min-width:0; }
        .name { font-size:15px; font-weight:600; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
        .meta, .reason {
          font-size:11px; color:var(--sm-muted);
          overflow:hidden; text-overflow:ellipsis; white-space:nowrap; margin-top:2px;
        }
        .reason { color: color-mix(in srgb, var(--secondary-text-color) 92%, transparent); }
        .countdown { font-weight:700; color:var(--primary-color); margin-left:4px; }

        .status {
          font-size:10px; font-weight:800; min-width:72px; text-align:center;
          border-radius:999px; padding:7px 9px;
          border:1px solid var(--sm-border); cursor:pointer;
          background:var(--secondary-background-color); color:var(--secondary-text-color);
        }
        .status.on {
          color:var(--success-color, #43a047);
          border-color:color-mix(in srgb, var(--success-color, #43a047) 45%, var(--sm-border));
          background:color-mix(in srgb, var(--success-color, #43a047) 9%, transparent);
        }
        .status.manual {
          color:var(--warning-color, #fb8c00);
          border-color:color-mix(in srgb, var(--warning-color, #fb8c00) 55%, var(--sm-border));
          background:color-mix(in srgb, var(--warning-color, #fb8c00) 10%, transparent);
        }
        .status.errorState {
          color:var(--error-color);
          border-color:color-mix(in srgb, var(--error-color) 55%, var(--sm-border));
          background:color-mix(in srgb, var(--error-color) 9%, transparent);
        }
        .status { transition:none; }
        .status:hover, .status:active { filter:none; transform:none; }
        .status:disabled { opacity:1; }

        .err {
          display:inline-grid; place-items:center; width:17px; height:17px;
          border-radius:50%; background:var(--error-color); color:white;
          font-size:11px; margin-left:4px;
        }
        .empty {
          min-height:220px; display:grid; place-items:center; text-align:center;
          color:var(--sm-muted); padding:20px;
        }
        .empty ha-icon { --mdc-icon-size:32px; }

        .toolbar { display:flex; flex-direction:column; gap:8px; justify-content:center; align-self:stretch; }
        .toolbar button {
          width:46px; height:46px; border-radius:50%;
          border:1px solid var(--sm-border);
          background:var(--secondary-background-color);
          color:var(--primary-text-color); cursor:pointer;
          display:grid; place-items:center;
        }
        .toolbar button ha-icon { --mdc-icon-size:24px; }
        .toolbar button:hover:not(:disabled) { filter:brightness(1.08); }
        .toolbar button:disabled { opacity:.28; cursor:default; }
        .toolbar .accent { color:var(--primary-color); }
        .toolbar .danger { color:var(--error-color); }

        .footer { margin-top:10px; font-size:11px; color:var(--sm-muted); text-align:center; }

        .master input { display:none; }
        .master span {
          display:block; width:48px; height:28px; border-radius:999px;
          background:var(--disabled-color, #9e9e9e); position:relative; cursor:pointer;
          transition:.18s;
        }
        .master span:after {
          content:""; width:22px; height:22px; border-radius:50%;
          background:white; position:absolute; top:3px; left:3px; transition:.18s;
          box-shadow:0 1px 4px rgba(0,0,0,.3);
        }
        .master input:checked + span { background:var(--primary-color); }
        .master input:checked + span:after { transform:translateX(20px); }

        .testState { color:var(--warning-color, #fb8c00); }
        .settingsSection {
          border:1px solid var(--sm-border); border-radius:12px; padding:12px;
          margin-bottom:12px; background:var(--secondary-background-color);
        }
        .sectionTitle { font-size:13px; font-weight:700; color:var(--primary-text-color); margin-bottom:7px; }
        .settingsModeBar { margin:0 0 7px; }
        .reserveRow { display:grid; grid-template-columns:1fr auto; gap:8px; align-items:end; }
        .compactPrimary { height:42px; border:0; border-radius:9px; padding:0 16px; cursor:pointer; background:var(--primary-color); color:var(--text-primary-color, white); }
        .settingsStatus { display:flex; align-items:center; gap:10px; }
        .settingsStatus .sectionTitle { margin-bottom:2px; }
        .settingsStatusIcon { width:34px; height:34px; display:grid; place-items:center; }
        .settingsStatusIcon ha-icon { --mdc-icon-size:25px; }
        .okBox { border-color:color-mix(in srgb, var(--success-color, #43a047) 35%, var(--sm-border)); }
        .badBox { border-color:color-mix(in srgb, var(--error-color) 55%, var(--sm-border)); }
        .storageSettings {
          width:100%; display:grid; grid-template-columns:34px 1fr auto; align-items:center; gap:10px;
          color:var(--primary-text-color); text-align:left; cursor:pointer; font:inherit;
        }
        .storageText .sectionTitle { margin-bottom:2px; }
        .storageSettings:hover { filter:brightness(1.04); }

        dialog {
          width:min(540px, calc(100vw - 28px)); border:0; border-radius:18px; padding:0;
          color:var(--primary-text-color); background:var(--card-background-color);
          box-shadow:0 14px 50px rgba(0,0,0,.35);
        }
        dialog::backdrop { background:rgba(0,0,0,.48); }
        form { padding:22px; }
        .dialogHeader { display:flex; align-items:center; justify-content:space-between; gap:12px; margin-bottom:17px; }
        .dialogTitle { font-size:21px; font-weight:650; }
        .dialogClose {
          width:38px; height:38px; border:0; border-radius:50%; background:transparent;
          color:var(--primary-text-color); font-size:30px; line-height:1; cursor:pointer;
        }
        .dialogClose:hover { background:var(--secondary-background-color); }
        label { display:block; font-size:12px; color:var(--secondary-text-color); margin-bottom:13px; }
        .optional { opacity:.7; }
        input, select {
          box-sizing:border-box; width:100%; margin-top:6px; height:42px;
          padding:0 11px; border-radius:9px; border:1px solid var(--sm-border);
          color:var(--primary-text-color); background:var(--secondary-background-color); outline:none;
        }
        input:focus, select:focus { border-color:var(--primary-color); }
        .two { display:grid; grid-template-columns:1fr 1fr; gap:12px; }
        .unitInput { position:relative; }
        .unitInput input { padding-right:42px; }
        .unitInput span { position:absolute; right:12px; top:19px; color:var(--secondary-text-color); }
        .climateBox {
          padding:12px; margin-bottom:12px; border-radius:12px;
          background:color-mix(in srgb, var(--primary-color) 7%, transparent);
        }
        .hidden { display:none; }
        .hint { color:var(--secondary-text-color); font-size:11px; line-height:1.45; }
        .dialogActions { display:flex; justify-content:flex-end; gap:8px; margin-top:18px; }
        .dialogActions button {
          height:40px; border:0; border-radius:9px; padding:0 15px; cursor:pointer;
        }
        .dialogActions .flat { background:transparent; color:var(--primary-text-color); }
        .dialogActions .primary { background:var(--primary-color); color:var(--text-primary-color, white); }
        .error { padding:20px; color:var(--error-color); }

        @media (max-width: 650px) {
          .card { padding:12px; }
          .title { font-size:21px; }
          .summary { gap:5px; }
          .body { grid-template-columns:1fr 44px; gap:7px; }
          .listControls { margin-right:51px; }
          .toolbar button { width:42px; height:42px; }
          .row {
            grid-template-columns: 20px 28px 20px 30px minmax(0,1fr);
            padding:5px 7px;
          }
          .status {
            grid-column:5; justify-self:start; margin-bottom:5px;
          }
          .two { grid-template-columns:1fr; gap:0; }
          .dragHandle { display:none; }
          .modeBar button, .orderTabs button { font-size:11px; }
        }
      </style>
    `;
  }

  _wire(consumers) {
    const q = (s) => this.shadowRoot.querySelector(s);
    const qa = (s) => [...this.shadowRoot.querySelectorAll(s)];
    const state = this._state();
    const entryId = state?.attributes?.config_entry_id;

    q("#settingsButton")?.addEventListener("click", () => q("#settingsEditor")?.showModal());
    q("#closeSettingsEditor")?.addEventListener("click", () => q("#settingsEditor")?.close());
    q("#settingsEditor")?.addEventListener("close", () => this._queueRender());
    q("#openBatteryEditor")?.addEventListener("click", () => q("#batteryEditor")?.showModal());
    q("#saveReserve")?.addEventListener("click", async () => {
      const reserve = Number(q("#settingsReserve")?.value);
      if (!Number.isFinite(reserve) || reserve < 0) {
        alert("Bitte eine gültige Reserve in Watt eintragen.");
        return;
      }
      await this._hass.callService("surplus_manager", "set_reserve", {
        config_entry_id: entryId,
        reserve_w: reserve,
      });
      q("#settingsEditor")?.close();
    });
    q("#closeBatteryEditor")?.addEventListener("click", () => q("#batteryEditor")?.close());
    q("#batteryEditor")?.addEventListener("close", () => {
      if (!q("#settingsEditor")?.open) this._queueRender();
    });
    q("#resetBatteryForm")?.addEventListener("click", () => this._fillBatteryForm(null));
    q("#saveBattery")?.addEventListener("click", () => this._saveBattery());
    qa(".editBattery").forEach((btn) => {
      btn.addEventListener("click", () => {
        const guard = (state.attributes.battery_guards || []).find((g) => g.id === btn.dataset.id);
        if (guard) this._fillBatteryForm(guard);
      });
    });
    qa(".deleteBattery").forEach((btn) => {
      btn.addEventListener("click", async () => {
        const guard = (state.attributes.battery_guards || []).find((g) => g.id === btn.dataset.id);
        if (!guard) return;
        if (!confirm(`Speicherwächter "${guard.name}" wirklich entfernen?`)) return;
        await this._hass.callService("surplus_manager", "remove_battery_guard", {
          config_entry_id: entryId,
          guard_id: guard.id,
        });
        q("#batteryEditor")?.close();
      });
    });

    q("#masterToggle")?.addEventListener("change", async (ev) => {
      await this._hass.callService("surplus_manager", "set_enabled", {
        config_entry_id: entryId,
        enabled: ev.target.checked,
      });
    });

    qa(".modeBar button").forEach((button) => {
      button.addEventListener("click", async () => {
        await this._hass.callService("surplus_manager", "set_mode", {
          config_entry_id: entryId,
          mode: button.dataset.mode,
        });
        qa(".modeBar button").forEach((b) => b.classList.toggle("active", b === button));
      });
    });

    q("#startOrderTab")?.addEventListener("click", () => {
      this._orderMode = "start";
      this._selectedId = null;
      this._render();
    });
    q("#stopOrderTab")?.addEventListener("click", () => {
      this._orderMode = "stop";
      this._selectedId = null;
      this._render();
    });

    qa(".row").forEach((row) => {
      row.addEventListener("click", (ev) => {
        if (ev.target.closest(".consumerToggle, .manualToggle, .dragHandle")) return;
        this._selectedId = row.dataset.id;
        this._render();
      });

      row.addEventListener("dblclick", (ev) => {
        if (ev.target.closest(".consumerToggle, .manualToggle, .dragHandle")) return;
        const c = consumers.find((x) => x.id === row.dataset.id);
        if (c) this._openEditor(c);
      });

      row.addEventListener("dragstart", (ev) => {
        this._dragId = row.dataset.id;
        row.classList.add("dragging");
        ev.dataTransfer.effectAllowed = "move";
        ev.dataTransfer.setData("text/plain", this._dragId);
      });
      row.addEventListener("dragend", () => {
        this._dragId = null;
        qa(".row").forEach((r) => r.classList.remove("dragging", "dragover"));
      });
      row.addEventListener("dragover", (ev) => {
        ev.preventDefault();
        if (!this._dragId || this._dragId === row.dataset.id) return;
        row.classList.add("dragover");
      });
      row.addEventListener("dragleave", () => row.classList.remove("dragover"));
      row.addEventListener("drop", async (ev) => {
        ev.preventDefault();
        row.classList.remove("dragover");
        const dragId = this._dragId || ev.dataTransfer.getData("text/plain");
        if (!dragId || dragId === row.dataset.id) return;
        const targetPosition = consumers.findIndex((c) => c.id === row.dataset.id) + 1;
        await this._hass.callService("surplus_manager", "move_consumer", {
          config_entry_id: entryId,
          consumer_id: dragId,
          order: this._orderMode,
          position: targetPosition,
        });
      });
    });

    qa(".consumerToggle").forEach((box) => {
      box.addEventListener("click", (ev) => ev.stopPropagation());
      box.addEventListener("change", async (ev) => {
        await this._hass.callService("surplus_manager", "set_consumer_enabled", {
          config_entry_id: entryId,
          consumer_id: ev.target.dataset.id,
          enabled: ev.target.checked,
        });
      });
    });

    qa(".manualToggle").forEach((button) => {
      button.addEventListener("click", async (ev) => {
        ev.stopPropagation();
        const id = ev.currentTarget.dataset.id;
        const isManual = ev.currentTarget.dataset.manual === "true";
        ev.currentTarget.disabled = true;
        try {
          await this._hass.callService("surplus_manager", "set_manual", {
            config_entry_id: entryId,
            consumer_id: id,
            enabled: !isManual,
          });
        } finally {
          setTimeout(() => {
            if (ev.currentTarget) ev.currentTarget.disabled = false;
          }, 3000);
        }
      });
    });

    q("#moveUp")?.addEventListener("click", () => this._move("up"));
    q("#moveDown")?.addEventListener("click", () => this._move("down"));
    q("#add")?.addEventListener("click", () => this._openEditor(null));

    q("#edit")?.addEventListener("click", () => {
      const c = consumers.find((x) => x.id === this._selectedId);
      if (c) this._openEditor(c);
    });

    q("#remove")?.addEventListener("click", async () => {
      if (!this._selectedId) return;
      const c = consumers.find((x) => x.id === this._selectedId);
      if (!c) return;
      if (!confirm(`"${c.name}" wirklich aus der Überschusssteuerung entfernen?\n\nDie Home-Assistant-Entität selbst wird NICHT gelöscht.`)) return;

      await this._hass.callService("surplus_manager", "remove_consumer", {
        config_entry_id: entryId,
        consumer_id: c.id,
      });
      this._selectedId = null;
    });

    q("#fEntity")?.addEventListener("input", (ev) => this._toggleClimateFields(ev.target.value));
    q("#saveConsumer")?.addEventListener("click", () => this._saveEditor());
    q("#cancelEditor")?.addEventListener("click", () => q("#editor")?.close());
    q("#closeEditor")?.addEventListener("click", () => q("#editor")?.close());
    q("#editor")?.addEventListener("close", () => this._queueRender());
  }

  _fillBatteryForm(guard) {
    const q = (s) => this.shadowRoot.querySelector(s);
    q("#bId").value = guard?.id || "";
    q("#bName").value = guard?.name || "";
    q("#bEntity").value = guard?.entity_id || "";
    q("#bThreshold").value = guard?.threshold_w ?? 300;
    q("#bPolarity").value = String(guard?.discharge_positive ?? true);
    q("#bEnabled").checked = guard?.enabled ?? true;
  }

  async _saveBattery() {
    const q = (s) => this.shadowRoot.querySelector(s);
    const st = this._state();
    const name = q("#bName").value.trim();
    const entityId = q("#bEntity").value.trim();
    const threshold = Number(q("#bThreshold").value);
    if (!name || !entityId || !Number.isFinite(threshold) || threshold < 0) {
      alert("Bitte Name, Leistungssensor und gültige Abschaltschwelle eintragen.");
      return;
    }
    const data = {
      config_entry_id: st.attributes.config_entry_id,
      name,
      entity_id: entityId,
      threshold_w: threshold,
      discharge_positive: q("#bPolarity").value === "true",
      enabled: q("#bEnabled").checked,
    };
    const id = q("#bId").value;
    if (id) {
      data.guard_id = id;
      await this._hass.callService("surplus_manager", "update_battery_guard", data);
    } else {
      await this._hass.callService("surplus_manager", "add_battery_guard", data);
    }
    q("#batteryEditor")?.close();
  }

  async _move(direction) {
    const st = this._state();
    if (!st || !this._selectedId) return;
    await this._hass.callService("surplus_manager", "move_consumer", {
      config_entry_id: st.attributes.config_entry_id,
      consumer_id: this._selectedId,
      direction,
      order: this._orderMode,
    });
  }

  _toggleClimateFields(entityId) {
    const box = this.shadowRoot.querySelector("#climateFields");
    if (!box) return;
    box.classList.toggle("hidden", !String(entityId || "").startsWith("climate."));
  }

  _openEditor(consumer) {
    const q = (s) => this.shadowRoot.querySelector(s);
    const dlg = q("#editor");
    if (!dlg) return;

    dlg.dataset.editId = consumer?.id || "";
    q("#dialogTitle").textContent = consumer ? "Verbraucher bearbeiten" : "Verbraucher anlegen";
    q("#fName").value = consumer?.name || "";
    q("#fEntity").value = consumer?.entity_id || "";
    q("#fPowerSensor").value = consumer?.power_sensor_entity || "";
    q("#fPower").value = consumer?.power_w ?? 800;
    q("#fEnabled").value = String(consumer?.enabled ?? true);
    q("#fMinOn").value = consumer?.min_on_s ?? 900;
    q("#fMinOff").value = consumer?.min_off_s ?? 300;
    q("#fClimateMode").value = consumer?.climate_mode || "heat";
    q("#fTemp").value = consumer?.target_temp ?? 21;
    this._toggleClimateFields(q("#fEntity").value);
    dlg.showModal();
  }

  async _saveEditor() {
    const q = (s) => this.shadowRoot.querySelector(s);
    const dlg = q("#editor");
    const st = this._state();
    if (!dlg || !st) return;

    const name = q("#fName").value.trim();
    const entityId = q("#fEntity").value.trim();
    const powerSensor = q("#fPowerSensor").value.trim();
    const power = Number(q("#fPower").value);

    if (!name || !entityId || !Number.isFinite(power) || power < 0) {
      alert("Bitte Name, gültige Entität und Leistungsbedarf ausfüllen.");
      return;
    }
    if (!this._hass.states[entityId]) {
      if (!confirm(`Die Schalt-Entität "${entityId}" ist aktuell nicht in Home Assistant vorhanden. Trotzdem speichern?`)) return;
    }
    if (powerSensor && !this._hass.states[powerSensor]) {
      if (!confirm(`Der Leistungssensor "${powerSensor}" ist aktuell nicht vorhanden. Trotzdem speichern?`)) return;
    }

    const data = {
      config_entry_id: st.attributes.config_entry_id,
      name,
      entity_id: entityId,
      power_sensor_entity: powerSensor,
      power_w: power,
      enabled: q("#fEnabled").value === "true",
      min_on_s: Number(q("#fMinOn").value || 0),
      min_off_s: Number(q("#fMinOff").value || 0),
      climate_mode: entityId.startsWith("climate.") ? q("#fClimateMode").value : "",
    };

    if (entityId.startsWith("climate.")) {
      data.target_temp = Number(q("#fTemp").value);
    }

    const editId = dlg.dataset.editId;
    if (editId) {
      data.consumer_id = editId;
      await this._hass.callService("surplus_manager", "update_consumer", data);
    } else {
      await this._hass.callService("surplus_manager", "add_consumer", data);
    }

    dlg.close();
  }
}

customElements.define("surplus-manager-card", SurplusManagerCard);

window.customCards = window.customCards || [];
window.customCards.push({
  type: "surplus-manager-card",
  name: "Überschussmanager",
  description: "Prioritätsgesteuerte PV-Überschussregelung mit EIN/AUS-Prioritäten, Testmodus und manueller Übersteuerung",
  preview: true,
});