// const { dialog } = require('electron').remote;
const { shell } = require('electron');
const { firebaseConfig } = require('./js/common.js');
const signinFunctions = require('./js/js_functions/signin_functions.js');

/* global firebase */

/** Initialize Firebase */
firebase.initializeApp(firebaseConfig);
// const db = firebase.firestore();

const signInBtn = document.getElementById('signInBtn');
const signInBtnFake = document.getElementById('signInBtnFake');

signInBtn.addEventListener('click', () => {
  signinFunctions.signIn(new XMLHttpRequest(), shell, localStorage);
});
