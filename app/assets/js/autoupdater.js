const fs = require('fs');
const axios = require('axios');

const electron = require('electron');

const os = require('os');

VersionLauncher = "0.0.2";

console.log("Actuel Version : " + VersionLauncher);

function updaterVerify(){
    //Version Récente
    axios.get("https://beta-uranium.yvleis.fr/ressources/download/launcher/sources/distri.json")
    .then(response => {
        VersionLauncherMin = (response.data.launcher.version);
        var fileexe;
        if(process.platform === 'darwin') {
            fileexe = '.dmg';
        } 
        else if(process.platform === 'win32') {
            fileexe = '.exe';
        }
        else{
            fileexe = '';
        }
        console.log("https://github.com/Nokaji/UraniumLauncher/releases/download/" + VersionLauncherMin + "/" + VersionLauncherMin + fileexe)
        
        console.log("Récents version " + VersionLauncherMin);
        if(VersionLauncherMin == VersionLauncher){
            console.log("Le Launcher est à jour(Version : " + VersionLauncher + ")");
            setOverlayContent('Le Launcher est à jour(Version : '  + VersionLauncher + ")",
            "Le Launcher est à jour tu n'as pas besoins de télécharger la version",
            'Fermer', null);
            toggleOverlay(true);
            setCloseHandler(() => {
                toggleOverlay(false);
            })
        }else{
            setOverlayContent('Une nouvelle version du launcher est disponible !',
            'Télécharge la version du launcher pour pouvoir avoir la nouvelle version !',
            'Fermer', 'Télécharger');
            toggleOverlay(true);
            setCloseHandler(() => {
                toggleOverlay(false);
            });
            setActionHandler(() => {
                prepareUpdate();
            });
            console.log("New Version Update !")
        }
    });
}

function prepareUpdate(){
    console.log("Preparing update !")
    toggleOverlay(false);
    setGameUpdateOverlayDownloadProgress(0, 'green');
    setGameUpdateOverlayContent();
    toggleGameUpdateOverlay(true);
    setGameUpdateOverlayDownload("Préparation de la mise à jour");
    setTimeout(function() {
        downloadUpdate();
    }, 5000);

}

function downloadUpdate(){
    console.log("Téléchargement en Préparations")
    setGameUpdateOverlayDownloadProgress(35, 'green');
    setGameUpdateOverlayDownload("Téléchargement de la mise a jour..");
    var fileexe;
    if(process.platform === 'darwin') {
        fileexe = '.dmg';
    } 
    else if(process.platform === 'win32') {
        fileexe = '.exe';
    }
    else{
        fileexe = '';
    }
    console.log("Téléchargement à Commencer")
    ipcRenderer.send("download", {
        url: "https://github.com/Nokaji/UraniumLauncher/releases/download/" + VersionLauncherMin +"/" + VersionLauncherMin + fileexe,
        properties: {directory: electron.remote.app.getPath("temp")}
    });
    console.log("Télécharger complété !");
    downloadComplete();
}

function downloadComplete(){
    function executeFile() {
            
        var child = require('child_process').execFile;
        var executablePath = file;

        child(executablePath, function(err, data) {
        if(err){
            console.error(err);
            return;
        }
    
        console.log(data.toString());
        });
    }
    ipcRenderer.on("download complete", (event, file) => {
        console.log("Downloaded " + file);
        setGameUpdateOverlayDownloadProgress(85, 'green');
        setGameUpdateOverlayDownload("Téléchargement Complété, Installation de la mise a jour");

        executeFile();
        setGameUpdateOverlayDownloadProgress(100, 'green');
        setGameUpdateOverlayDownload("Redémarrage du launcher !");
        console.log("Redémarrage du launcher");
        setTimeout(closeLauncher, 5000);
    });
}