// const { dialog } = require('electron').remote;
const { shell } = require('electron');
const { firebaseConfig } = require('./js/common.js');
const signinFunctions = require('./js/js_functions/signin_functions.js');
/** Login credentials used only for testing purposes, does not interact with any actual accounts **/
const testUid = 'KDirlpoDKjUBN6lfkrHdflqzfoC2';
const testName = 'Test McTesterson';
const testEmail = 'testingneonapp@gmail.com';

/* global firebase */

/** Initialize Firebase */
firebase.initializeApp(firebaseConfig);
// const db = firebase.firestore();

const signInBtn = document.getElementById('signInBtn');
const testingEntry = document.getElementById('testingEntry');

signInBtn.addEventListener('click', () => {
  signinFunctions.signIn(new XMLHttpRequest(), shell, localStorage);
});

testingEntry.addEventListener('click', () => {
  signinFunctions.setStorage(localStorage, testUid, testName, testEmail);
});