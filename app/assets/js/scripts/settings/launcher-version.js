function initSettingsLauncherVersionTab() {
    const selectedAcc = ConfigManager.getSelectedAccount();
    document.getElementById('version-launcher-value').innerHTML = VersionLauncher;
}