function initSettingsLauncherVersionTab() {
    const selectedAcc = ConfigManager.getSelectedAccount();
    document.getElementById('version-launcher-value').innerHTML = VersionLauncher;
    updaterVerifyactual-version-launcher
}

$("#actuel-version-launcher").click(function() {
    updaterVerify();
});