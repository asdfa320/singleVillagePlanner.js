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
By uploading a user-generated mod (script) for use with Tribal Wars, you grant InnoGames a perpetual, irrevocable, worldwide, royalty-free, non-exclusive license to use, reproduce, distribute, publicly display, modify, and create derivative works of the mod. This license permits InnoGames to incorporate the mod into any aspect of the game and its related services, including promotional and commercial endeavors, without any requirement for compensation or attribution to you. InnoGames is entitled but not obligated to name you when exercising its rights. You represent and warrant that you have the legal right to grant this license and that the mod does not infringe upon any third-party rights. You are - with the exception of claims of infringement by third parties â€“ not liable for any usage of the mod by InnoGames. German law applies.
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
var TIME_INTERVAL = 60 * 60 * 1000 * 24 * 365;
var GROUP_ID = localStorage.getItem(`${LS_PREFIX}_chosen_group`) ?? 0;
var LAST_UPDATED_TIME = localStorage.getItem(`${LS_PREFIX}_last_updated`) ?? 0;

// Globals
var unitInfo,
    troopCounts = [];

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
        'Single Village Planner': 'PlĂˇnovaÄŤ pre jednu dedinu',
        Help: 'Pomoc',
        'This script can only be run on a single village screen!':
            'Tento skript sa dĂˇ spustiĹĄ iba v nĂˇhÄľade dediny z mapy',
        Village: 'Dedina',
        'Calculate Launch Times': 'VĂ˝poÄŤet ÄŤasov odoslania',
        Reset: 'Reset',
        'Launch times are being calculated ...':
            'ÄŚasy odoslania sa vypoÄŤĂ­tavajĂş ...',
        'Missing user input!': 'ChĂ˝ba oznaÄŤenie jednotiek!',
        'Landing Time': 'ÄŚas dopadu',
        'This village has no unit selected!':
            'TĂˇto dedina nemĂˇ oznaÄŤenĂş jednotku!',
        'Prio.': 'Prio.',
        'No possible combinations found!':
            'Ĺ˝iadne moĹľnĂ© kombinĂˇcie sa nenaĹˇli!',
        'Export Plan as BB Code': 'ExportovaĹĄ PlĂˇn ako BB KĂłdy',
        'Plan for:': 'PlĂˇn pre:',
        'Landing Time:': 'ÄŚas dopadu:',
        Unit: 'Jednotka',
        'Launch Time': 'ÄŚas odoslania:',
        Command: 'PrĂ­kaz',
        Status: 'Stav',
        Send: 'OdoslaĹĄ',
        From: 'Z',
        Priority: 'Priorita',
        'Early send': 'SkorĂ© odoslanie',
        'Landing time was updated!': 'ÄŚas dopadu aktualizovanĂ˝!',
        'Error fetching village groups!': 'Chyba pri naÄŤĂ­tanĂ­ skupiny dedĂ­n',
        'Dist.': 'VzdialenosĹĄ',
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
        'Landing Time': 'Landingstijd:',
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
        'Single Village Planner': 'Î‘Ď„ÎżÎĽÎąÎşĎŚ Î Î»Î¬Î˝Îż Î§Ď‰ĎÎąÎżĎŤ',
        Help: 'Î’ÎżÎ®Î¸ÎµÎąÎ±',
        'This script can only be run on a single village screen!':
            'Î‘Ď…Ď„Îż Ď„Îż Script Ď„ĎÎ­Ď‡ÎµÎą Î±Ď€Îż Î Î»Î·ĎÎżĎ†ÎżĎÎŻÎµĎ‚ Î§Ď‰ĎÎąÎżĎŤ!',
        Village: 'Î§Ď‰ĎÎąĎŚ',
        'Calculate Launch Times': 'ÎĄĎ€ÎżÎ»ĎŚÎłÎąĎÎµ ÎŹĎÎ± Î•ÎşÎşÎŻÎ˝Î·ĎÎ·Ď‚',
        Reset: 'Î•Ď€Î±Î˝Î±Ď†ÎżĎÎ¬',
        'Launch times are being calculated ...':
            'ÎźÎą Ď‡ĎĎŚÎ˝ÎżÎą ÎµÎşÎşÎŻÎ˝Î·ĎÎ·Ď‚ Ď…Ď€ÎżÎ»ÎżÎłÎŻÎ¶ÎżÎ˝Ď„Î±Îą ...',
        'Missing user input!': 'Î›ÎµÎŻĎ€ÎżĎ…Î˝ Ď„Î± Î´ÎµÎ´ÎżÎĽÎ­Î˝Î±!',
        'Landing Time': 'ÎŹĎÎ± Î¬Ď†ÎąÎľÎ·Ď‚',
        'This village has no unit selected!':
            'Î¤Îż Ď‡Ď‰ĎÎąĎŚ Î´ÎµÎ˝ Î­Ď‡ÎµÎą ÎµĎ€ÎąÎ»ÎµÎłÎĽÎ­Î˝ÎµĎ‚ ÎĽÎżÎ˝Î¬Î´ÎµĎ‚!',
        'Prio.': 'Î ĎÎżĎ„.',
        'No possible combinations found!': 'No possible combinations found!',
        'Export Plan as BB Code': 'Î•ÎľÎ±ÎłĎ‰ÎłÎ® Ď€Î»Î¬Î˝ÎżĎ… ĎÎµ BB Code',
        'Plan for:': 'Î Î»Î¬Î˝Îż ÎłÎąÎ±:',
        'Landing Time:': 'ÎŹĎÎ± Î¬Ď†ÎąÎľÎ·Ď‚:',
        Unit: 'ÎśÎżÎ˝Î¬Î´Î±',
        'Launch Time': 'ÎŹĎÎ± ÎµÎşÎşÎŻÎ˝Î·ĎÎ·Ď‚',
        Command: 'Î•Î˝Ď„ÎżÎ»Î®',
        Status: 'ÎšÎ±Ď„Î¬ĎĎ„Î±ĎÎ·',
        Send: 'ÎŁĎ„ÎµÎŻÎ»Îµ',
        From: 'Î‘Ď€ĎŚ',
        Priority: 'Î ĎÎżĎ„ÎµĎÎ±ÎąĎŚĎ„Î·Ď„Î±',
        'Early send': 'ÎŁĎ„Î¬Î»Î¸Î·ÎşÎ±Î˝ Î˝Ď‰ĎÎŻĎ„ÎµĎÎ±',
        'Landing time was updated!': 'Î— ĎŽĎÎ± Î¬Ď†ÎąÎľÎ·Ď‚ Î±Î˝Î±Î˝ÎµĎŽÎ¸Î·ÎşÎµ!',
        'Error fetching village groups!':
            'ÎŁĎ†Î¬Î»ÎĽÎ± ÎşÎ±Ď„Î¬ Ď„Î·Î˝ Î±Î˝Î¬ÎşĎ„Î·ĎÎ· ÎżÎĽÎ¬Î´Ď‰Î˝ Ď‡Ď‰ĎÎąĎŽÎ˝!',
        'Dist.': 'Î‘Ď€ĎŚĎĎ„Î±ĎÎ·',
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
            'Questo script puĂ˛ essere lanciato solo dalla panoramica del villaggio!',
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
            'Questo villaggio non ha le unitĂ  selezionate!',
        'Prio.': 'Prio.',
        'No possible combinations found!': 'Nessuna combinazione possibile!',
        'Export Plan as BB Code': 'Esporta il plan in BB code',
        'Plan for:': 'Plan per:',
        'Landing Time': 'Tempo di arrivo:',
        Unit: 'UnitĂ ',
        'Launch Time': 'Tempo di lancio',
        Command: 'Comando',
        Status: 'Status',
        Send: 'Invia',
        From: 'Da',
        Priority: 'PrioritĂ ',
        'Early send': 'Anticipa invio',
        'Landing time was updated!': 'Il tempo di arrivo Ă¨ stato aggiornato!',
        'Error fetching village groups!': 'Errore nel recupero gruppo!',
        Group: 'Gruppo',
        'Export Plan without tables': 'Export Plan without tables',
        'Chosen group was reset!': 'Chosen group was reset!',
        'Reset Chosen Group': 'Reset Chosen Group',
        'Script configuration was reset!': 'Script configuration was reset!',
    },
    tr_TR: {
        'Single Village Planner': 'Tek KĂ¶y PlanlayÄ±cÄ±sÄ±',
        Help: 'YardÄ±m',
        'This script can only be run on a single village screen!':
            'Bu komut dosyasÄ± yalnÄ±zca tek bir kĂ¶y ekranÄ±nda Ă§alÄ±ĹźtÄ±rÄ±labilir',
        Village: 'KĂ¶y',
        Coords: 'Koordinat',
        Continent: 'KÄ±ta',
        'Calculate Launch Times': 'BaĹźlatma SĂĽrelerini HesaplayÄ±n',
        Reset: 'Reset',
        'Launch times are being calculated ...':
            'BaĹźlatma sĂĽreleri hesaplanÄ±yor ...',
        'Missing user input!': 'Eksik kullanÄ±cÄ± giriĹźi!',
        'Landing Time': 'iniĹź zamanÄ±',
        'This village has no unit selected!': 'Bu kĂ¶yde seĂ§ili birim yok!',
        'Prio.': 'Prio.',
        'No possible combinations found!': 'OlasÄ± kombinasyon bulunamadÄ±!',
        'Export Plan as BB Code': 'PlanÄ± BB Kodu Olarak DÄ±Ĺźa Aktar',
        'Plan for:': 'Plan iĂ§in:',
        'Landing Time': 'Ä°niĹź zamanÄ±:',
        Unit: 'Birim',
        'Launch Time': 'BaĹźlatma ZamanÄ±:',
        Command: 'Komut',
        Status: 'Durum',
        Send: 'GĂ¶nder',
        From: 'Z',
        Priority: 'Ă–ncelik',
        'Early send': 'erken gĂ¶nder',
        'Landing time was updated!': 'Ä°niĹź zamanÄ± gĂĽncellendi!',
        'Error fetching village groups!':
            'KĂ¶y gruplarÄ± getirilirken hata oluĹźtu',
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
        'Single Village Planner': 'Planeador para ataques em uma sĂł aldeia',
        Help: 'Ajuda',
        'This script can only be run on a single village screen!':
            'Este script sĂł pode ser usado na pĂˇgina de uma sĂł aldeia!',
        Village: 'Aldeia',
        Coords: 'Coords',
        Continent: 'Continente',
        'Calculate Launch Times': 'Calcular tempos de envio',
        Reset: 'Reset',
        'Launch times are being calculated ...':
            'Os tempos de envio estĂŁo a ser calculados ...',
        'Missing user input!': 'Falta o input do utilizador!',
        'Landing Time': 'Tempo de chegada',
        'This village has no unit selected!':
            'Esta aldeia nĂŁo tem unidades selecionadas!',
        'Prio.': 'Prioridade',
        'No possible combinations found!':
            'NĂŁo foram encontradas combinaĂ§Ăµes possĂ­veis!',
        'Export Plan as BB Code': 'Exportar plano em cĂłdigo BB',
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
            "Ce script doit ĂŞtre lancĂ© depuis la vu d'un village!",
        Village: 'Village',
        'Calculate Launch Times': "Calcul heure d'envoi",
        Reset: 'RĂ©initialiser',
        'Launch times are being calculated ...':
            "Heures d'envoi en cours de calcul ...",
        'Missing user input!': 'Aucun joueur renseignĂ©!',
        'Landing Time': "Heure d'arrivĂ©",
        'This village has no unit selected!':
            "Ce village n'a aucune unitĂ© sĂ©lectionnĂ©e!",
        'Prio.': 'Prio.',
        'No possible combinations found!': 'Aucune combinaison possible!',
        'Export Plan as BB Code': "Exporter le plan d'attaque en bb-code",
        'Plan for:': 'Plan pour:',
        'Landing Time:': "Heure d'arrivĂ©:",
        Unit: 'UnitĂ©',
        'Launch Time': "Heure d'envoi",
        Command: 'Ordre',
        Status: 'Status',
        Send: 'Envoyer',
        From: 'Origine',
        Priority: 'PrioritĂ©',
        'Early send': 'Envoi tĂ´t',
        'Landing time was updated!': "Heure d'arrivĂ© mis Ă  jour!",
        'Error fetching village groups!':
            'Erreur lors de la rĂ©cupĂ©ration des groupes de villages!',
        'Dist.': 'Dist.',
        'Villages list could not be fetched!':
            'Impossible de rĂ©cupĂ©rer la liste des villages!',
        Group: 'Groupe',
        'Export Plan without tables': 'Exporter le plan sans tableau',
        'Chosen group was reset!': 'Groupe sĂ©lectionnĂ© rĂ©initialisĂ©!',
        'Reset Chosen Group': 'RĂ©initialiser groupe(s) sĂ©lectionnĂ©e(s)',
        'Script configuration was reset!': 'Configuration rĂ©initialisĂ©e!',
    },
};

