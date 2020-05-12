const { app, BrowserWindow } = require('electron')
const psList = require('ps-list');

var intervalVar
var vsCodeStatus = false

var win

function createWindow() {
    // Create the browser window.
    win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true
        }
    })

    // and load the index.html of the app.
    win.loadFile('index.html')
}


app.whenReady().then(createWindow)