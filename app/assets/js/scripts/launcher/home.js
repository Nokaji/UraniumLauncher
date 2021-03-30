const $launcherHomePlayButton = $('#launcher-home-play-button');

 $(".logo").click(function() {
    initLauncherHomePanel();
});

 function initLauncherHomePanel() {
     refreshServer();
 }
 
 $("#launcher-home-options-button").click(function() {
     switchView(getCurrentView(), VIEWS.settings);
     initSettings();
 });
 
 $launcherHomePlayButton.click(function() {
     gameUpdate();
 });
 
 document.addEventListener('keydown', (e) => {
     if(getCurrentView() === VIEWS.launcher && currentLauncherPanel === LAUNCHER_PANELS.home) {
         if(e.key === 'Enter' && $launcherHomePlayButton.attr("disabled") != "disabled") {
              gameUpdate();
         }
     }
 });
 
 function refreshServer() {
     var uranium_server = require("./../minecraftserver");
     uranium_server.init('uranium.yvleis.fr', 25565, function(result) {
         if(uranium_server.online) {
             $("#server-uranium-players").html(uranium_server.current_players);
             $("#server-uranium-latency").html(uranium_server.latency);
 
             $("#server-total-players").html(uranium_server.current_players + " <i class=\"online\"></i>");
         }
         else {
             $("#server-total-players").html("0 <i class=\"offline\"></i>");
         }
     });
 }