// Init Debug
initDebug();

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

// Initialize Attack Planner
async function initAttackPlanner(groupId) {
    const groups = await fetchVillageGroups();
    troopCounts = await fetchTroopsForCurrentGroup(groupId);
    let villages = await fetchAllPlayerVillagesByGroup(groupId);

    const destinationVillage = getDestinationVillageCoords();

    villages = villages.map((item) => {
        const distance = calculateDistance(item.coords, destinationVillage);
        return {
            ...item,
            distance: parseFloat(distance.toFixed(2)),
        };
    });

    villages = villages.sort((a, b) => {
        return a.distance - b.distance;
    });

    const content = prepareContent(villages, groups);
    renderUI(content);

    setTimeout(function () {
        const today = new Date().toLocaleString('en-GB').replace(',', '');
        jQuery('#raLandingTime').val(today);

        if (!game_data.units.includes('archer')) {
            jQuery('.archer-world').hide();
        }

        if (!game_data.units.includes('knight')) {
            jQuery('.paladin-world').hide();
        }
    }, 100);

    jQuery('html,body').animate(
        { scrollTop: jQuery('#raSingleVillagePlanner').offset().top - 8 },
        'slow'
    );

    choseUnit();
    changeVillagePriority();
    calculateLaunchTimes();
    resetAll();
    fillLandingTimeFromCommand();
    filterVillagesByChosenGroup();
    setAllUnits();
    resetGroup();
}

