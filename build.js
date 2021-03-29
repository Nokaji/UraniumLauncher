/**
 * Paladium Launcher - https://github.com/Chaika9/paladiumlauncher
 * Copyright (C) 2019 Paladium
 */

const builder = require('electron-builder');
const Platform = builder.Platform;

function getCurrentPlatform() {
    switch(process.platform) {
        case 'win32': {
            return Platform.WINDOWS;
        }
        case 'darwin': {
            return Platform.MAC;
        }
        case 'linux': {
            return Platform.linux;
        }
        default: {
            console.error('Cannot resolve current platform!');
            return undefined;
        }
    }
}

builder.build( {
    targets: (process.argv[2] != null && Platform[process.argv[2]] != null ? Platform[process.argv[2]] : getCurrentPlatform()).createTarget(),
    config: {
        appId: 'paladiumlauncher',
        productName: 'Paladium Launcher',
        artifactName: '${productName}.${ext}',
        copyright: 'Copyright © 2019 Paladium',
        directories: {
            buildResources: 'build',
            output: 'dist'
        },
        win: {
            target: [
                {
                    target: 'nsis',
                    arch: 'x64'
                }
            ],
            icon: 'build/icon.ico'
        },
        nsis: {
            oneClick: false,
            perMachine: true,
            allowElevation: true,
            installerIcon: 'build/icon.ico',
            uninstallerIcon: 'build/icon.ico',
            allowToChangeInstallationDirectory: true
        },
        mac: {
            target: 'dmg',
            category: 'public.app-category.games',
            icon: 'build/icon.icns'
        },
        linux: {
            target: 'AppImage',
            maintainer: 'Chaika9',
            vendor: 'Paladium',
            synopsis: 'Paladium Launcher',
            description: 'Paladium Launcher',
            category: 'Game'
        },
        compression: 'maximum',
        files: [
            '!{dist,.gitignore,.vscode,docs,dev-app-update.yml,.travis.yml,.nvmrc,.eslintrc.json,build.js}'
        ],
        asar: true
    }
}).then(() => {
    console.log('Build complete!');
}).catch(err => {
    console.error('Error during build!', err);
})