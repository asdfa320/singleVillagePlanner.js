/*
 * Script Name: Single Village Planner
 * Version: v2.1.2
 * Last Updated: 2025-08-15
 * Author: RedAlert
 * Author URL: https://twscripts.dev/
 * Author Contact: redalert_tw (Discord)
 * Approved: t14559753
 * Approved Date: 2021-02-11
 * Mod: JawJaw
 */

/* Copyright (c) RedAlert
By uploading a user-generated mod (script) for use with Tribal Wars, you grant InnoGames a perpetual, irrevocable, worldwide, royalty-free, non-exclusive license to use, reproduce, distribute, publicly display, modify, and create derivative works of the mod. This license permits InnoGames to incorporate the mod into any aspect of the game and its related services, including promotional and commercial endeavors, without any requirement for compensation or attribution to you. InnoGames is entitled but not obligated to name you when exercising its rights. You represent and warrant that you have the legal right to grant this license and that the mod does not infringe upon any third-party rights. You are - with the exception of claims of infringement by third parties – not liable for any usage of the mod by InnoGames. German law applies.
*/

var scriptData = {
    name: 'Single Village Planner',
    version: 'v2.1.2',
    author: 'RedAlert',
    authorUrl: 'https://twscripts.dev/',
    helpLink:
        'https://forum.tribalwars.net/index.php?threads/single-village-planner.286667/',
};

// User Input
if (typeof DEBUG !== 'boolean') DEBUG = false;

// Constants
var LS_PREFIX = 'raSingleVillagePlanner';
var TIME_INTERVAL = 60 * 60 * 1000 * 24 * 365; // unit info does not change during the whole world duration so we only need to get it once
var GROUP_ID = localStorage.getItem(`${LS_PREFIX}_chosen_group`) ?? 0;
var LAST_UPDATED_TIME = localStorage.getItem(`${LS_PREFIX}_last_updated`) ?? 0;

// Globals
var unitInfo,
    troopCounts = [];

// Helper: Generates script info
function scriptInfo() {
    return `[${scriptData.name} ${scriptData.version}]`;
}

// Helper: Prints universal debug information
function initDebug() {
    console.debug(`${scriptInfo()} It works đūŝß€!`);
    console.debug(`${scriptInfo()} HELP:`, scriptData.helpLink);
    if (DEBUG) {
        console.debug(`${scriptInfo()} Market:`, game_data.market);
        console.debug(`${scriptInfo()} World:`, game_data.world);
        console.debug(`${scriptInfo()} Screen:`, game_data.screen);
        console.debug(`${scriptInfo()} Game Version:`, game_data.majorVersion);
        console.debug(`${scriptInfo()} Game Build:`, game_data.version);
        console.debug(`${scriptInfo()} Locale:`, game_data.locale);
        console.debug(
            `${scriptInfo()} Premium:`,
            game_data.features.Premium.active
        );
    }
}