// Helper: Prepare UI
function prepareContent(villages, groups) {
    const villagesTable = renderVillagesTable(villages);
    const groupsFilter = renderGroupsFilter(groups);

    return `
		<div class="ra-mb15">
			<div class="ra-grid">
				<div>
					<label for="raLandingTime">
						${tt('Landing Time')} (dd/mm/yyyy HH:mm:ss)
					</label>
					<input id="raLandingTime" type="text" value="" />
				</div>
				<div>
					<label>${tt('Group')}</label>
					${groupsFilter}
				</div>
			</div>
		</div>
		<div class="ra-mb15">
			${villagesTable}
		</div>
		<div class="ra-mb15">
			<a href="javascript:void(0);" id="calculateLaunchTimes" class="btn btn-confirm-yes">
				${tt('Calculate Launch Times')}
			</a>
			<a href="javascript:void(0);" id="resetAll" class="btn btn-confirm-no">
				${tt('Reset')}
			</a>
			<a href="javascript:void(0);" id="resetGroupBtn" class="btn">
				${tt('Reset Chosen Group')}
			</a>
		</div>
		<div style="display:none;" class="ra-mb-15" id="raVillagePlanner">
			<div class="ra-mb15">
				<label for="raExportPlanBBCode">${tt('Export Plan as BB Code')}</label>
				<textarea id="raExportPlanBBCode" readonly></textarea>
			</div>
			<div>
				<label for="raExportPlanCode">${tt('Export Plan without tables')}</label>
				<textarea id="raExportPlanCode" readonly></textarea>
			</div>
		</div>
	`;
}

