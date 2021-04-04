function initSettingsLauncherVersionTab() {
    document.getElementById('version-launcher-value').innerHTML =  " " + VersionLauncher;
}

$("#actuel-version-launcher").click(function() {
    updaterVerify();
});