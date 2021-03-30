let currentLoginPanel;

const LOGIN_PANELS = {
    loginmicrosoft: '#login-view-microsoft',
    loginmojang: '#login-view-mojang',
    login: '#login-view'
}

function switchLoginPanel(current, next) {
    loginmicrosoft = next;
    $(`${current}`).hide();
    $(`${next}`).fadeIn(500);
}

function initLoginView() {
    currentLoginPanel = LAUNCHER_PANELS.loginmicrosoft;
    $(LOGIN_PANELS.loginmicrosoft).fadeIn(1000);
    
    initLoginPanel();
}

function initLoginPanel() {
    showMainUI(VIEWS.login);
    switchLoginPanel(LOGIN_PANELS.login);
}