// Render UI
function renderUI(body) {
    const content = `
        <div class="ra-single-village-planner" id="raSingleVillagePlanner">
            <h2>${tt(scriptData.name)}</h2>
            <div class="ra-single-village-planner-data">
                ${body}
            </div>
            <br>
            <small>
                <strong>
                    ${tt(scriptData.name)} ${scriptData.version}
                </strong> -
                <a href="${
                    scriptData.authorUrl
                }" target="_blank" rel="noreferrer noopener">
                    ${scriptData.author}
                </a> -
                <a href="${
                    scriptData.helpLink
                }" target="_blank" rel="noreferrer noopener">
                    ${tt('Help')}
                </a>
            </small>
        </div>
        <style>
            .ra-single-village-planner { position: relative; display: block; width: auto; height: auto; clear: both; margin: 0 auto 15px; padding: 10px; border: 1px solid #603000; box-sizing: border-box; background-color: #f4e4bc; }
			.ra-single-village-planner * { box-sizing: border-box; }
			.ra-single-village-planner input[type="text"] { width: 100%; padding: 5px 10px; border: 1px solid #000; font-size: 16px; line-height: 1; }
			.ra-single-village-planner label { font-weight: 600 !important; margin-bottom: 5px; display: block; }
			.ra-single-village-planner select { width: 100%; padding: 5px 10px; border: 1px solid #000; font-size: 16px; line-height: 1; }
			.ra-single-village-planner textarea { width: 100%; height: 100px; resize: none; padding: 5px 10px; }
			.ra-single-village-planner .ra-grid { display: grid; grid-template-columns: 1fr 150px; grid-gap: 0 20px; }
			.ra-table { border-collapse: separate !important; border-spacing: 2px !important; }
			.ra-table tbody tr:hover td { background-color: #ffdd30 !important; }
			.ra-table tbody tr.ra-selected-village td { background-color: #ffe563 !important; }
			.ra-table th { font-size: 14px; }
			.ra-table th,
            .ra-table td { padding: 4px; text-align: center; }
            .ra-table td a { word-break: break-all; }
			.ra-table tr:nth-of-type(2n+1) td { background-color: #fff5da; }
			.ra-table td img { padding: 2px; border: 2px solid transparent; cursor: pointer; }
			.ra-table td img.ra-selected-unit { border: 2px solid #ff0000; }
			.ra-table a:focus { color: blue; }
			.ra-table th .icon { transform: scale(1.05); margin: 0; }
			.ra-table th img { cursor: pointer; }
			.ra-table th.ra-unit-toggle:hover { background-color: rgba(97, 48, 0, 0.6) !important; background-image: none !important; cursor: pointer !important; }
			.ra-table td .icon { filter: grayscale(100%); transform: scale(1.05); margin: 0; cursor: pointer; }
			.ra-table td .icon.ra-priority-village { filter: none !important; }
			.ra-table td span { transform: translateY(-6px); position: relative; display: inline-block; }
			.ra-chosen-command td { background-color: #ffe563; }
			.ra-groups-filter { display: inline-block; margin: 0; padding: 0; text-align: center; }
			.ra-groups-filter li { display: inline-block; list-style-type: none; margin: 0 10px; }
			.ra-groups-filter li:first-child { margin-left: 0; }
			.ra-groups-filter li:last-child { margin-right: 0; }
			.ra-selected-group { color: #21881e; }

			.ra-single-village-planner .btn { padding: 3px 4px; }

			/* Helper Classes */
			.ra-fw600 { font-weight: 600; }
			.ra-mb15 { margin-bottom: 15px; }
			.ra-dblock { display: block; }
			.ra-dflex { display: flex; }
			.ra-text-left { text-align: left !important; }
        </style>
    `;

    if (jQuery('.ra-single-village-planner').length < 1) {
        jQuery('#contentContainer').prepend(content);
    } else {
        jQuery('.ra-single-village-planner-data').html(body);
    }
}

