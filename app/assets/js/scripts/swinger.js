const $ = require('jquery');
const {remote, shell, webFrame, app} = require('electron');

const LoggerUtil = require('./assets/js/loggerutil');
const request = require('request');
const cp = require('child_process');
const path = require('path');

const isDev = require('./assets/js/isdev');

const loggerSwinger = LoggerUtil('%c[Swinger]', 'color: #000668; font-weight: bold');
const loggerLauncher = LoggerUtil('%c[Launcher]', 'color: #000668; font-weight: bold');
const loggerAutoUpdater = LoggerUtil('%c[AutoUpdater]', 'color: #209b07; font-weight: bold');

process.traceProcessWarnings = true;
process.traceDeprecation = true;

loggerLauncher.log("Chargement des variables");

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
        initLauncherHomePanel();
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

    setTimeout(function() {
        hideLoading();
    }, 7500);
    initLauncher();
}

function hideLoading() {
    $('#loading-view').fadeOut(500);
}