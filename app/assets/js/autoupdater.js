const fs = require('fs');
const axios = require('axios');

const electron = require('electron');
const {ipcRenderer} = require('electron');

const os = require('os');

VersionLauncher = "0.0.6";

console.log("Actuel Version : " + VersionLauncher);

function quitApp() {
    ipcRenderer.send("quit", {});
}

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
            if(VersionLauncherMin > VersionLauncher){
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
                console.log("New Version Update !");
            }else{
                setOverlayContent('Launcher Obselète !',
                "Le Launcher est Obselète merci de le retélécharge sur le site Officiel d'uranium !",
                'Fermer Le Launcher', 'Télécharger');
                toggleOverlay(true);
                setCloseHandler(() => {
                    closeLauncher();
                });
                setActionHandler(() => {
                    
                });
                console.log("Launcher is obselète");
            }
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
    console.log("Téléchargement en Préparations");
    setGameUpdateOverlayDownloadProgress(35, 'green');
    setGameUpdateOverlayDownload("Téléchargement de la mise a jour..(" + VersionLauncherMin + ")");
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
    console.log("Téléchargement à Commencer");
    ipcRenderer.send("download", {
        url: "https://github.com/Nokaji/UraniumLauncher/releases/download/" + VersionLauncherMin +"/" + VersionLauncherMin + fileexe,
        properties: {directory: electron.remote.app.getPath("temp")}
    });
    downloadComplete();
}

function downloadComplete(){

    ipcRenderer.on("download complete", (event, file) => {
        console.log("Téléchargement complété !");
        function executeFile(file) {
            
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

        console.log("Downloaded " + file);
        setGameUpdateOverlayDownloadProgress(85, 'green');
        setGameUpdateOverlayDownload("Téléchargement Complété, Installation de la mise a jour");
        
        executeFile(file);
        console.log("Fichier Lancée");
        setGameUpdateOverlayDownloadProgress(100, 'green');
        toggleGameUpdateOverlay(false);
        setOverlayContent('Redémarrage !',
        'Voulez vous Fermer le laucher ou le redémarrer ?',
        'Fermer', 'Redémarrer');
        setCloseHandler(() => {
            quitApp();
        });
        setActionHandler(() => {
            relaunchapp();
        });
        console.log("New Version Update !");
        toggleOverlay(true);
    });
}