// Action Handler: Here is the logic to collect units
function choseUnit() {
    jQuery('.ra-table td img').on('click', function () {
        jQuery(this)
            .parent()
            .parent()
            .find('img')
            .not(this)
            .removeClass('ra-selected-unit');
        jQuery(this).toggleClass('ra-selected-unit');

        jQuery('#raAttackPlannerTable tbody tr').each(function () {
            const isAnyUnitSelected = jQuery(this).find(
                'img.ra-selected-unit'
            )[0];
            if (isAnyUnitSelected) {
                jQuery(this).addClass('ra-selected-village');
            } else {
                jQuery(this)
                    .find('td .icon')
                    .removeClass('ra-priority-village');
                jQuery(this).removeClass('ra-selected-village');
            }
        });
    });
}

// Action Handler: Change the village send priority
function changeVillagePriority() {
    jQuery('#raAttackPlannerTable tbody td .icon').on('click', function () {
        const isUnitSelectedForVillage = jQuery(this)
            .parent()
            .parent()
            .find('.ra-selected-unit')[0];
        if (isUnitSelectedForVillage) {
            jQuery(this).toggleClass('ra-priority-village');
        } else {
            UI.ErrorMessage(tt('This village has no unit selected!'));
        }
    });
}

// Action Handler: Grab the "chosen" villages and calculate their launch times based on the unit type
function calculateLaunchTimes() {
    jQuery('#calculateLaunchTimes').off('click');
    jQuery(document).off('click.raSVP', '#calculateLaunchTimes');

    jQuery(document).on('click.raSVP', '#calculateLaunchTimes', function (e) {
        e.preventDefault();

        const landingTimeString = jQuery('#raLandingTime').val().trim();
        const destinationVillage = getDestinationVillageCoords();

        if (!destinationVillage) {
            UI.ErrorMessage(tt('Missing user input!'));
            return;
        }

        let villagesUnitsToSend = [];

        jQuery('#raAttackPlannerTable .ra-selected-unit').each(function () {
            const id = parseInt(jQuery(this).attr('data-village-id'));
            const unit = jQuery(this).attr('data-unit-type');
            const coords = jQuery(this).attr('data-village-coords');
            const isPrioVillage = jQuery(this)
                .parent()
                .parent()
                .find('td .ra-priority-village')[0]
                ? true
                : false;

            const distance = calculateDistance(coords, destinationVillage);

            villagesUnitsToSend.push({
                id,
                unit,
                coords,
                highPrio: isPrioVillage,
                distance,
            });
        });

        if (villagesUnitsToSend.length > 0 && landingTimeString !== '') {
            UI.SuccessMessage(tt('Launch times are being calculated ...'));
            const landingTime = getLandingTime(landingTimeString);
            const plans = getPlans(
                landingTime,
                destinationVillage,
                villagesUnitsToSend
            );

            if (plans.length > 0) {
                const planBBCode = getBBCodePlans(plans, destinationVillage);
                const plansCode = getCodePlans(plans, destinationVillage);
                jQuery('#raVillagePlanner').show();
                jQuery('#raExportPlanBBCode').val(planBBCode);
                jQuery('#raExportPlanCode').val(plansCode);
            } else {
                UI.ErrorMessage(tt('No possible combinations found!'));
                jQuery('#raVillagePlanner').hide();
                jQuery('#raExportPlanBBCode').val('');
                jQuery('#raExportPlanCode').val('');
            }
        } else {
            UI.ErrorMessage(tt('Missing user input!'));
        }
    });
}

