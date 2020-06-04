const { app, BrowserWindow } = require('electron');
const psList = require('ps-list');
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

const expressApp = express();
const port = 3000;

const guidToIDMap = {};

/**
 * Serving static files
 */
expressApp.use(express.static(`${__dirname}/`))
    .use(bodyParser.json());

/** 
 * Route for google sign in to post sign in information 
 */
expressApp.post('/registerlogin', (req, res) => {
    console.log('Registering login');
    console.log(req.body);
    const { guid } = req.body;
    guidToIDMap[guid] = req.body;
    res.send({});
});

/**
 * Route for electron app to retrieve sign in information
 */
expressApp.get('/checklogin', (req, res) => {
    if (req.query.guid) {
        if (guidToIDMap[req.query.guid]) {
            const obj = guidToIDMap[req.query.guid];
            delete guidToIDMap[req.query.guid];
            res.send(obj);
        } else {
            res.send({});
        }
    } else {
        res.send({});
    }
});

expressApp.listen(port, () => { console.log('Server running'); });


let intervalVar;
const vsCodeStatus = false;

let win;

/**
 * Creates browser window
 */
function createWindow() {
    win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            nativeWindowOpen: true,
        },
    });

    // and load the index.html of the app.
    win.loadFile('./app/signin.html');
}


app.whenReady().then(createWindow);