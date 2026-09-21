# Home Assistant Überschussmanager

PV-Überschussmanager für Home Assistant mit Prioritäten, manueller Übersteuerung,
Testmodus, Speicherwächtern und eigener Dashboard-Karte.

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