// Action Handler: Reset all user input
function resetAll() {
    jQuery('#resetAll').on('click', function (e) {
        e.preventDefault();
        initAttackPlanner(GROUP_ID);
    });
}

// Action Handler: When a command is clicked fill landing time with the landing time of the command
function fillLandingTimeFromCommand() {
    jQuery(
        '#commands_outgoings table tbody tr.command-row, #commands_incomings table tbody tr.command-row'
    ).on('click', function () {
        jQuery('#commands_outgoings table tbody tr.command-row').removeClass(
            'ra-chosen-command'
        );
        jQuery(this).addClass('ra-chosen-command');

        const commandLandingTime =
            parseInt(jQuery(this).find('td:eq(2) span').attr('data-endtime')) *
            1000;

        const landingTimeDateTime = new Date(commandLandingTime);
        const serverDateTime = getServerTime();
        const localDateTime = new Date();

        const diffTime = Math.abs(localDateTime - serverDateTime);
        const newLandingTime = Math.ceil(
            Math.abs(landingTimeDateTime - diffTime)
        );
        const newLandingTimeObj = new Date(newLandingTime);
        const formattedNewLandingTime = formatDateTime(newLandingTimeObj);

        jQuery('#raLandingTime').val(formattedNewLandingTime);
        UI.SuccessMessage(tt('Landing time was updated!'));
    });
}

// Action Handler: Filter villages shown by selected group
function filterVillagesByChosenGroup() {
    jQuery('#raGroupsFilter').on('change', function (e) {
        e.preventDefault();
        initAttackPlanner(e.target.value);
        localStorage.setItem(`${LS_PREFIX}_chosen_group`, e.target.value);
    });
}

