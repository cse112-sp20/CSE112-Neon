const { app, BrowserWindow } = require('electron');
const express = require('express');
// const path = require('path');
const bodyParser = require('body-parser');

const expressApp = express();
const port = 3000;

const guidToIDMap = {};

expressApp.use(express.static(`${__dirname}/`))
  .use(bodyParser.json());

/* expressApp.get('/test', function(req, res) {
    var options = {
        root: path.join(__dirname)
    }
    res.sendFile('signin.html', options)
}) */

expressApp.post('/registerlogin', (req, res) => {
  console.log('Registering login');
  console.log(req.body);
  const { guid } = req.body;
  guidToIDMap[guid] = req.body;
  res.send({});
});

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

let win;

function createWindow() {
  // Create the browser window.
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
  // win.loadURL('http://localhost:3000/signin.html')
}


app.whenReady().then(createWindow);
