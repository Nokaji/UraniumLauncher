$("#login-view-microsoft-button").click(function() {
    var element = $(this);
    if(!element.hasClass('active')) {
        showMainUI(VIEWS.loginmicrosoft);
    }
});
$("#login-view-mojang-button").click(function() {
    var element = $(this);
    if(!element.hasClass('active')) {
        showMainUI(VIEWS.loginmojang);
    }
});