const $ = require('jquery');
const {remote, shell, webFrame, ipcRenderer} = require('electron');

const LoggerUtil = require('./assets/js/loggerutil');
const request = require('request');
const cp = require('child_process');
const path = require('path');

const isDev = require('./assets/js/isdev');

const loggerSwinger = LoggerUtil('%c[Swinger]', 'color: #000668; font-weight: bold');
const loggerLauncher = LoggerUtil('%c[Launcher]', 'color: #000668; font-weight: bold');
const loggerAutoUpdater = LoggerUtil('%c[AutoUpdater]', 'color: #209b07; font-weight: bold');

//Discord Rpc
//Client : 747895284616528003
const RPC = require('discord-rpc');
const rpc = new RPC.Client({
    transport: "ipc"
});

rpc.on("ready", () => {
    rpc.setActivity({
        details: "Uranium Launcher",
        state: "Rich Presence Test"
    });
});

rpc.login({
    clientId: "747895284616528003"
})
//End Discord Rpc

process.traceProcessWarnings = true;
process.traceDeprecation = true;

const launcherVersionJson = require('./assets/distri');

const launcherVersion = "0.0.01-01";

window.eval = global.eval = function () {
    throw new Error('Sorry, this app does not support window.eval().');
}

// Disable zoom, needed for darwin.
webFrame.setZoomLevel(0);
webFrame.setVisualZoomLevelLimits(1, 1);
webFrame.setLayoutZoomLevelLimits(0, 0);

$(function() {
    loggerSwinger.log("Swinger Initialized.");
    initSwinger();
})

function initSwinger() {
    loggerSwinger.log("Swiger Initializing.");
    frameEvent();
    bindRangeSlider();

    showLoading();
    setLoadingStatut("Chargement des éléments d'interface");
}

// Init Launcher Functions
// #region

document.addEventListener('readystatechange', function() {
    if(document.readyState === 'complete') {
        initLauncher();
    }
}, false);

function initLauncher() {
    if(navigator.onLine){
        updateRichPres();
        refreshServer();
        updaterVerify();
        showMainUI(VIEWS.launcher);
        initLauncherView();
    }else{
        setOverlayContent('Impossible de se connecter à Internet 🌐',
        '✋🏽Vérifiez votre connexion et votre proxy si vous en utilisez un.',
        'Fermer le launcher', null, 15, 'Tentative de reconnexion dans');
        toggleOverlay(true);
        setCloseHandler(() => {
            closeLauncher();
        });
        setTimeout(function() {
            toggleOverlay(false);
            initLauncher();
        }, 15000);
    }
}

