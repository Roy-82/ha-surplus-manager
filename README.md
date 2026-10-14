# Home Assistant Überschussmanager

PV-Überschussmanager für Home Assistant mit Prioritäten, manueller Übersteuerung,
Testmodus, Speicherwächtern und eigener Dashboard-Karte.

![Überschussmanager Dashboard](images/dashboard-current.png)

## Installation über HACS

Nach Veröffentlichung dieses Repositorys:

1. HACS → Integrationen.
2. Benutzerdefinierte Repositories öffnen.
3. `https://github.com/Roy-82/ha-surplus-manager` eintragen.
4. Kategorie **Integration** wählen.
5. Überschussmanager installieren.
6. Home Assistant neu starten.
7. Unter Geräte & Dienste den Überschussmanager hinzufügen.

## Dashboard-Karte

Ab v2.1 wird die Karte direkt mit der Integration ausgeliefert. `/config/www` ist nicht mehr nötig.

Unter Einstellungen → Dashboards → Ressourcen einmalig eintragen:

- URL: `/surplus_manager/surplus-manager-card.js?v=2.4.0`
- Typ: JavaScript-Modul

Danach werden Backend und Karte gemeinsam über HACS aktualisiert.

## Sprachen

Der Überschussmanager unterstützt Deutsch, Englisch, Französisch, Spanisch und Niederländisch.
Standardmäßig wird die Sprache von Home Assistant übernommen. Eine feste Sprache kann sowohl
bei der Einrichtung als auch später direkt über das Zahnrad in der Dashboard-Karte gewählt werden.

```yaml
type: custom:surplus-manager-card
entity: sensor.uberschussmanager_uberschuss
title: Prioritätenliste
```

## v2.1

- Fix: Speicher-Popup bleibt offen und wird nicht mehr durch HA-State-Updates geschlossen.
- Dashboard-JavaScript ist Bestandteil der Integration.
- HACS-fähige Repository-Struktur.
- GitHub-Validierungsworkflow.
- Updates können künftig als GitHub-Releases veröffentlicht und über HACS installiert werden.


## v2.2.0

- Überschrift der Karte ist jetzt **Überschussmanager**.
- PAUSE wurde aus der Bedienoberfläche entfernt; der Hauptschalter übernimmt Regelung an/aus.
- AUTO und TEST liegen im neuen Einstellungs-Popup hinter dem Zahnrad.
- Reserve kann direkt im Einstellungs-Popup in Watt geändert werden.
- Netzsensor und Speicherwächter sind im Einstellungs-Popup gebündelt.
- Große Speicherwarnung wurde durch einen kompakten Status-Chip ersetzt.
- Prioritätsumschaltung steht jetzt unter der Verbraucherliste.
- Eindeutigere Beschriftung: **Reihenfolge beim Einschalten** / **Reihenfolge beim Abschalten**.


## v2.2.3

- Netzsensor kann direkt im Einstellungs-Popup der Dashboard-Karte geändert werden.
- Dashboard-Screenshot in der GitHub-Beschreibung ergänzt.


## v2.3.0

- Mehrsprachige Oberfläche: Deutsch, Englisch, Französisch, Spanisch und Niederländisch.
- Automatische Übernahme der Home-Assistant-Sprache oder manuelle Sprachauswahl.
- Sprachauswahl bereits bei der Einrichtung sowie später im Zahnrad-Popup.
- Einheitliche, sprachabhängige W/kW-Darstellung.
- Konfigurationsprüfung für Netzsensor, Verbraucher und Speicher-Sensoren.
- Neuer Diagnosebereich mit Netzleistung, Überschuss, Bezug, Reserve, Regelstatus und nächstem Verbraucher.
- Versionsanzeige im Einstellungs-Popup.
- Netzsensor bleibt direkt im Einstellungs-Popup änderbar.


## v2.3.1

- Feinschliff der Übersetzungen für Speicherstatus und manuelle Bedienung.
- Frontend-Versionsanzeige und Cache-Version auf v2.3.1 aktualisiert.


## v2.3.2

- Anzeigeoption im Zahnrad ergänzt: Hilfetexte können ein- oder ausgeblendet werden.
- Cache-/Frontend-Version auf v2.3.2 aktualisiert.


## v2.3.3

- Fix: Das Optionen-/Konfigurationsfenster öffnet unter Home Assistant 2025.12+ wieder korrekt.
- Ursache war die seit Home Assistant 2025.12 nicht mehr erlaubte direkte Zuweisung von `self.config_entry` im OptionsFlow.


## v2.4.0 – Bedingungen pro Verbraucher

Im Bearbeitungsdialog eines Verbrauchers gibt es den Bereich **Startbedingungen**:

- **Überschussbetrieb** bleibt der Standard. Der Verbraucher benötigt seine
  eingetragene Leistung plus Reserve als Einspeisung. Optionale Bedingungen
  schränken diese Freigabe zusätzlich ein.
- **Bedingungsbetrieb** benötigt mindestens eine Bedingung: Akkuladestand,
  PV-Leistung oder Zeitfenster. Alle aktivierten Bedingungen sind UND-verknüpft.
