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

document.addEventListener('keydown', (e) => {
    if(getCurrentView() === VIEWS.loginmojang) {
        if(e.key === 'Escape') {
            switchView(getCurrentView(), VIEWS.launcher);
        }
    }
    if(getCurrentView() === VIEWS.loginmicrosoft){
        if(e.key === 'Escape') {
            switchView(getCurrentView(), VIEWS.launcher);
        }
    }
    if(getCurrentView() === VIEWS.login){
        if(e.key === 'Escape') {
            switchView(getCurrentView(), VIEWS.launcher);
        }
    }
});