function updaterVerify(){/*
    let forceUpdate = false;
    var versionMin = parseLauncherVersion();
    var version = parseLauncherVersion(launcherVersion);
    if((version.build < versionMin.build) || (version.update < versionMin.update) || (version.minor < versionMin.minor) || (version.major < versionMin.major)) {
        forceUpdate = true;
    }*/
    ipcRenderer.on('autoUpdateNotification', (event, arg, info) => {
        switch(arg) {
            case 'checking-for-update': {
                loggerAutoUpdater.log('Checking for update..');
                setLoadingStatut('Recherche de mise à jour');
                break;
            }
            case 'update-available': {
                loggerAutoUpdater.log('New update available:', info.version);

                if(!forceUpdate && process.platform == 'win32') { // Temp
                    setOverlayContent('Mise à jour du launcher disponible 😘',
                        'Une nouvelle mise à jour pour le launcher est disponible.' 
                        + '<br>Voulez-vous l\'installer maintenant ?',
                        'Plus tard', 'Télécharger');
                    toggleOverlay(true);
                    setCloseHandler(() => {
                        toggleOverlay(false);
                        onAutoUpdateFinish();
                    });
                    setActionHandler(() => {
                        toggleOverlay(false);
                        setLoadingStatut('Préparation de la mise à jour (peut prendre un moment)');
                        ipcRenderer.send('autoUpdateAction', 'downloadUpdate');
                    });
                }
                else {
                    if(process.platform == 'win32') { // Temp
                        setOverlayContent('Mise à jour du launcher disponible 😘',
                            'Une nouvelle mise à jour pour le launcher est disponible.' 
                            + '<br>Voulez-vous l\'installer maintenant ?'
                            + '<br><br><i class="fas fa-chevron-right"></i> Cette mise à niveau est obligatoire pour pouvoir continuer.',
                            'Fermer le launcher', 'Télécharger');
                        toggleOverlay(true);
                        setCloseHandler(() => {
                            toggleOverlay(false);
                            closeLauncher();
                        });
                        setActionHandler(() => {
                            toggleOverlay(false);
                            setLoadingStatut('Préparation de la mise à jour (peut prendre un moment)');
                            ipcRenderer.send('autoUpdateAction', 'downloadUpdate');
                        });
                    }
                    else {
                        setOverlayContent('Mise à jour du launcher disponible 😘',
                            'Une nouvelle mise à jour pour le launcher est disponible.' 
                            + '<br>Vous pouvez la télécharger sur le site officiel de Uranium.'
                            + '<br><br><i class="fas fa-chevron-right"></i> Cette mise à niveau est obligatoire pour pouvoir continuer.',
                            'Fermer le launcher');
                        toggleOverlay(true);
                        setCloseHandler(() => {
                            toggleOverlay(false);
                            closeLauncher();
                        });
                    }
                }
                break;
            }
            case 'update-not-available': {
                if((version.build < versionMin.build) || (version.update < versionMin.update) || (version.minor < versionMin.minor) || (version.major < versionMin.major)) {
                    setOverlayContent('Launcher obselète',
                            'Votre launcher est obselète !' 
                            + '<br><br><i class="fas fa-chevron-right"></i> Merci de retélécharger le launcher sur le site officiel de Uranium.',
                            'Fermer le launcher');
                        toggleOverlay(true);
                        setCloseHandler(() => {
                            closeLauncher();
                        });
                    return;
                }
                else {
                    onAutoUpdateFinish();
                }
                break;
            }
            case 'download-progress': {
                setLoadingStatut('Mise à jour en cours (' + Math.round(info.percent) + "%)");
                break;
            }
            case 'update-downloaded': {
                loggerAutoUpdater.log('Update ' + info.version + ' ready to be installed.');

                setOverlayContent('La mise à jour est prêt à être installé 😁',
                    'Cliquer sur installer pour lancer l\'installation de ma mise à jour du launcher.',
                    'Plus tard (Ferme le launcher)', 'Installer');
                toggleOverlay(true);
                setCloseHandler(() => {
                    closeLauncher();
                });
                setActionHandler(() => {
                    toggleOverlay(false);
                    ipcRenderer.send('autoUpdateAction', 'installUpdateNow');
                });
                break;
            }
            case 'ready': {
                ipcRenderer.send('autoUpdateAction', 'checkForUpdate');
                break;
            }
            case 'realerror': {
                if(info != null && info.code != null) {
                    if(info.code === 'ERR_UPDATER_INVALID_RELEASE_FEED') {
                        loggerAutoUpdater.log('No suitable releases found.');
                    } 
                    else if(info.code === 'ERR_XML_MISSED_ELEMENT') {
                        loggerAutoUpdater.log('No releases found.');
                    } 
                    else {
                        loggerAutoUpdater.error('Error during update check..', info);
                        loggerAutoUpdater.debug('Error Code:', info.code);
                    }

                    setOverlayContent('Impossible de se connecter à Internet 🌐',
                        '✋🏽Vérifiez votre connexion et votre proxy si vous en utilisez un.',
                        'Fermer le launcher', 'Réessayer');
                    toggleOverlay(true);
                    setCloseHandler(() => {
                        closeLauncher();
                    });
                    setActionHandler(() => {
                        toggleOverlay(false);
                        ipcRenderer.send('autoUpdateAction', 'initAutoUpdater');
                    });
                }
                break;
            }
            default: {
                loggerAutoUpdater.log('Unknown argument', arg);
                break;
            }
        }
    });
}

// #endregion

/**
 * Swinger 
 */

// #region

