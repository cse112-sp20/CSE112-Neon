const psList = require('ps-list');
const firebase = require('firebase/app');

const WIN_VS_CODE_PROCESS_NAME = 'Code.exe';
const pText = document.querySelector('#vscode-status');
const numText = document.querySelector('#vscode-num');
const db = firebase.firestore();
let vsCodeStatus = false;

function vsCodeClosed() {
  console.log('VSCode has just been closed');
  const userid = localStorage.getItem('userid');
  console.log('Userid is: ', userid);
  db.collection('vscode').doc(userid).set({
    loggedin: false,
  }).then((docRef) => {
    console.log('Document written with ID: ', docRef.id);
  })
    .catch((error) => {
      console.error('Error adding document: ', error);
    });
}

function vsCodeOpened() {
  console.log('VSCode has just been opened');
  const userid = localStorage.getItem('userid');
  console.log('Userid is: ', userid);
  db.collection('vscode').doc(userid).set({
    loggedin: true,
  }).then((docRef) => {
    console.log(docRef);
    console.log('Document written with ID: ', docRef.id);
  })
    .catch((error) => {
      console.error('Error adding document: ', error);
    });
}

async function isVSCodeOpen() {
  const list = await psList();
  const names = [];
  const codes = [];
  for (let i = 0; i < list.length; i += 1) {
    names.push(list[i].name);

    // Windows does not support cmd key returned by ps-list
    // darwin means we are on macOS
    if (process.platform === 'darwin') {
      const lowercase = list[i].name.toLowerCase();
      if (lowercase.indexOf('applications') >= 0) {
        if (list[i].cmd.split('/')[2] === 'Visual Studio Code.app') {
          codes.push(list[i].cmd.split('/')[2]);
        }
      }
    // Even if we're not on 32-bit, the key is still win-32
    } else if (process.platform === 'win32') {
      if (list[i].name === WIN_VS_CODE_PROCESS_NAME) {
        codes.push(list[i].name);
      }
    }
  }
  if (codes.length > 0) {
    /* win.webContents.executeJavaScript(`
                document.getElementById("vscode-status") = "open"
            `) */
    pText.innerHTML = 'Open';
    numText.innerHTML = codes.length;
    if (!vsCodeStatus) {
      vsCodeOpened();
      vsCodeStatus = true;
    }
  } else {
    /* win.webContents.executeJavaScript(`
                document.getElementById("vscode-status") = "closed"
            `) */
    pText.innerHTML = 'Closed';
    numText.innerHTML = 0;
    if (vsCodeStatus) {
      vsCodeClosed();
      vsCodeStatus = false;
    }
  }
}


module.exports = { isVSCodeOpen, vsCodeOpened, vsCodeClosed };
