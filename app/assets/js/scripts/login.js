let currentLoginPanel;

const LOGIN_PANELS = {
    loginmicrosoft: '#login-view-microsoft',
    loginmojang: '#login-view-mojang'
}

function switchLoginPanel(current, next) {
    loginmicrosoft = next;
    $(`${current}`).hide();
    $(`${next}`).fadeIn(500);
}

function initLoginView() {
    currentLoginPanel = VIEWS.login;
    $(VIEWS.login).fadeIn(1000);
    
    initLoginPanel();
}

function initLoginPanel() {
    switchView(getCurrentView(), VIEWS.login);
}