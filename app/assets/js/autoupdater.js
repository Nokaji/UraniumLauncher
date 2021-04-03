const autoUpdater = require('electron-updater').autoUpdater;

autoUpdater.setFeedURL({ provider: 'github'
, owner: 'owner'
, repo: 'repo-name'
, token: 'token'
, private: true });