// Action Handler: Reset chosen group
function resetGroup() {
    jQuery('#resetGroupBtn').on('click', function (e) {
        e.preventDefault();
        localStorage.removeItem(`${LS_PREFIX}_chosen_group`);
        UI.SuccessMessage(tt('Chosen group was reset!'));
        initAttackPlanner(0);
    });
}

// Action Handler: Set all villages to unit
function setAllUnits() {
    jQuery('#raAttackPlannerTable thead tr th.ra-unit-toggle').on(
        'click',
        function () {
            const chosenUnit = jQuery(this).find('img').attr('data-set-unit');
            jQuery('#raAttackPlannerTable tbody tr').each(function () {
                jQuery(this)
                    .find(`img[data-unit-type="${chosenUnit}"`)
                    .trigger('click');
            });
        }
    );
}

// Prepare plans based on user input
function getPlans(landingTime, destinationVillage, villagesUnitsToSend) {
    let plans = [];

    villagesUnitsToSend.forEach((item) => {
        const launchTime = getLaunchTime(item.unit, landingTime, item.distance);
        const plan = {
            destination: destinationVillage,
            landingTime: landingTime,
            distance: item.distance,
            unit: item.unit,
            highPrio: item.highPrio,
            villageId: item.id,
            launchTime: launchTime,
            coords: item.coords,
            launchTimeFormatted: formatDateTime(launchTime),
        };
        plans.push(plan);
    });

    plans.sort((a, b) => {
        return a.launchTime - b.launchTime;
    });

    const filteredPlans = plans.filter((item) => {
        return item.launchTime >= getServerTime().getTime();
    });

    return filteredPlans;
}

// Export plan as BB Code
function getBBCodePlans(plans, destinationVillage) {
    const landingTime = jQuery('#raLandingTime').val().trim();

    let bbCode = `[size=12][b]${tt(
        'Plan for:'
    )}[/b] ${destinationVillage}\n[b]${tt(
        'Landing Time:'
    )}[/b] ${landingTime}[/size]\n\n`;
    bbCode += `[table][**]${tt('Unit')}[||]${tt('From')}[||]${tt(
        'Priority'
    )}[||]${tt('Launch Time')}[||]${tt('Command')}[||]${tt('Status')}[/**]\n`;

    plans.forEach((plan) => {
        const { unit, highPrio, coords, villageId, launchTimeFormatted } = plan;

        const [toX, toY] = destinationVillage.split('|');

        const priority = highPrio ? tt('Early send') : '';

        let rallyPointData =
            game_data.market !== 'uk' ? `&x=${toX}&y=${toY}` : '';
        let sitterData =
            game_data.player.sitter > 0 ? `t=${game_data.player.id}` : '';

        let commandUrl = `/game.php?${sitterData}&village=${villageId}&screen=place${rallyPointData}`;

        bbCode += `[*][unit]${unit}[/unit][|] ${coords} [|][b][color=#ff0000]${priority}[/color][/b][|]${launchTimeFormatted}[|][url=${
            window.location.origin
        }${commandUrl}]${tt('Send')}[/url][|]\n`;
    });

    bbCode += `[/table]`;
    return bbCode;
}

// Export plans without table
function getCodePlans(plans, destinationVillage) {
    const landingTime = jQuery('#raLandingTime').val().trim();

    let planCode = `[size=12][b]${tt(
        'Plan for:'
    )}[/b] ${destinationVillage}\n[b]${tt(
        'Landing Time:'
    )}[/b] ${landingTime}[/size]\n\n`;

    plans.forEach((plan) => {
        const { unit, highPrio, coords, villageId, launchTimeFormatted } = plan;

        const [toX, toY] = destinationVillage.split('|');

        const priority = highPrio ? tt('Early send') : '';

        let rallyPointData =
            game_data.market !== 'uk' ? `&x=${toX}&y=${toY}` : '';
        let sitterData =
            game_data.player.sitter > 0 ? `t=${game_data.player.id}` : '';

        let commandUrl = `/game.php?${sitterData}&village=${villageId}&screen=place${rallyPointData}`;

        planCode += `[unit]${unit}[/unit] ${coords} [b][color=#ff0000]${priority}[/color][/b]${launchTimeFormatted}[url=${
            window.location.origin
        }${commandUrl}]${tt('Send')}[/url]\n`;
    });

    return planCode;
}

