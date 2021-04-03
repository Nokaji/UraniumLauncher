const {app, BrowserWindow, ipcMain} = require('electron');
const path = require('path');
const url = require('url');
const ejse = require('ejs-electron');

const isDev = require('./app/assets/js/isdev');

let frame;

function initialize() {
    app.disableHardwareAcceleration();

	if(makeSingleInstance()) {
		return app.quit();
    }
   
    app.on('ready', () => {
        createWindow();
    });

    app.on('window-all-closed', () => {
        if(process.platform !== 'darwin') {
            app.quit();
        }
    });
    
    app.on('activate', () => {
        if(frame === null) {
            createWindow();
        }
    });
}

function createWindow() {
    frame = new BrowserWindow({
        width: 1280,
        height: 720,
        minWidth: 1280,
        minHeight: 720,
        icon: getPlatformIcon('icon'),
        resizable: true,
        frame: false,
        webPreferences: {
            nodeIntegration: true,
            webSecurity: true,
            contextIsolation: false
        },
        backgroundColor: '#2f2f2f'
    });

    frame.loadURL(url.format({
        pathname: path.join(__dirname, 'app', 'app.ejs'),
        protocol: 'file:',
        slashes: true
    }));

    frame.removeMenu();

    frame.on('closed', () => {
        frame = null;
    });
}

function getPlatformIcon(filename) {
    const os = process.platform;
    if(os === 'darwin') {
        filename = filename + '.icns';
    } 
    else if(os === 'win32') {
        filename = filename + '.ico';
    }
    else {
        filename = filename + '.png';
    }
    return path.join(__dirname, 'app', 'assets', 'images', 'icons', filename);
}

function makeSingleInstance() {
    const lock = app.requestSingleInstanceLock();

	if(process.mas) {
		return false;
    }
    
	if(!lock) {
        app.quit();
    } 
    else {
        app.on('second-instance', (event, commandLine, workingDirectory) => {
            if(frame) {
                if(frame.isMinimized()) {
                    frame.restore();
                    frame.focus();
                }
            }
        });
    }
}

initialize();