// Translations
var translations = {
    en_DK: {
        'Single Village Planner': 'Single Village Planner',
        Help: 'Help',
        'This script can only be run on a single village screen!':
            'This script can only be run on a single village screen!',
        Village: 'Village',
        'Calculate Launch Times': 'Calculate Launch Times',
        Reset: 'Reset',
        'Launch times are being calculated ...':
            'Launch times are being calculated ...',
        'Missing user input!': 'Missing user input!',
        'Landing Time': 'Landing Time',
        'This village has no unit selected!':
            'This village has no unit selected!',
        'Prio.': 'Prio.',
        'No possible combinations found!': 'No possible combinations found!',
        'Export Plan as BB Code': 'Export Plan as BB Code',
        'Plan for:': 'Plan for:',
        'Landing Time:': 'Landing Time:',
        Unit: 'Unit',
        'Launch Time': 'Launch Time',
        Command: 'Command',
        Status: 'Status',
        Send: 'Send',
        From: 'From',
        Priority: 'Priority',
        'Early send': 'Early send',
        'Landing time was updated!': 'Landing time was updated!',
        'Error fetching village groups!': 'Error fetching village groups!',
        'Dist.': 'Dist.',
        'Villages list could not be fetched!':
            'Villages list could not be fetched!',
        Group: 'Group',
        'Export Plan without tables': 'Export Plan without tables',
        'Chosen group was reset!': 'Chosen group was reset!',
        'Reset Chosen Group': 'Reset Chosen Group',
        'Script configuration was reset!': 'Script configuration was reset!',
    },
    sk_SK: {
        'Single Village Planner': 'Plánovač pre jednu dedinu',
        Help: 'Pomoc',
        'This script can only be run on a single village screen!':
            'Tento skript sa dá spustiť iba v náhľade dediny z mapy',
        Village: 'Dedina',
        'Calculate Launch Times': 'Výpočítaj čas pláču',
        Reset: 'Reset',
        'Launch times are being calculated ...':
            'Časy odoslania sa vypočítavajú ...',
        'Missing user input!': 'Chýba označenie jednotiek!',
        'Landing Time': 'Čas dopadu',
        'This village has no unit selected!':
            'Táto dedina nemá označenú jednotku!',
        'Prio.': 'Prio.',
        'No possible combinations found!':
            'Žiadne možné kombinácie sa nenašli!',
        'Export Plan as BB Code': 'Exportovat Plač ako BB Kódy',
        'Plan for:': 'Plán pre:',
        'Landing Time:': 'ČŠas dopadu:',
        Unit: 'Jednotka',
        'Launch Time': 'Čas odoslania:',
        Command: 'Prí­kaz',
        Status: 'Stav',
        Send: 'Odoslať',
        From: 'Z',
        Priority: 'Priorita',
        'Early send': 'Skoré odoslanie',
        'Landing time was updated!': 'Čas dopadu aktualizovaný!',
        'Error fetching village groups!': 'Chyba pri načítaní skupiny dedín',
        'Dist.': 'Vzdialenosť',
        'Villages list could not be fetched!':
            'Villages list could not be fetched!',
        Group: 'Group',
        'Export Plan without tables': 'Export Plan without tables',
        'Chosen group was reset!': 'Chosen group was reset!',
        'Reset Chosen Group': 'Reset Chosen Group',
        'Script configuration was reset!': 'Script configuration was reset!',
    },
    nl_NL: {
        'Single Village Planner': 'Enkel Dorp Planner',
        Help: 'Help',
        'This script can only be run on a single village screen!':
            'Het script kan enkel worden uitgevoerd op het dorpsoverzicht via de kaart!',
        Village: 'Dorp',
        'Calculate Launch Times': 'Bereken verzendtijden',
        Reset: 'Reset',
        'Launch times are being calculated ...':
            'Verzendtijden worden berekend ...',
        'Missing user input!': 'Mis spelersinvoer!',
        'Landing Time': 'Landingstijd',
        'This village has no unit selected!':
            'Dit dorp heeft geen troepen geselecteerd!',
        'Prio.': 'Prioriteit.',
        'No possible combinations found!': 'Geen mogelijkheden gevonden!',
        'Export Plan as BB Code': 'Exporteer plan als BB Code',
        'Plan for:': 'Plan voor:',
        'Landing Time:': 'Landingstijd:',
        Unit: 'Eenheid',
        'Launch Time': 'Verzendtijd',
        Command: 'Bevel',
        Status: 'Status',
        Send: 'Zend',
        From: 'Van',
        Priority: 'Prioriteit',
        'Early send': 'Vroeg verzenden',
        'Landing time was updated!': 'Aankomsttijd is geupdate!',
        'Error fetching village groups!':
            'Fout met ophalen van dorpen uit groep!',
        'Dist.': 'Afstand',
        'Villages list could not be fetched!':
            'Villages list could not be fetched!',
        Group: 'Group',
        'Export Plan without tables': 'Export Plan without tables',
        'Chosen group was reset!': 'Chosen group was reset!',
        'Reset Chosen Group': 'Reset Chosen Group',
        'Script configuration was reset!': 'Script configuration was reset!',
    },
    el_GR: {
        'Single Village Planner': 'Ατκτικός Πλάνο Χωριό',
        Help: 'Βοήθεια',
        'This script can only be run on a single village screen!':
            'Αυτό το Script τρέχει από τη σελίδα χωριού!',
        Village: 'Χωριό',
        'Calculate Launch Times': 'Υπολογισμός Χρόνου Εκκίνησης',
        Reset: 'Επαναφορά',
        'Launch times are being calculated ...':
            'Οι χρόνοι εκκίνησης υπολογίζονται ...',
        'Missing user input!': 'Λείπει δεδομένα!',
        'Landing Time': 'Χρόνος άφιξης',
        'This village has no unit selected!':
            'Αυτό το χωριό δεν έχει επιλεγμένη μονάδα!',
        'Prio.': 'Προτερ.',
        'No possible combinations found!': 'No possible combinations found!',
        'Export Plan as BB Code': 'Εξαγωγή πλάνου σε BB Code',
        'Plan for:': 'Πλάνο για:',
        'Landing Time:': 'Χρόνος άφιξης:',
        Unit: 'Μονάδα',
        'Launch Time': 'Χρόνος εκκίνησης',
        Command: 'Εντολή',
        Status: 'Κατάσταση',
        Send: 'Στείλε',
        From: 'Από',
        Priority: 'Προτεραιότητα',
        'Early send': 'Πρόωρη αποστολή',
        'Landing time was updated!': 'Ο χρόνος άφιξης ενημερώθηκε!',
        'Error fetching village groups!':
            'Σφάλμα λήψης ομάδων χωριών!',
        'Dist.': 'Dist.',
        'Villages list could not be fetched!':
            'Villages list could not be fetched!',
        Group: 'Group',
        'Export Plan without tables': 'Export Plan without tables',
        'Chosen group was reset!': 'Chosen group was reset!',
        'Reset Chosen Group': 'Reset Chosen Group',
        'Script configuration was reset!': 'Script configuration was reset!',
    },
    it_IT: {
        'Single Village Planner': 'Planner Singolo Villo',
        Help: 'Aiuto',
        'This script can only be run on a single village screen!':
            'Questo script può essere lanciato solo dalla panoramica del villaggio!',
        Village: 'Villaggio',
        Coords: 'Coordinate',
        Continent: 'Continente',
        'Calculate Launch Times': 'Calcola tempi di lancio',
        Reset: 'Reset',
        'Launch times are being calculated ...':
            'I tempi di lancio sono stati calcolati ...',
        'Missing user input!': 'Manca selezione truppe!',
        'Landing Time': 'Tempo di arrivo',
        'This village has no unit selected!':
            'Questo villaggio non ha le unità selezionate!',
        'Prio.': 'Prio.',
        'No possible combinations found!': 'Nessuna combinazione possibile!',
        'Export Plan as BB Code': 'Esporta il plan in BB code',
        'Plan for:': 'Plan per:',
        'Landing Time:': 'Tempo di arrivo:',
        Unit: 'Unità',
        'Launch Time': 'Tempo di lancio',
        Command: 'Comando',
        Status: 'Status',
        Send: 'Invia',
        From: 'Da',
        Priority: 'Priorità',
        'Early send': 'Anticipa invio',
        'Landing time was updated!': 'Il tempo di arrivo è stato aggiornato!',
        'Error fetching village groups!': 'Errore nel recupero gruppo!',
        Group: 'Gruppo',
        'Export Plan without tables': 'Export Plan without tables',
        'Chosen group was reset!': 'Chosen group was reset!',
        'Reset Chosen Group': 'Reset Chosen Group',
        'Script configuration was reset!': 'Script configuration was reset!',
    },
    tr_TR: {
        'Single Village Planner': 'Tek Köy Planlayıcısı',
        Help: 'Yardım',
        'This script can only be run on a single village screen!':
            'Bu komut dosyası yalnızca tek bir köy ekranında çalıştırılabilir',
        Village: 'Köy',
        Coords: 'Koordinat',
        Continent: 'Kıτα',
        'Calculate Launch Times': 'Başlatma Sürelerini Hesaplayın',
        Reset: 'Reset',
        'Launch times are being calculated ...':
            'Başlatma süreleri hesaplanıyor ...',
        'Missing user input!': 'Eksik kullanıcı girişi!',
        'Landing Time': 'iniş zamanı',
        'This village has no unit selected!': 'Bu köyde seçili birim yok!',
        'Prio.': 'Prio.',
        'No possible combinations found!': 'Olası kombinasyon bulunamadı!',
        'Export Plan as BB Code': 'Planı BB Kodu Olarak Dışa Aktar',
        'Plan for:': 'Plan için:',
        'Landing Time': 'İniş zamanı:',
        Unit: 'Birim',
        'Launch Time': 'Başlatma Zamanı:',
        Command: 'Komut',
        Status: 'Durum',
        Send: 'Gönder',
        From: 'Z',
        Priority: 'Öncelik',
        'Early send': 'erken gönder',
        'Landing time was updated!': 'İniş zamanı güncellendi!',
        'Error fetching village groups!':
            'Köy grupları getirilirken hata oluştu',
        'Dist.': 'Dist.',
        'Villages list could not be fetched!':
            'Villages list could not be fetched!',
        Group: 'Group',
        'Export Plan without tables': 'Export Plan without tables',
        'Chosen group was reset!': 'Chosen group was reset!',
        'Reset Chosen Group': 'Reset Chosen Group',
        'Script configuration was reset!': 'Script configuration was reset!',
    },
    pt_BR: {
        'Single Village Planner': 'Planeador para ataques em uma só aldeia',
        Help: 'Ajuda',
        'This script can only be run on a single village screen!':
            'Este script só pode ser usado na página de uma só aldeia!',
        Village: 'Aldeia',
        Coords: 'Coords',
        Continent: 'Continente',
        'Calculate Launch Times': 'Calcular tempos de envio',
        Reset: 'Reset',
        'Launch times are being calculated ...':
            'Os tempos de envio estão a ser calculados ...',
        'Missing user input!': 'Falta o input do utilizador!',
        'Landing Time': 'Tempo de chegada',
        'This village has no unit selected!':
            'Esta aldeia não tem unidades selecionadas!',
        'Prio.': 'Prioridade',
        'No possible combinations found!':
            'Não foram encontradas combinações possíveis!',
        'Export Plan as BB Code': 'Exportar plano em código BB',
        'Plan for:': 'Plano para:',
        'Landing Time:': 'Tempo de chegada:',
        Unit: 'Unidade',
        'Launch Time': 'Tempo de envio',
        Command: 'Comando',
        Status: 'Estado',
        Send: 'Send',
        From: 'From',
        Priority: 'Prioridade',
        'Early send': 'Enviar cedo',
        'Landing time was updated!': 'O tempo de chegada foi atualizado!',
        'Error fetching village groups!':
            'Erro a ir buscar os grupos de aldeias!',
        'Dist.': 'Dist.',
        'Villages list could not be fetched!':
            'Villages list could not be fetched!',
        Group: 'Group',
        'Export Plan without tables': 'Export Plan without tables',
        'Chosen group was reset!': 'Chosen group was reset!',
        'Reset Chosen Group': 'Reset Chosen Group',
        'Script configuration was reset!': 'Script configuration was reset!',
    },
    fr_FR: {
        'Single Village Planner': "Planificateur d'attaque village unique",
        Help: 'Aide',
        'This script can only be run on a single village screen!':
            "Ce script doit être lancé depuis la vu d'un village!",
        Village: 'Village',
        'Calculate Launch Times': "Calcul heure d'envoi",
        Reset: 'Réinitialiser',
        'Launch times are being calculated ...':
            "Heures d'envoi en cours de calcul ...",
        'Missing user input!': 'Aucun joueur renseigné!',
        'Landing Time': "Heure d'arrivée",
        'This village has no unit selected!':
            "Ce village n'a aucune unité sélectionnée!",
        'Prio.': 'Prio.',
        'No possible combinations found!': 'Aucune combinaison possible!',
        'Export Plan as BB Code': "Exporter le plan d'attaque en bb-code",
        'Plan for:': 'Plan pour:',
        'Landing Time:': "Heure d'arrivée:",
        Unit: 'Unité',
        'Launch Time': "Heure d'envoi",
        Command: 'Ordre',
        Status: 'Status',
        Send: 'Envoyer',
        From: 'Origine',
        Priority: 'Priorité',
        'Early send': 'Envoi tôt',
        'Landing time was updated!': "Heure d'arrivée mis à jour!",
        'Error fetching village groups!':
            'Erreur lors de la récupération des groupes de villages!',
        'Dist.': 'Dist.',
        'Villages list could not be fetched!':
            'Impossible de récupérer la liste des villages!',
        Group: 'Groupe',
        'Export Plan without tables': 'Exporter le plan sans tableau',
        'Chosen group was reset!': 'Groupe sélectionné réinitialisé!',
        'Reset Chosen Group': 'Réinitialiser groupe(s) sélectionnée(s)',
        'Script configuration was reset!': 'Configuration réinitialisée!',
    },
};

