const SURPLUS_MANAGER_CARD_VERSION = "2.3.1";

const SURPLUS_MANAGER_TRANSLATIONS = {
  de: {},
  en: {
    "Überschussmanager":"Surplus Manager","Überschuss":"Surplus","Bezug":"Grid import","Aktive Last":"Active load",
    "Speicher OK":"Battery OK","Speicherentladung":"Battery discharge","Kein Speicherwächter":"No battery guard","Netzsensor Fehler":"Grid sensor error",
    "Einstellungen":"Settings","Schließen":"Close","Gesamte Regelung ein/aus":"Enable/disable control",
    "Eine Position hoch":"Move up","Eine Position runter":"Move down","Verbraucher hinzufügen":"Add consumer",
    "Markierten Verbraucher bearbeiten":"Edit selected consumer","Markierten Verbraucher entfernen":"Remove selected consumer",
    "Noch keine Verbraucher.":"No consumers yet.","Mit + den ersten anlegen.":"Use + to add the first one.",
    "Oben = zuerst einschalten":"Top = switch on first","Oben = zuerst abschalten":"Top = switch off first",
    "Zeilen können am PC auch per Drag & Drop sortiert werden":"Rows can also be sorted by drag & drop on desktop",
    "Reihenfolge beim Einschalten":"Switch-on order","Reihenfolge beim Abschalten":"Switch-off order",
    "Betriebsart":"Operating mode","AUTO regelt normal. TEST simuliert nur und schaltet keine Geräte.":"AUTO controls normally. TEST only simulates and does not switch devices.",
    "Reserve":"Reserve","Speichern":"Save","Netzsensor":"Grid sensor","Sensor für Netzbezug und Einspeisung":"Sensor for grid import and export",
    "Positiv = Netzbezug · negativ = Einspeisung":"Positive = grid import · negative = grid export",
    "Speicher":"Battery","Speicherwächter":"Battery guard","Noch kein Speicherwächter angelegt.":"No battery guard configured yet.",
    "Leistungssensor des Speichers":"Battery power sensor","Abschaltschwelle":"Switch-off threshold","Vorzeichen bei Entladung":"Discharge sign",
    "Entladung positiv":"Discharge positive","Entladung negativ":"Discharge negative","Speicherwächter aktiv":"Battery guard enabled",
    "Überschreitet irgendein aktiver Speicher seine Grenze länger als die globale Ausschaltverzögerung, wird nach der AUS-Reihenfolge Last abgeworfen.":"If any enabled battery exceeds its threshold for longer than the global switch-off delay, loads are shed according to the OFF order.",
    "Neu":"New","Verbraucher anlegen":"Add consumer","Verbraucher bearbeiten":"Edit consumer","Name":"Name","Schalt-Entität":"Switch entity",
    "Leistungssensor":"Power sensor","(optional)":"(optional)","Leistungsbedarf":"Required power","Freigabe":"Automation",
    "AUTO aktiv":"AUTO enabled","gesperrt":"blocked","Mindestlaufzeit":"Minimum runtime","Mindestpause":"Minimum off-time",
    "Klima-Modus":"Climate mode","Heizen":"Heat","Kühlen":"Cool","Heizen/Kühlen":"Heat/Cool","Entfeuchten":"Dry","Nur Lüfter":"Fan only",
    "Solltemperatur":"Target temperature","Abbrechen":"Cancel","Ziehen zum Sortieren":"Drag to sort","Für Überschussautomatik freigeben":"Enable for surplus automation",
    "AUS":"OFF","EIN":"ON","GESPERRT":"BLOCKED","MANUELL EIN":"MANUAL ON","FEHLER":"ERROR",
    "Manuell ausschalten und wieder AUTO aktivieren":"Switch off manually and return to AUTO","Gerät manuell einschalten":"Switch device on manually",
    "Sprache":"Language","Automatisch (Home Assistant)":"Automatic (Home Assistant)","Übernehmen":"Apply",
    "Automatisch übernimmt die Sprache von Home Assistant.":"Automatic uses the Home Assistant language.",
    "Konfigurationsprüfung":"Configuration check","Diagnose":"Diagnostics","Netzleistung":"Grid power","Erlaubter Netzbezug":"Allowed grid import",
    "Regelung":"Control","aktiv":"enabled","aus":"off","Nächster Verbraucher":"Next consumer","Kein geeigneter Verbraucher":"No suitable consumer",
    "Verbraucher":"Consumers","nicht verfügbar":"unavailable","Speicher-Sensorfehler":"Battery sensor errors","Version":"Version","OK":"OK","Fehler":"Error",
    "Bitte einen gültigen Sensor auswählen.":"Please select a valid sensor.","Bitte eine gültige Reserve in Watt eintragen.":"Please enter a valid reserve in watts.",
    "Bitte Name, Leistungssensor und gültige Abschaltschwelle eintragen.":"Please enter a name, power sensor and valid switch-off threshold.",
    "Bitte Name, gültige Entität und Leistungsbedarf ausfüllen.":"Please enter a name, valid entity and required power.",
    "wirklich entfernen?":"really remove?","aktuell":"current","Soll":"Target","Entladung":"Discharge","Grenze":"Threshold"
  },
  fr: {
    "Überschussmanager":"Gestionnaire de surplus","Überschuss":"Surplus","Bezug":"Import réseau","Aktive Last":"Charge active",
    "Speicher OK":"Batterie OK","Speicherentladung":"Décharge batterie","Kein Speicherwächter":"Aucune surveillance batterie","Netzsensor Fehler":"Erreur capteur réseau",
    "Einstellungen":"Paramètres","Manuell ausschalten und wieder AUTO aktivieren":"Désactiver manuellement et revenir à AUTO","Gerät manuell einschalten":"Activer l’appareil manuellement","Schließen":"Fermer","Gesamte Regelung ein/aus":"Activer/désactiver la régulation",
    "Eine Position hoch":"Monter","Eine Position runter":"Descendre","Verbraucher hinzufügen":"Ajouter un consommateur",
    "Markierten Verbraucher bearbeiten":"Modifier le consommateur sélectionné","Markierten Verbraucher entfernen":"Supprimer le consommateur sélectionné",
    "Noch keine Verbraucher.":"Aucun consommateur.","Mit + den ersten anlegen.":"Utilisez + pour ajouter le premier.",
    "Oben = zuerst einschalten":"En haut = activé en premier","Oben = zuerst abschalten":"En haut = arrêté en premier",
    "Zeilen können am PC auch per Drag & Drop sortiert werden":"Les lignes peuvent aussi être triées par glisser-déposer sur ordinateur",
    "Reihenfolge beim Einschalten":"Ordre d'activation","Reihenfolge beim Abschalten":"Ordre d'arrêt","Betriebsart":"Mode de fonctionnement",
    "AUTO regelt normal. TEST simuliert nur und schaltet keine Geräte.":"AUTO régule normalement. TEST simule sans commuter les appareils.",
    "Reserve":"Réserve","Speichern":"Enregistrer","Netzsensor":"Capteur réseau","Sensor für Netzbezug und Einspeisung":"Capteur pour import et export réseau",
    "Positiv = Netzbezug · negativ = Einspeisung":"Positif = import · négatif = export","Speicher":"Batterie","Speicherwächter":"Surveillance batterie",
    "Noch kein Speicherwächter angelegt.":"Aucune surveillance batterie configurée.","Leistungssensor des Speichers":"Capteur de puissance batterie",
    "Abschaltschwelle":"Seuil d'arrêt","Vorzeichen bei Entladung":"Signe de décharge","Entladung positiv":"Décharge positive","Entladung negativ":"Décharge négative",
    "Speicherwächter aktiv":"Surveillance batterie active","Neu":"Nouveau","Verbraucher anlegen":"Ajouter un consommateur","Verbraucher bearbeiten":"Modifier le consommateur",
    "Name":"Nom","Schalt-Entität":"Entité de commutation","Leistungssensor":"Capteur de puissance","(optional)":"(facultatif)","Leistungsbedarf":"Puissance requise",
    "Freigabe":"Autorisation","AUTO aktiv":"AUTO actif","gesperrt":"bloqué","Mindestlaufzeit":"Durée minimale","Mindestpause":"Pause minimale",
    "Klima-Modus":"Mode climatisation","Heizen":"Chauffage","Kühlen":"Refroidissement","Heizen/Kühlen":"Chauffage/Refroidissement","Entfeuchten":"Déshumidification",
    "Nur Lüfter":"Ventilation seule","Solltemperatur":"Température cible","Abbrechen":"Annuler","Ziehen zum Sortieren":"Glisser pour trier",
    "Für Überschussautomatik freigeben":"Autoriser pour l'automatisation du surplus","AUS":"ARRÊT","EIN":"MARCHE","GESPERRT":"BLOQUÉ","MANUELL EIN":"MANUEL ON","FEHLER":"ERREUR",
    "Sprache":"Langue","Automatisch (Home Assistant)":"Automatique (Home Assistant)","Übernehmen":"Appliquer","Automatisch übernimmt die Sprache von Home Assistant.":"Automatique utilise la langue de Home Assistant.",
    "Konfigurationsprüfung":"Vérification de configuration","Diagnose":"Diagnostic","Netzleistung":"Puissance réseau","Erlaubter Netzbezug":"Import réseau autorisé",
    "Regelung":"Régulation","aktiv":"active","aus":"arrêt","Nächster Verbraucher":"Prochain consommateur","Kein geeigneter Verbraucher":"Aucun consommateur approprié",
    "Verbraucher":"Consommateurs","nicht verfügbar":"indisponibles","Speicher-Sensorfehler":"Erreurs capteur batterie","Version":"Version","OK":"OK","Fehler":"Erreur",
    "Bitte einen gültigen Sensor auswählen.":"Veuillez sélectionner un capteur valide.","Bitte eine gültige Reserve in Watt eintragen.":"Veuillez saisir une réserve valide en watts.",
    "Bitte Name, Leistungssensor und gültige Abschaltschwelle eintragen.":"Veuillez saisir un nom, un capteur de puissance et un seuil valide.",
    "Bitte Name, gültige Entität und Leistungsbedarf ausfüllen.":"Veuillez saisir un nom, une entité valide et la puissance requise.",
    "wirklich entfernen?":"vraiment supprimer ?","aktuell":"actuel","Soll":"Cible","Entladung":"Décharge","Grenze":"Seuil"
  },
  es: {
    "Überschussmanager":"Gestor de excedentes","Überschuss":"Excedente","Bezug":"Importación","Aktive Last":"Carga activa",
    "Speicher OK":"Batería OK","Speicherentladung":"Descarga de batería","Kein Speicherwächter":"Sin vigilancia de batería","Netzsensor Fehler":"Error del sensor de red",
    "Einstellungen":"Ajustes","Manuell ausschalten und wieder AUTO aktivieren":"Apagar manualmente y volver a AUTO","Gerät manuell einschalten":"Encender el dispositivo manualmente","Schließen":"Cerrar","Gesamte Regelung ein/aus":"Activar/desactivar control",
    "Eine Position hoch":"Subir","Eine Position runter":"Bajar","Verbraucher hinzufügen":"Añadir consumidor",
    "Markierten Verbraucher bearbeiten":"Editar consumidor seleccionado","Markierten Verbraucher entfernen":"Eliminar consumidor seleccionado",
    "Noch keine Verbraucher.":"Aún no hay consumidores.","Mit + den ersten anlegen.":"Use + para añadir el primero.",
    "Oben = zuerst einschalten":"Arriba = conectar primero","Oben = zuerst abschalten":"Arriba = desconectar primero",
    "Zeilen können am PC auch per Drag & Drop sortiert werden":"Las filas también se pueden ordenar arrastrando en el PC",
    "Reihenfolge beim Einschalten":"Orden de conexión","Reihenfolge beim Abschalten":"Orden de desconexión","Betriebsart":"Modo de funcionamiento",
    "AUTO regelt normal. TEST simuliert nur und schaltet keine Geräte.":"AUTO regula normalmente. TEST solo simula y no conmuta dispositivos.",
    "Reserve":"Reserva","Speichern":"Guardar","Netzsensor":"Sensor de red","Sensor für Netzbezug und Einspeisung":"Sensor para importación y exportación de red",
    "Positiv = Netzbezug · negativ = Einspeisung":"Positivo = importación · negativo = exportación","Speicher":"Batería","Speicherwächter":"Vigilancia de batería",
    "Noch kein Speicherwächter angelegt.":"Aún no hay vigilancia de batería.","Leistungssensor des Speichers":"Sensor de potencia de batería","Abschaltschwelle":"Umbral de desconexión",
    "Vorzeichen bei Entladung":"Signo de descarga","Entladung positiv":"Descarga positiva","Entladung negativ":"Descarga negativa","Speicherwächter aktiv":"Vigilancia de batería activa",
    "Neu":"Nuevo","Verbraucher anlegen":"Añadir consumidor","Verbraucher bearbeiten":"Editar consumidor","Name":"Nombre","Schalt-Entität":"Entidad de conmutación",
    "Leistungssensor":"Sensor de potencia","(optional)":"(opcional)","Leistungsbedarf":"Potencia requerida","Freigabe":"Habilitación","AUTO aktiv":"AUTO activo","gesperrt":"bloqueado",
    "Mindestlaufzeit":"Tiempo mínimo encendido","Mindestpause":"Tiempo mínimo apagado","Klima-Modus":"Modo climatización","Heizen":"Calefacción","Kühlen":"Refrigeración",
    "Heizen/Kühlen":"Calor/Frío","Entfeuchten":"Deshumidificar","Nur Lüfter":"Solo ventilador","Solltemperatur":"Temperatura objetivo","Abbrechen":"Cancelar",
    "Ziehen zum Sortieren":"Arrastrar para ordenar","Für Überschussautomatik freigeben":"Habilitar para automatización de excedentes","AUS":"OFF","EIN":"ON","GESPERRT":"BLOQUEADO",
    "MANUELL EIN":"MANUAL ON","FEHLER":"ERROR","Sprache":"Idioma","Automatisch (Home Assistant)":"Automático (Home Assistant)","Übernehmen":"Aplicar",
    "Automatisch übernimmt die Sprache von Home Assistant.":"Automático usa el idioma de Home Assistant.","Konfigurationsprüfung":"Comprobación de configuración","Diagnose":"Diagnóstico",
    "Netzleistung":"Potencia de red","Erlaubter Netzbezug":"Importación permitida","Regelung":"Control","aktiv":"activo","aus":"apagado","Nächster Verbraucher":"Siguiente consumidor",
    "Kein geeigneter Verbraucher":"Ningún consumidor adecuado","Verbraucher":"Consumidores","nicht verfügbar":"no disponibles","Speicher-Sensorfehler":"Errores de sensor de batería","Version":"Versión",
    "OK":"OK","Fehler":"Error","Bitte einen gültigen Sensor auswählen.":"Seleccione un sensor válido.","Bitte eine gültige Reserve in Watt eintragen.":"Introduzca una reserva válida en vatios.",
    "Bitte Name, Leistungssensor und gültige Abschaltschwelle eintragen.":"Introduzca nombre, sensor de potencia y un umbral válido.","Bitte Name, gültige Entität und Leistungsbedarf ausfüllen.":"Introduzca nombre, entidad válida y potencia requerida.",
    "wirklich entfernen?":"¿eliminar realmente?","aktuell":"actual","Soll":"Objetivo","Entladung":"Descarga","Grenze":"Umbral"
  },
  nl: {
    "Überschussmanager":"Overschotmanager","Überschuss":"Overschot","Bezug":"Netafname","Aktive Last":"Actieve belasting",
    "Speicher OK":"Batterij OK","Speicherentladung":"Batterijontlading","Kein Speicherwächter":"Geen batterijbewaking","Netzsensor Fehler":"Fout netsensor",
    "Einstellungen":"Instellingen","Manuell ausschalten und wieder AUTO aktivieren":"Handmatig uitschakelen en terug naar AUTO","Gerät manuell einschalten":"Apparaat handmatig inschakelen","Schließen":"Sluiten","Gesamte Regelung ein/aus":"Regeling aan/uit",
    "Eine Position hoch":"Omhoog","Eine Position runter":"Omlaag","Verbraucher hinzufügen":"Verbruiker toevoegen",
    "Markierten Verbraucher bearbeiten":"Geselecteerde verbruiker bewerken","Markierten Verbraucher entfernen":"Geselecteerde verbruiker verwijderen",
    "Noch keine Verbraucher.":"Nog geen verbruikers.","Mit + den ersten anlegen.":"Gebruik + om de eerste toe te voegen.",
    "Oben = zuerst einschalten":"Boven = eerst inschakelen","Oben = zuerst abschalten":"Boven = eerst uitschakelen",
    "Zeilen können am PC auch per Drag & Drop sortiert werden":"Rijen kunnen op desktop ook via slepen worden gesorteerd",
    "Reihenfolge beim Einschalten":"Inschakelvolgorde","Reihenfolge beim Abschalten":"Uitschakelvolgorde","Betriebsart":"Bedrijfsmodus",
    "AUTO regelt normal. TEST simuliert nur und schaltet keine Geräte.":"AUTO regelt normaal. TEST simuleert alleen en schakelt geen apparaten.",
    "Reserve":"Reserve","Speichern":"Opslaan","Netzsensor":"Netsensor","Sensor für Netzbezug und Einspeisung":"Sensor voor netafname en teruglevering",
    "Positiv = Netzbezug · negativ = Einspeisung":"Positief = netafname · negatief = teruglevering","Speicher":"Batterij","Speicherwächter":"Batterijbewaking",
    "Noch kein Speicherwächter angelegt.":"Nog geen batterijbewaking ingesteld.","Leistungssensor des Speichers":"Vermogenssensor batterij","Abschaltschwelle":"Uitschakeldrempel",
    "Vorzeichen bei Entladung":"Teken bij ontladen","Entladung positiv":"Ontladen positief","Entladung negativ":"Ontladen negatief","Speicherwächter aktiv":"Batterijbewaking actief",
    "Neu":"Nieuw","Verbraucher anlegen":"Verbruiker toevoegen","Verbraucher bearbeiten":"Verbruiker bewerken","Name":"Naam","Schalt-Entität":"Schakel-entiteit",
    "Leistungssensor":"Vermogenssensor","(optional)":"(optioneel)","Leistungsbedarf":"Benodigd vermogen","Freigabe":"Vrijgave","AUTO aktiv":"AUTO actief","gesperrt":"geblokkeerd",
    "Mindestlaufzeit":"Minimale looptijd","Mindestpause":"Minimale pauze","Klima-Modus":"Klimaatmodus","Heizen":"Verwarmen","Kühlen":"Koelen","Heizen/Kühlen":"Verwarmen/Koelen",
    "Entfeuchten":"Ontvochtigen","Nur Lüfter":"Alleen ventilator","Solltemperatur":"Doeltemperatuur","Abbrechen":"Annuleren","Ziehen zum Sortieren":"Slepen om te sorteren",
    "Für Überschussautomatik freigeben":"Vrijgeven voor overschotautomatisering","AUS":"UIT","EIN":"AAN","GESPERRT":"GEBLOKKEERD","MANUELL EIN":"HANDMATIG AAN","FEHLER":"FOUT",
    "Sprache":"Taal","Automatisch (Home Assistant)":"Automatisch (Home Assistant)","Übernehmen":"Toepassen","Automatisch übernimmt die Sprache von Home Assistant.":"Automatisch gebruikt de Home Assistant-taal.",
    "Konfigurationsprüfung":"Configuratiecontrole","Diagnose":"Diagnose","Netzleistung":"Netvermogen","Erlaubter Netzbezug":"Toegestane netafname","Regelung":"Regeling","aktiv":"actief",
    "aus":"uit","Nächster Verbraucher":"Volgende verbruiker","Kein geeigneter Verbraucher":"Geen geschikte verbruiker","Verbraucher":"Verbruikers","nicht verfügbar":"niet beschikbaar",
    "Speicher-Sensorfehler":"Fouten batterijsensor","Version":"Versie","OK":"OK","Fehler":"Fout","Bitte einen gültigen Sensor auswählen.":"Selecteer een geldige sensor.",
    "Bitte eine gültige Reserve in Watt eintragen.":"Voer een geldige reserve in watt in.","Bitte Name, Leistungssensor und gültige Abschaltschwelle eintragen.":"Voer naam, vermogenssensor en geldige uitschakeldrempel in.",
    "Bitte Name, gültige Entität und Leistungsbedarf ausfüllen.":"Voer naam, geldige entiteit en benodigd vermogen in.","wirklich entfernen?":"echt verwijderen?","aktuell":"actueel",
    "Soll":"Doel","Entladung":"Ontlading","Grenze":"Drempel"
  }
};

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

  _effectiveLanguage() {
    const configured = String(this._state()?.attributes?.language || "auto").toLowerCase();
    if (configured !== "auto" && SURPLUS_MANAGER_TRANSLATIONS[configured]) return configured;
    const haLanguage = String(this._hass?.locale?.language || this._hass?.language || "en").toLowerCase().split("-")[0];
    return SURPLUS_MANAGER_TRANSLATIONS[haLanguage] ? haLanguage : "en";
  }

  _tr(text) {
    const source = String(text ?? "");
    const lang = this._effectiveLanguage();
    return SURPLUS_MANAGER_TRANSLATIONS[lang]?.[source] || source;
  }

  _languageOptions(selected) {
    const options = [
      ["auto", this._tr("Automatisch (Home Assistant)")],
      ["de", "Deutsch"], ["en", "English"], ["fr", "Français"], ["es", "Español"], ["nl", "Nederlands"],
    ];
    return options.map(([value, label]) => `<option value="${value}" ${selected === value ? "selected" : ""}>${label}</option>`).join("");
  }

  _translateReason(reason) {
    const r = String(reason || "");
    const exact = {
      "Fehler – Details über !":"Error – details via !",
      "Entität nicht verfügbar":"Entity unavailable",
      "Manuell eingeschaltet – AUTO gesperrt":"Manually switched on – AUTO blocked",
      "Manueller Modus – extern ausgeschaltet":"Manual mode – switched off externally",
      "Für AUTO gesperrt":"Blocked for AUTO",
      "Netzsensor nicht verfügbar – keine Automatik":"Grid sensor unavailable – no automation",
      "Regelung ausgeschaltet":"Control disabled",
      "Pause – keine automatische Schaltung":"Pause – no automatic switching",
      "Testmodus – beobachtet nur":"Test mode – monitoring only",
      "Mindestlaufzeit":"Minimum runtime",
      "Läuft · wartet ggf. auf AUS-Priorität":"Running · waiting for OFF priority if needed",
      "Automatisch eingeschaltet":"Automatically switched on",
      "Extern eingeschaltet – Automatik schaltet es nicht ab":"Switched on externally – automation will not switch it off",
      "Mindestpause":"Minimum off-time",
      "Einschaltverzögerung":"Switch-on delay",
      "Beruhigungszeit nach Schaltung":"Settling time after switching",
      "Bereit zum Einschalten":"Ready to switch on"
    };
    if (this._effectiveLanguage() === "de") return r;
    let en = exact[r] || r
      .replace(/^Wartet auf höhere Priorität: /, "Waiting for higher priority: ")
      .replace(/^Höhere Priorität wartet: /, "Higher priority waiting: ")
      .replace(/^Zu wenig Überschuss · benötigt /, "Not enough surplus · requires ")
      .replace(/^Testmodus · /, "Test mode · ");
    const maps = {
      fr: [["Error – details via !","Erreur – détails via !"],["Entity unavailable","Entité indisponible"],["Manually switched on – AUTO blocked","Activé manuellement – AUTO bloqué"],["Manual mode – switched off externally","Mode manuel – désactivé en externe"],["Blocked for AUTO","Bloqué pour AUTO"],["Grid sensor unavailable – no automation","Capteur réseau indisponible – pas d'automatisation"],["Control disabled","Régulation désactivée"],["Test mode – monitoring only","Mode test – observation uniquement"],["Minimum runtime","Durée minimale"],["Automatically switched on","Activé automatiquement"],["Minimum off-time","Pause minimale"],["Switch-on delay","Délai d'activation"],["Settling time after switching","Temps de stabilisation"],["Ready to switch on","Prêt à activer"],["Waiting for higher priority: ","Attend une priorité supérieure : "],["Higher priority waiting: ","Priorité supérieure en attente : "],["Not enough surplus · requires ","Surplus insuffisant · nécessite "],["Test mode · ","Mode test · "]],
      es: [["Error – details via !","Error – detalles en !"],["Entity unavailable","Entidad no disponible"],["Manually switched on – AUTO blocked","Encendido manualmente – AUTO bloqueado"],["Manual mode – switched off externally","Modo manual – apagado externamente"],["Blocked for AUTO","Bloqueado para AUTO"],["Grid sensor unavailable – no automation","Sensor de red no disponible – sin automatización"],["Control disabled","Control desactivado"],["Test mode – monitoring only","Modo prueba – solo observación"],["Minimum runtime","Tiempo mínimo encendido"],["Automatically switched on","Encendido automáticamente"],["Minimum off-time","Tiempo mínimo apagado"],["Switch-on delay","Retardo de conexión"],["Settling time after switching","Tiempo de estabilización"],["Ready to switch on","Listo para conectar"],["Waiting for higher priority: ","Esperando prioridad superior: "],["Higher priority waiting: ","Prioridad superior en espera: "],["Not enough surplus · requires ","Excedente insuficiente · necesita "],["Test mode · ","Modo prueba · "]],
      nl: [["Error – details via !","Fout – details via !"],["Entity unavailable","Entiteit niet beschikbaar"],["Manually switched on – AUTO blocked","Handmatig ingeschakeld – AUTO geblokkeerd"],["Manual mode – switched off externally","Handmatige modus – extern uitgeschakeld"],["Blocked for AUTO","Geblokkeerd voor AUTO"],["Grid sensor unavailable – no automation","Netsensor niet beschikbaar – geen automatisering"],["Control disabled","Regeling uitgeschakeld"],["Test mode – monitoring only","Testmodus – alleen observeren"],["Minimum runtime","Minimale looptijd"],["Automatically switched on","Automatisch ingeschakeld"],["Minimum off-time","Minimale pauze"],["Switch-on delay","Inschakelvertraging"],["Settling time after switching","Stabilisatietijd"],["Ready to switch on","Klaar om in te schakelen"],["Waiting for higher priority: ","Wacht op hogere prioriteit: "],["Higher priority waiting: ","Hogere prioriteit wacht: "],["Not enough surplus · requires ","Te weinig overschot · nodig "],["Test mode · ","Testmodus · "]]
    };
    for (const [from,to] of (maps[this._effectiveLanguage()] || [])) en = en.replace(from,to);
    return en;
  }

  _applyTranslations() {
    const lang = this._effectiveLanguage();
    if (lang === "de" || !this.shadowRoot) return;
    const walker = document.createTreeWalker(this.shadowRoot, NodeFilter.SHOW_TEXT);
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    for (const node of nodes) {
      const raw = node.nodeValue || "";
      const trimmed = raw.trim();
      if (!trimmed) continue;
      let translated = this._tr(trimmed);
      translated = translated
        .replace(/^Überschuss(?=\s)/, this._tr("Überschuss"))
        .replace(/^Bezug(?=\s)/, this._tr("Bezug"))
        .replace(/^Aktive Last(?=\s)/, this._tr("Aktive Last"))
        .replace(/^Speicherentladung(?=\s)/, this._tr("Speicherentladung"))
        .replace(/^Speicher (?=\d)/, this._tr("Speicher") + " ")
        .replace(/^Netzsensor OK$/, this._tr("Netzsensor") + " " + this._tr("OK"))
        .replace(/^Netzsensor Fehler$/, this._tr("Netzsensor") + " " + this._tr("Fehler"))
        .replace(/^aktuell(?=\s)/, this._tr("aktuell"))
        .replace(/^Soll(?=\s)/, this._tr("Soll"))
        .replace(/^Entladung(?=\s)/, this._tr("Entladung"))
        .replace(/ · Grenze /, " · " + this._tr("Grenze") + " ");
      if (translated !== trimmed) node.nodeValue = raw.replace(trimmed, translated);
    }
    for (const el of this.shadowRoot.querySelectorAll("[title],[aria-label],[placeholder]")) {
      for (const attr of ["title","aria-label","placeholder"]) {
        if (el.hasAttribute(attr)) el.setAttribute(attr, this._tr(el.getAttribute(attr)));
      }
    }
  }

  _fmtW(v) {
    if (v === null || v === undefined || Number.isNaN(Number(v))) return "–";
    const n = Number(v);
    const locale = {de:"de-DE",en:"en-GB",fr:"fr-FR",es:"es-ES",nl:"nl-NL"}[this._effectiveLanguage()] || "en-GB";
    if (Math.abs(n) >= 1000) {
      return `${new Intl.NumberFormat(locale, {maximumFractionDigits: 2, minimumFractionDigits: 0}).format(n / 1000)} kW`;
    }
    return `${new Intl.NumberFormat(locale, {maximumFractionDigits: 0}).format(Math.round(n))} W`;
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
    const unavailableConsumers = consumers.filter((c) => c.available === false).length;
    const invalidBatterySensors = batteryGuards.filter((g) => g.enabled && (g.discharge_w === null || g.discharge_w === undefined)).length;
    const nextConsumer = consumers.find((c) => c.enabled && !c.manual_on && !c.is_on) || null;
    const configuredLanguage = String(a.language || "auto");
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
            <div class="sectionTitle">Sprache</div>
            <div class="languageRow">
              <select id="settingsLanguage">${this._languageOptions(configuredLanguage)}</select>
              <button type="button" id="saveLanguage" class="primary compactPrimary">Übernehmen</button>
            </div>
            <div class="hint">Automatisch übernimmt die Sprache von Home Assistant.</div>
          </div>

          <div class="settingsSection">
            <div class="sectionTitle">Reserve</div>
            <div class="reserveRow">
              <div class="unitInput"><input id="settingsReserve" type="number" min="0" step="10" value="${this._esc(a.reserve_w ?? 150)}"><span>W</span></div>
              <button type="button" id="saveReserve" class="primary compactPrimary">Speichern</button>
            </div>
          </div>

          <div class="settingsSection ${gridValid ? "okBox" : "badBox"}">
            <div class="gridSensorHeader">
              <div class="settingsStatusIcon"><ha-icon icon="${gridValid ? "mdi:check-network" : "mdi:network-off"}"></ha-icon></div>
              <div>
                <div class="sectionTitle">Netzsensor ${gridValid ? "OK" : "Fehler"}</div>
                <div class="meta">Sensor für Netzbezug und Einspeisung</div>
              </div>
            </div>
            <ha-entity-picker id="settingsGridSensor"></ha-entity-picker>
            <div class="gridSensorActions">
              <div class="hint">Positiv = Netzbezug · negativ = Einspeisung</div>
              <button type="button" id="saveGridSensor" class="primary compactPrimary">Speichern</button>
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

          <div class="settingsSection configCheck">
            <div class="sectionTitle">Konfigurationsprüfung</div>
            <div class="checkGrid">
              <div class="${gridValid ? "checkOk" : "checkBad"}"><ha-icon icon="${gridValid ? "mdi:check-circle" : "mdi:alert-circle"}"></ha-icon> Netzsensor ${gridValid ? "OK" : "Fehler"}</div>
              <div class="${consumers.length ? "checkOk" : "checkBad"}"><ha-icon icon="${consumers.length ? "mdi:check-circle" : "mdi:alert-circle"}"></ha-icon> Verbraucher ${consumers.length}</div>
              <div class="${unavailableConsumers ? "checkWarn" : "checkOk"}"><ha-icon icon="${unavailableConsumers ? "mdi:alert" : "mdi:check-circle"}"></ha-icon> ${unavailableConsumers} nicht verfügbar</div>
              <div class="${invalidBatterySensors ? "checkWarn" : "checkOk"}"><ha-icon icon="${invalidBatterySensors ? "mdi:alert" : "mdi:check-circle"}"></ha-icon> Speicher-Sensorfehler ${invalidBatterySensors}</div>
            </div>
          </div>

          <details class="settingsSection diagnostics">
            <summary><span class="sectionTitle">Diagnose</span></summary>
            <div class="diagGrid">
              <span>Netzleistung</span><b>${this._fmtW(a.grid_power_w)}</b>
              <span>Überschuss</span><b>${this._fmtW(a.export_w)}</b>
              <span>Bezug</span><b>${this._fmtW(a.import_w)}</b>
              <span>Reserve</span><b>${this._fmtW(a.reserve_w)}</b>
              <span>Erlaubter Netzbezug</span><b>${this._fmtW(a.max_import_w)}</b>
              <span>Regelung</span><b>${enabled ? "aktiv" : "aus"} · ${String(mode).toUpperCase()}</b>
              <span>Nächster Verbraucher</span><b>${nextConsumer ? this._esc(nextConsumer.name) : "Kein geeigneter Verbraucher"}</b>
            </div>
            ${nextConsumer ? `<div class="diagReason">${this._esc(this._translateReason(nextConsumer.reason || ""))}</div>` : ""}
          </details>

          <div class="versionLine">Überschussmanager v${SURPLUS_MANAGER_CARD_VERSION}</div>
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

    this._applyTranslations();
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
          <div class="reason" title="${this._esc(this._translateReason(c.reason || ""))}">
            ${this._esc(this._translateReason(c.reason || ""))} ${countdown}
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
        .gridSensorHeader { display:flex; align-items:center; gap:10px; margin-bottom:10px; }
        .gridSensorHeader .sectionTitle { margin-bottom:2px; }
        #settingsGridSensor { display:block; width:100%; }
        .gridSensorActions { display:flex; align-items:center; justify-content:space-between; gap:10px; margin-top:9px; }
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
        .languageRow { display:flex; gap:10px; align-items:center; }
        .languageRow select { flex:1; min-width:0; }
        .configCheck .checkGrid { display:grid; grid-template-columns:1fr 1fr; gap:8px; margin-top:8px; }
        .checkGrid > div { display:flex; align-items:center; gap:6px; padding:7px 8px; border-radius:9px; background:var(--secondary-background-color); font-size:12px; }
        .checkGrid ha-icon { --mdc-icon-size:16px; }
        .checkOk { color:var(--success-color, #43a047); }
        .checkWarn { color:var(--warning-color, #fb8c00); }
        .checkBad { color:var(--error-color); }
        details.diagnostics summary { cursor:pointer; list-style:none; }
        details.diagnostics summary::-webkit-details-marker { display:none; }
        .diagGrid { display:grid; grid-template-columns:1fr auto; gap:7px 14px; margin-top:10px; font-size:12px; }
        .diagGrid span { color:var(--secondary-text-color); }
        .diagGrid b { text-align:right; }
        .diagReason { margin-top:9px; padding:8px; border-radius:8px; background:var(--secondary-background-color); font-size:12px; }
        .versionLine { text-align:center; color:var(--secondary-text-color); font-size:11px; padding:3px 0 1px; }
        @media (max-width: 600px) {
          .configCheck .checkGrid { grid-template-columns:1fr; }
          .languageRow { align-items:stretch; flex-direction:column; }
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
    q("#saveLanguage")?.addEventListener("click", async () => {
      const language = String(q("#settingsLanguage")?.value || "auto");
      await this._hass.callService("surplus_manager", "set_language", {
        config_entry_id: entryId,
        language,
      });
      q("#settingsEditor")?.close();
    });
        const gridPicker = q("#settingsGridSensor");
    if (gridPicker) {
      gridPicker.hass = this._hass;
      gridPicker.value = state?.attributes?.grid_power_entity || "";
      gridPicker.includeDomains = ["sensor"];
      gridPicker.allowCustomEntity = true;
    }
    q("#saveGridSensor")?.addEventListener("click", async () => {
      const entityId = String(gridPicker?.value || "").trim();
      if (!entityId || !entityId.startsWith("sensor.")) {
        alert(this._tr("Bitte einen gültigen Sensor auswählen."));
        return;
      }
      await this._hass.callService("surplus_manager", "set_grid_sensor", {
        config_entry_id: entryId,
        entity_id: entityId,
      });
      q("#settingsEditor")?.close();
    });
    q("#openBatteryEditor")?.addEventListener("click", () => q("#batteryEditor")?.showModal());
    q("#saveReserve")?.addEventListener("click", async () => {
      const reserve = Number(q("#settingsReserve")?.value);
      if (!Number.isFinite(reserve) || reserve < 0) {
        alert(this._tr("Bitte eine gültige Reserve in Watt eintragen."));
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
      alert(this._tr("Bitte Name, Leistungssensor und gültige Abschaltschwelle eintragen."));
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
      alert(this._tr("Bitte Name, gültige Entität und Leistungsbedarf ausfüllen."));
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