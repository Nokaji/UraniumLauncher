const fs = require('fs');
const axios = require('axios');

const electron = require('electron');

const 

const os = require('os');

var version = ("./app/assets/distri.json");

let rawdata = fs.readFileSync(version);
let versions = JSON.parse(rawdata);

let forceUpdate = false;

VersionLauncher = (versions.launcher.version);

console.log("Actuel Version : " + VersionLauncher);

function updaterVerify(){
    document.getElementById("version-actuel").style.visibility = "hidden";
    document.getElementById("version-none-actuel").style.visibility = "hidden";
    //Version Récente
    axios.get("https://beta-uranium.yvleis.fr/ressources/download/launcher/sources/distri.json")
    .then(response => {
        VersionLauncherMin = (response.data.launcher.version);
        console.log("Récents version " + VersionLauncherMin);
        if(VersionLauncherMin == VersionLauncher){
            console.log("Le Launcher est à jour(Version : " + VersionLauncher + ")");
            document.getElementById("version-actuel").style.visibility = "visible";
            document.getElementById("version-none-actuel").style.visibility = "hidden";
        }else{
            document.getElementById("version-none-actuel").style.visibility = "visible";
            document.getElementById("version-actuel").style.visibility = "hidden";
            let forceUpdate = true;
            var fileexe;
            if(process.platform === 'darwin') {
                fileexe = '.dmg';
            } 
            else if(process.platform === 'win32') {
                fileexe = '.exe';
            }
            else{
                fileexe = '.';
            }
            if(VersionLauncherMin != VersionLauncher){
                if(forceUpdate == true){
                    ipcRenderer.send("download", {
                        url: "https://github.com/Nokaji/UraniumLauncher/releases/download/" + VersionLauncherMin +"/" + VersionLauncherMin + fileexe,
                        properties: {directory: electron.remote.app.getPath("temp")}
                    });
                }
            }
        }
    });
}