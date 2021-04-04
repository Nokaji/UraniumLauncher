let currentView;

const VIEWS = {
    launcher: '#launcher-view',
    login: '#login-view',
    loginmicrosoft: '#login-view-microsoft',
    loginmojang: '#login-view-mojang',
    settings: '#settings-view'
}

function switchView(current, next, onNextFade = () => {}) {
    currentView = next;
    $(`${current}`).hide();
    
    $(`${next}`).fadeIn(500, () => {
        onNextFade();
    });
}

function getCurrentView() {
    return currentView;
}

function showMainUI(view) {
    setTimeout(() => {
        $('#main').show();

        currentView = view;
        $(view).fadeIn(1000);
    }, 750);
}