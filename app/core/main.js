require('es6-promise').polyfill();
var app = require('app');
var BrowserWindow = require('browser-window');
var executor = require('./executor');
var Menu = require('menu');
var menu, template;

require('electron-debug')();
// require('crash-reporter').start();

var mainWindow = null, mainExecutor = null;

app.on('window-all-closed', function() {
    if (process.platform !== 'darwin') app.quit();
});

app.on('ready', function() {

    mainWindow = new BrowserWindow({ width: 500, height: 600 });
    mainExecutor = mainWindow._executor = new executor.Executor(mainWindow);

    /* eslint-disable no-path-concat */
    if (process.env.HOT) {
        mainWindow.loadUrl('file://' + __dirname + '/../hot-dev-app.html');
    } else {
        mainWindow.loadUrl('file://' + __dirname + '/../app.html');
    }
    /* eslint-enable no-path-concat */

    mainWindow.on('closed', function() {
        mainExecutor.destroy();
        mainWindow = null;
    });

    if (process.platform === 'darwin') {
        template = [{
            label: 'Electron',
            submenu: [{
                label: 'About ElectronReact',
                selector: 'orderFrontStandardAboutPanel:'
            }, {
                type: 'separator'
            }, {
                label: 'Services',
                submenu: []
            }, {
                type: 'separator'
            }, {
                label: 'Hide ElectronReact',
                accelerator: 'Command+H',
                selector: 'hide:'
            }, {
                label: 'Hide Others',
                accelerator: 'Command+Shift+H',
                selector: 'hideOtherApplications:'
            }, {
                label: 'Show All',
                selector: 'unhideAllApplications:'
            }, {
                type: 'separator'
            }, {
                label: 'Quit',
                accelerator: 'Command+Q',
                click: function() {
                    app.quit();
                }
            }]
        }, {
            label: 'Edit',
            submenu: [{
                label: 'Undo',
                accelerator: 'Command+Z',
                selector: 'undo:'
            }, {
                label: 'Redo',
                accelerator: 'Shift+Command+Z',
                selector: 'redo:'
            }, {
                type: 'separator'
            }, {
                label: 'Cut',
                accelerator: 'Command+X',
                selector: 'cut:'
            }, {
                label: 'Copy',
                accelerator: 'Command+C',
                selector: 'copy:'
            }, {
                label: 'Paste',
                accelerator: 'Command+V',
                selector: 'paste:'
            }, {
                label: 'Select All',
                accelerator: 'Command+A',
                selector: 'selectAll:'
            }]
        }, {
            label: 'View',
            submenu: [{
                label: 'Reload',
                accelerator: 'Command+R',
                click: function() {
                    mainWindow.restart();
                }
            }, {
                label: 'Toggle Full Screen',
                accelerator: 'Ctrl+Command+F',
                click: function() {
                    mainWindow.setFullScreen(!mainWindow.isFullScreen());
                }
            }, {
                label: 'Toggle Developer Tools',
                accelerator: 'Alt+Command+I',
                click: function() {
                    mainWindow.toggleDevTools();
                }
            }]
        }, {
            label: 'Window',
            submenu: [{
                label: 'Minimize',
                accelerator: 'Command+M',
                selector: 'performMiniaturize:'
            }, {
                label: 'Close',
                accelerator: 'Command+W',
                selector: 'performClose:'
            }, {
                type: 'separator'
            }, {
                label: 'Bring All to Front',
                selector: 'arrangeInFront:'
            }]
        }, {
            label: 'Help',
            submenu: [{
                label: 'Learn More',
                click: function() {
                    require('shell').openExternal('http://electron.atom.io');
                }
            }, {
                label: 'Documentation',
                click: function() {
                    require('shell').openExternal('https://github.com/atom/electron/tree/master/docs#readme');
                }
            }, {
                label: 'Community Discussions',
                click: function() {
                    require('shell').openExternal('https://discuss.atom.io/c/electron');
                }
            }, {
                label: 'Search Issues',
                click: function() {
                    require('shell').openExternal('https://github.com/atom/electron/issues');
                }
            }]
        }];

        menu = Menu.buildFromTemplate(template);
        Menu.setApplicationMenu(menu);
    } else {
        template = [{
            label: '&File',
            submenu: [{
                label: '&Open',
                accelerator: 'Ctrl+O'
            }, {
                label: '&Close',
                accelerator: 'Ctrl+W',
                click: function() {
                    mainWindow.close();
                }
            }]
        }, {
            label: '&View',
            submenu: [{
                label: '&Reload',
                accelerator: 'Ctrl+R',
                click: function() {
                    mainWindow.restart();
                }
            }, {
                label: 'Toggle &Full Screen',
                accelerator: 'F11',
                click: function() {
                    mainWindow.setFullScreen(!mainWindow.isFullScreen());
                }
            }, {
                label: 'Toggle &Developer Tools',
                accelerator: 'Alt+Ctrl+I',
                click: function() {
                    mainWindow.toggleDevTools();
                }
            }]
        }, {
            label: 'Help',
            submenu: [{
                label: 'Learn More',
                click: function() {
                    require('shell').openExternal('http://electron.atom.io');
                }
            }, {
                label: 'Documentation',
                click: function() {
                    require('shell').openExternal('https://github.com/atom/electron/tree/master/docs#readme');
                }
            }, {
                label: 'Community Discussions',
                click: function() {
                    require('shell').openExternal('https://discuss.atom.io/c/electron');
                }
            }, {
                label: 'Search Issues',
                click: function() {
                    require('shell').openExternal('https://github.com/atom/electron/issues');
                }
            }]
        }];
        menu = Menu.buildFromTemplate(template);
        mainWindow.setMenu(menu);
    }
});
