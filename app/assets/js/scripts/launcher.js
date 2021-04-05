let currentLauncherPanel;

const LAUNCHER_PANELS = {
    home: '#launcher-home-panel',
    beta: '#launcher-betalauncher-panel'
}

function switchLauncherPanel(current, next) {
    currentLauncherPanel = next;
    $(`${current}`).hide();
    $(`${next}`).fadeIn(500);
}

function initLauncherView() {
    currentLauncherPanel = LAUNCHER_PANELS.home;
    $(LAUNCHER_PANELS.home).fadeIn(1000);
    initLauncherHomePanel();
}

// Header Functions
// #region

$("#launcher-nav-home-button").click(function() {
    var element = $(this);
    if(!element.hasClass('active')) {
        switchLauncherPanel(currentLauncherPanel, LAUNCHER_PANELS.home);
        initLauncherHomePanel();
    }
});

$("#launcher-nav-beta-button").click(function() {
    var element = $(this);
    if(!element.hasClass('active')) {
        switchLauncherPanel(currentLauncherPanel, LAUNCHER_PANELS.beta);
    }
});

$(".nav-left > a").on("click", function() {
    var element = $(this);

    $(".nav-left .active").removeClass("active");
    $(".nav-right .active").removeClass("active");
    element.addClass("active");
});

$(".nav-right > a").on("click", function() {
    var element = $(this);

    $(".nav-left .active").removeClass("active");
    $(".nav-right .active").removeClass("active");
    element.addClass("active");
});