document.addEventListener('keydown', function (e) {
    if((e.key === 'I' || e.key === 'i') && e.ctrlKey && e.shiftKey) {
        let window = remote.getCurrentWindow();
        window.toggleDevTools({mode:'undocked'});
    }
    else if(isDev && ((e.key === 'R' || e.key === 'r') && e.ctrlKey && e.shiftKey)) {
        let window = remote.getCurrentWindow();
        window.reload();
    }
});

$(document).on('click', 'a[href^="http"]', function(event) {
    event.preventDefault();
    shell.openExternal(this.href);
});

function frameEvent() {
    $("#frame-button-close").click(function() {
        closeLauncher();
    });

    $("#frame-button-restoredown").click(function() {
        const window = remote.getCurrentWindow();
        if(window.isMaximized()) {
            window.unmaximize();
        } 
        else {
            window.maximize();
        }
        document.activeElement.blur();
    });

    $("#frame-button-minimize").click(function() {
        const window = remote.getCurrentWindow();
        window.minimize();
        document.activeElement.blur();
    });
}

function closeLauncher() {
    const window = remote.getCurrentWindow();
    window.close();
}

// Slider Functions
// #region

function bindRangeSlider() {
    Array.from(document.getElementsByClassName('range-slider')).map((v) => {
        const track = v.getElementsByClassName('range-slider-track')[0];

        const value = v.getAttribute('value');
        const sliderMeta = calculateRangeSliderMeta(v);

        updateRangedSlider(v, value, ((value-sliderMeta.min) / sliderMeta.step) * sliderMeta.inc);

        track.onmousedown = (e) => {
            document.onmouseup = (e) => {
                document.onmousemove = null;
                document.onmouseup = null;
            }

            document.onmousemove = (e) => {
                const diff = e.pageX - v.offsetLeft - track.offsetWidth / 2;
                if(diff >= 0 && diff <= v.offsetWidth-track.offsetWidth / 2) {
                    const perc = (diff / v.offsetWidth) * 100;
                    const notch = Number(perc / sliderMeta.inc).toFixed(0) * sliderMeta.inc
                    if(Math.abs(perc-notch) < sliderMeta.inc / 2) {
                        updateRangedSlider(v, sliderMeta.min + (sliderMeta.step * (notch / sliderMeta.inc)), notch);
                    }
                }
            }
        }
    });
}

function calculateRangeSliderMeta(v) {
    const val = {
        max: Number(v.getAttribute('max')),
        min: Number(v.getAttribute('min')),
        step: Number(v.getAttribute('step')),
    }
    val.ticks = (val.max-val.min) / val.step;
    val.inc = 100 / val.ticks;
    return val;
}

function updateRangedSlider(element, value, notch) {
    const oldVal = element.getAttribute('value');
    const bar = element.getElementsByClassName('range-slider-bar')[0];
    const track = element.getElementsByClassName('range-slider-track')[0];
    
    element.setAttribute('value', value);

    if(notch < 0) {
        notch = 0;
    } 
    else if(notch > 100) {
        notch = 100;
    }

    const event = new MouseEvent('change', {
        target: element,
        type: 'change',
        bubbles: false,
        cancelable: true
    });

    let cancelled = !element.dispatchEvent(event);
    if(!cancelled) {
        track.style.left = notch + '%';
        bar.style.width = notch + '%';
    }
    else {
        element.setAttribute('value', oldVal);
    }
}

function showLoading() {
    var splashes = [{text: "Chargement du launcher !"}, {text: "Chargement en cours"}, {text: "Uranium kiffe les chargements"}];

    var splashe_text = splashes[Math.floor(Math.random() * splashes.length)];
    $("#loading-splash-text").html(splashe_text.text);

    $('.uranium-loader').show();

    $('.square').each(function() {
        var color = $(this).attr('data-color');
        if(color != "none") {
            $(this).css('background-color', '#' + color);
        }
    });

    $('#loading-view').fadeIn(500);

    setTimeout(hideLoading(), 5000);
    initLauncher();
}

function hideLoading() {
    $('#loading-view').fadeOut(500);
}