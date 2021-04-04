let currentSettingsPanel;

function setupSettingsTabs() {
    Array.from(document.getElementsByClassName('settingsTab')).map((val) => {
        if(val.hasAttribute('rSc')) {
            val.onclick = () => {
                settingsNavItemListener(val);
            }
        }
    })
}

function settingsNavItemListener(ele) {
    var navItems = $(".selected");
    if(navItems.hasClass('settingsTab')) {
        navItems.removeClass("selected");
        navItems.attr("disabled", false);
    }

    let oldPanel = currentSettingsPanel;
    ele.className += ' selected';
    ele.disabled = true;
    currentSettingsPanel = '#' + ele.getAttribute('rSc');

    $(oldPanel).hide();
    $(currentSettingsPanel).fadeIn(250);
}

function initSettings(tab = '#settings-version-launcher-panel') {
    initSettingsLauncherVersionTab();

    var navItems = $(".selected");
    if(navItems.hasClass('settingsTab')) {
        navItems.removeClass("selected");
        navItems.attr("disabled", false);
    }

    if(currentSettingsPanel != null) {
        $(currentSettingsPanel).hide();
    }

    $('#' + tab).fadeIn(250);
    currentSettingsPanel = '#' + tab;
    $('#' + tab + '-button').addClass('selected').prop("disabled", true);
}

setupSettingsTabs();

/**
 * Saves
 */
 $("#settings-save-button").click(function() {
    switchView(getCurrentView(), VIEWS.launcher);
});

document.addEventListener('keydown', (e) => {
    if(getCurrentView() === VIEWS.settings) {
        if(e.key === 'Escape') {
            switchView(getCurrentView(), VIEWS.launcher);
        }
    }
});
