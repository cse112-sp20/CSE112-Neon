const { app, BrowserWindow, ipcMain } = require('electron')
const psList = require('ps-list');

var win;
let checkInWin;

function createWindow() {
    // Create the browser window.
    win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true
        }
    });

    // and load the index.html of the app.
    win.loadFile('./app/signin.html')
}

app.whenReady().then(createWindow);

ipcMain.on('check-in-modal-trigger', () => {
    checkInWin = new BrowserWindow({
        width: 600,
        height: 300,
        webPreferences: { nodeIntegration: true },
        frame: false,
    });

    // Loading the checkInWindow
    checkInWin.loadFile('app/checkIn.html');
    // Put check in window on top of other screens -- not working on fullscreen
    checkInWin.setAlwaysOnTop(true, "floating", 1);
    checkInWin.setVisibleOnAllWorkspaces(true);
});
