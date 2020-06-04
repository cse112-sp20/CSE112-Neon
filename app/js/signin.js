const { dialog } = require('electron').remote;
const { shell } = require('electron');

/** Firebase Config */
const firebaseConfig = {
    apiKey: 'AIzaSyBmn_tDSlm4lLdrvSqj8Yb00KkYae8cL-Y',
    authDomain: 'neon-pulse-development.firebaseapp.com',
    databaseURL: 'https://neon-pulse-development.firebaseio.com',
    projectId: 'neon-pulse-development',
    storageBucket: 'neon-pulse-development.appspot.com',
    messagingSenderId: '240091062123',
    appId: '1:240091062123:web:babe11f5f03ced38fbb62e',
    measurementId: 'G-VMS6JL8H4S',
};

/** Initialize Firebase */
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

const signInBtn = document.getElementById('signInBtn');

function guidVal() {
    const s4 = () => Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
    // return id of format 'aaaaaaaa'-'aaaa'-'aaaa'-'aaaa'-'aaaaaaaaaaaa'
    return `${s4() + s4()}-${s4()}-${s4()}`;
}

let intervalVar;
/**
 * Opens up google sign in page, then continually pings server for response from redirect. Once that 
 * redirect response is received then userid, email, and name are retrieved. Then redirects to taskbar.html
 */
signInBtn.addEventListener('click', () => {
    const guid = this.guidVal();
    intervalVar = setInterval(() => {
        const xhr = new XMLHttpRequest();
        const url = `http://localhost:3000/checklogin?guid=${guid}`;
        xhr.open('get', url, true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.onreadystatechange = function() { // Call a function when the state changes.
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
    }, 500);
    console.log('Signing in');

    const url = `http://localhost:3000/googlesignin.html?guid=${guid}`;
    shell.openExternal(url);
});