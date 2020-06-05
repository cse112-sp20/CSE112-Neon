const { dialog } = require('electron').remote;
const { shell } = require('electron');
const { firebaseConfig } = require('./js/common.js');

/** Initialize Firebase */
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

const signInBtn = document.getElementById('signInBtn');

let intervalVar;

/**
 * Opens up google sign in page, then continually pings server for response from redirect. Once that
 * redirect response is received then userid, email, and name are retrieved. Then redirects to taskbar.html
 */
signInBtn.addEventListener('click', () => {
  console.log('here');
  const guid = guidVal();
  intervalVar = setInterval(() => {
    const xhr = new XMLHttpRequest();
    const url = `http://localhost:3000/checklogin?guid=${guid}`;
    xhr.open('get', url, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onreadystatechange = function () { // Call a function when the state changes.
      if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
        console.log('Response is');
        console.log(xhr.response);
        const response = JSON.parse(xhr.response);
        if (response.guid) {
          console.log('Successfully logged in');
          clearInterval(intervalVar);
          localStorage.setItem('userid', response.uid);
          localStorage.setItem('displayName', response.displayName);
          localStorage.setItem('email', response.email);
          document.location.href = 'taskbar.html';
        }
      }
    };
    xhr.send();
  }, 1000);
  console.log('Signing in');

  const url = `http://localhost:3000/googlesignin.html?guid=${guid}`;
  shell.openExternal(url);
});
