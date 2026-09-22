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

- URL: `/surplus_manager/surplus-manager-card.js`
- Typ: JavaScript-Modul

Danach werden Backend und Karte gemeinsam über HACS aktualisiert.

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