// Init Debug
initDebug();

function getPlannerTarget() {
    const $contentContainer = jQuery('#contentContainer');
    if ($contentContainer.length) {
        return { mode: 'prepend', $el: $contentContainer };
    }

    const $contentValue = jQuery('#content_value');
    if ($contentValue.length) {
        return { mode: 'before', $el: $contentValue };
    }

    return { mode: 'prepend', $el: jQuery('body') };
}

// Fetch unit config only when needed
if (LAST_UPDATED_TIME !== null) {
    if (Date.parse(new Date()) >= LAST_UPDATED_TIME + TIME_INTERVAL) {
        fetchUnitInfo();
    } else {
        unitInfo = JSON.parse(localStorage.getItem(`${LS_PREFIX}_unit_info`));
    }
} else {
    fetchUnitInfo();
}
function getDestinationVillageCoords() {
    return jQuery('#content_value')
        .find('tr')
        .filter(function () {
            return jQuery(this).find('td:first').text().trim() === 'Súradnice:';
        })
        .find('td:last')
        .text()
        .trim();
}
async function initAttackPlanner(groupId) { /* ... unchanged ... */ }

// ... keep the rest of your existing file unchanged ...

function waitForPlannerReady(attempts = 0) {
    const gameScreen = getParameterByName('screen');
    if (gameScreen !== 'info_village') {
        UI.ErrorMessage(
            tt('This script can only be run on a single village screen!')
        );
        return;
    }

    if (!document.querySelector('#content_value')) {
        if (attempts < 50) {
            setTimeout(() => waitForPlannerReady(attempts + 1), 200);
        }
        return;
    }

    initAttackPlanner(GROUP_ID);
}

// Initialize Script
(function () {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () =>
            waitForPlannerReady(0)
        );
    } else {
        waitForPlannerReady(0);
    }
})();