// Helper: Calculate distance between 2 villages
function calculateDistance(villageA, villageB) {
    const x1 = villageA.split('|')[0];
    const y1 = villageA.split('|')[1];

    const x2 = villageB.split('|')[0];
    const y2 = villageB.split('|')[1];

    const deltaX = Math.abs(x1 - x2);
    const deltaY = Math.abs(y1 - y2);

    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

    return distance;
}

// Helper: Get launch time of command
function getLaunchTime(unit, landingTime, distance) {
    const msPerSec = 1000;
    const secsPerMin = 60;
    const msPerMin = msPerSec * secsPerMin;

    const unitSpeed = unitInfo.config[unit].speed;
    const unitTime = distance * unitSpeed * msPerMin;

    const launchTime = new Date();
    launchTime.setTime(
        Math.round((landingTime - unitTime) / msPerSec) * msPerSec
    );

    return launchTime.getTime();
}

// Helper: Get server time
function getServerTime() {
    const serverTime = jQuery('#serverTime').text();
    const serverDate = jQuery('#serverDate').text();

    const [day, month, year] = serverDate.split('/');
    const serverTimeFormatted =
        year + '-' + month + '-' + day + ' ' + serverTime;
    const serverTimeObject = new Date(serverTimeFormatted);

    return serverTimeObject;
}

// Helper: Format date
function formatDateTime(date) {
    let currentDateTime = new Date(date);

    var currentYear = currentDateTime.getFullYear();
    var currentMonth = currentDateTime.getMonth();
    var currentDate = currentDateTime.getDate();
    var currentHours = '' + currentDateTime.getHours();
    var currentMinutes = '' + currentDateTime.getMinutes();
    var currentSeconds = '' + currentDateTime.getSeconds();

    currentMonth = currentMonth + 1;
    currentMonth = '' + currentMonth;
    currentMonth = currentMonth.padStart(2, '0');

    currentHours = currentHours.padStart(2, '0');
    currentMinutes = currentMinutes.padStart(2, '0');
    currentSeconds = currentSeconds.padStart(2, '0');

    let formatted_date =
        currentDate +
        '/' +
        currentMonth +
        '/' +
        currentYear +
        ' ' +
        currentHours +
        ':' +
        currentMinutes +
        ':' +
        currentSeconds;

    return formatted_date;
}

// Helper: Get landing time date object
function getLandingTime(landingTime) {
    const [landingDay, landingHour] = landingTime.split(' ');
    const [day, month, year] = landingDay.split('/');
    const landingTimeFormatted =
        year + '-' + month + '-' + day + ' ' + landingHour;
    const landingTimeObject = new Date(landingTimeFormatted);
    return landingTimeObject;
}

// Helper: Get parameter by name
function getParameterByName(name, url = window.location.href) {
    return new URL(url).searchParams.get(name);
}

// Helper: Get destination coords from hash or page text
function getDestinationVillageCoords() {
    const hash = window.location.hash.replace('#', '').trim();
    if (hash && hash.includes(';')) {
        return hash.replace(';', '|');
    }
    if (hash && hash.includes('|')) {
        return hash;
    }

    const match = jQuery('#content_value')
        .text()
        .match(/(\d{3}\|\d{3})/);

    return match ? match[1] : '';
}

window.getDestinationVillageCoords = getDestinationVillageCoords;

// Helper: Generates script info
function scriptInfo() {
    return `[${scriptData.name} ${scriptData.version}]`;
}

// Helper: Prints universal debug information
function initDebug() {
    console.debug(`${scriptInfo()} It works 🚀!`);
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

// Helper: Text Translator
function tt(string) {
    var gameLocale = game_data.locale;

    if (translations[gameLocale] !== undefined) {
        return translations[gameLocale][string];
    } else {
        return translations['en_DK'][string];
    }
}

// Initialize Script
(async function () {
    const gameScreen = getParameterByName('screen');
    if (gameScreen === 'info_village') {
        initAttackPlanner(GROUP_ID);
    } else {
        UI.ErrorMessage(
            tt('This script can only be run on a single village screen!')
        );
    }
})();
