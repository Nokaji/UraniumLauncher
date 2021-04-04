const fs = require('fs');
const axios = require('axios');

const electron = require('electron');

const os = require('os');

var version = ("./app/assets/distri.json");

let rawdata = fs.readFileSync(version);
let versions = JSON.parse(rawdata);

VersionLauncher = (versions.launcher.version);

console.log("Actuel Version : " + VersionLauncher);

function updaterVerify(){
    //Version Récente
    axios.get("https://beta-uranium.yvleis.fr/ressources/download/launcher/sources/distri.json")
    .then(response => {
        VersionLauncherMin = (response.data.launcher.version);
        console.log("Récents version " + VersionLauncherMin);
        if(VersionLauncherMin == VersionLauncher){
            console.log("Le Launcher est à jour(Version : " + VersionLauncher + ")");
            setOverlayContent('Le Launcher est à jour(Version : '  + VersionLauncher + ")",
            "Le Launcher est à jour tu n'as pas besoins de télécharger la version",
            'Fermer', null, 20, 'Le Popup va se fermer dans');
            toggleOverlay(true);
            setCloseHandler(() => {
                toggleOverlay(false);
            });
            setTimeout(function() {
                toggleOverlay(false);
            }, 20000);
        }else{
            if(VersionLauncherMin != VersionLauncher){
                setOverlayContent('Une nouvelle version du launcher est disponible !',
                'Télécharge la version du launcher pour pouvoir avoir la nouvelle version !',
                'Fermer', 'Télécharger');
                toggleOverlay(true);
                setCloseHandler(() => {
                    toggleOverlay(false);
                });
                setActionHandler(() => {
                    downloadUpdate();
                });
            }
        }
    });
}

function downloadUpdate(){
    setOverlayContent('Téléchargement en Préparation !',
    'La nouvelle version du launcher est en cours de téléchargement, ne ferme pas le launcher si tu veux la nouvelle version',
    'Fermer le launcher', 'Attendre et Fermer le popup');
    setCloseHandler(() => {
        closeLauncher();
    });
    setActionHandler(() => {
        toggleOverlay(false);
    });
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
    ipcRenderer.send("download", {
        url: "https://github.com/Nokaji/UraniumLauncher/releases/download/" + VersionLauncherMin +"/" + VersionLauncherMin + fileexe,
        properties: {directory: electron.remote.app.getPath("temp")}
    });
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
        setOverlayContent('Téléchargement est Terminé',
        'Le Téléchargement est fini le launcher va se redémarrer automatiquement :)',
        'Installer La Mise à Jour', null);
        setCloseHandler(() => {
            toggleOverlay(false);
        });

        executeFile();

        setTimeout(closeLauncher, 5000);
    });
}