- Sensorfeld leer lassen, um SoC/PV zu deaktivieren. Beide Zeitfelder leer lassen,
  um das Zeitfenster zu deaktivieren. Uhrzeiten beziehen sich auf die in Home
  Assistant eingestellte Zeitzone; z. B. 22:00–06:00 ist möglich. Beginn inklusive,
  Ende exklusiv. Gleiche Start-/Endzeit ist ungültig.
- Einschalten ab der oberen Schwelle, Abschalten bei oder unter der unteren
  Schwelle. Beispiel: SoC EIN 80 %, AUS 70 %; PV EIN 7000 W, AUS 5000 W.
  Zwischen den Schwellen bleibt ein automatisch gestarteter Verbraucher freigegeben.
- **Akku-Nutzung erlauben** ist standardmäßig aus und gilt nur für den
  Bedingungsbetrieb. Ohne diese Freigabe müssen aktive Speicherwächter mit
  vorzeichenrichtigen Lade-/Entladeleistungssensoren **aller** beteiligten Speicher
  eingerichtet sein. Einschaltbudget = Einspeisung − Bezug + aktuelle Ladeleistung.
  Die Reserve wird weiterhin berücksichtigt. Die Integration kann nicht erkennen,
  ob ein weiterer Speicher fehlt. Keine Summensensoren zusammen mit deren
  Einzelsensoren eintragen. Reine Entladesensoren liefern keine Ladeleistung.
- Mit erlaubter Akku-Nutzung kann ein Verbraucher ohne vorherige Einspeisung starten.
  Es wird einzeln nach Priorität zugeschaltet und anschließend der Netzbezug geprüft.
  **Das garantiert keinen bezugsfreien Betrieb:** Die verfügbare Entladeleistung ist
  unbekannt. Kurzzeitiger Bezug, bei Mindestlaufzeiten auch länger, ist möglich.
  Bestehende globale Speicherwächter werden durch diese Option nicht umgangen.
- Speichergrenzen sind Entladetoleranzen, keine absolute Null-Entlade-Garantie.
  Ausschaltverzögerung, Mindestlaufzeit und Beruhigungszeit bleiben wirksam.
  Eine Mindestlaufzeit kann das Abschalten am Ende des Zeitfensters verzögern.
- Verbraucher mit derzeit nicht erfüllten Bedingungen werden beim Start übersprungen.
  Unter den freigegebenen Verbrauchern gelten weiterhin die EIN-Prioritäten;
  Abschaltungen folgen den AUS-Prioritäten. Manuell/extern eingeschaltete Geräte
  werden nicht übernommen. TEST zeigt die geplante Aktion ohne zu schalten.
- Fehlende/ungültige SoC-/PV-Sensoren sperren Starts und führen bei verwalteten
  Verbrauchern nach den genannten Zeiten zur Abschaltung. Ein ausgefallener aktiver
  Speicherwächter sperrt ebenfalls Starts und löst Lastabwurf aus. Ein ungültiger
  Netzsensor hält wie bisher die gesamte Automatik an; er löst keine Schaltung aus.
- Alte Verbraucherkonfigurationen erhalten automatisch den bisherigen
  Überschussmodus ohne zusätzliche Bedingungen. Einstellungen bleiben gespeichert.

### Beispiel: Poolpumpe ab 80 % und 7 kW zwischen 11 und 17 Uhr

Verbraucher bearbeiten → Bedingungsbetrieb → SoC-Sensor auswählen (80/70 %) →
PV-Sensor auswählen (7000/5000 W) → Zeitfenster 11:00 bis 17:00.
Akku-Nutzung zunächst ausgeschaltet lassen und Speicherwächter konfigurieren.
Damit darf die Pumpe auch einen Teil der laufenden Speicherladung nutzen.

Nach dem Update Home Assistant neu starten und die Kartenressource auf
`/surplus_manager/surplus-manager-card.js?v=2.4.0` setzen bzw. den Browsercache neu laden.

### Service-API

`add_consumer` und `update_consumer` akzeptieren das optionale Objekt `conditions`:

```yaml
conditions:
  control_mode: conditions  # surplus oder conditions
  soc_entity: sensor.battery_soc
  soc_start: 80
  soc_stop: 70
  pv_entity: sensor.pv_power
  pv_start_w: 7000
  pv_stop_w: 5000
  window_start: "11:00"
  window_end: "17:00"
  allow_discharge: false
```

Beim Update ersetzt ein übergebenes `conditions`-Objekt die bisherigen Bedingungen;
fehlende Felder erhalten Standardwerte. Ohne `conditions` bleiben diese unverändert.
`conditions: {}` setzt sie auf den bisherigen Überschussbetrieb zurück.
Leistungssensoren werden in W oder kW gelesen; SoC wird in Prozent erwartet.

### Entwicklungstests

`python -m unittest discover -s tests -v` prüft die Regellogik mit simulierten
Home-Assistant-Grenzen und kontrollierter Uhrzeit. Dies ersetzt keinen Praxistest
mit realen Wechselrichtern, Speichern und Verbrauchern.
