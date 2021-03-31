let currentLoginPanel;

function initLoginView() {
    currentLoginPanel = VIEWS.login;
    $(VIEWS.login).fadeIn(1000);
    
    initLoginPanel();
}

function initLoginPanel() {
    switchView(getCurrentView(), VIEWS.login);
}

$("#login-mojang").click(function() {
    switchView(getCurrentView(), VIEWS.loginmojang);
});

$("#login-microsoft").click(function() {
    switchView(getCurrentView(), VIEWS.loginmicrosoft);
});