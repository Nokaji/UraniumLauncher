let currentSettingsPanel;

const LOGIN_PANELS = {
    home: '#launcher-home-panel',
    store: '#launcher-store-panel',
    betalauncher: '#launcher-betalauncher-panel',
    maintenance: '#launcher-maintenance-panel'
}

function switchSettingsPanel(current, next) {
    currentSettingsPanel = next;
    $(`${current}`).hide();
    $(`${next}`).fadeIn(500);
}

function initSettingsView() {
    currentSettingsPanel = VIEWS.settings;
    $(VIEWS.settings).fadeIn(1000);
    switchView(getCurrentView(), VIEWS.settings);
    initSettingsPanel();
}

function initSettingsPanel() {
    switchView(getCurrentView(), VIEWS.settings);
}
