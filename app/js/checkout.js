const { dialog } = require('electron').remote;
var { checkTeams, createGoalList, updateGoal, endFlow, updateThermometer, cancel } = require('./js_functions/checkout_functions.js');

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
const uid = localStorage.getItem('userid');

checkTeams(uid, db)
var errorMessage = "An error occurred when trying to find your team, returning to main page."

let taskNum = 1;

const endFlowButton = document.getElementById('endFlowBtn');
endFlowButton.addEventListener('click', () => endFlow(db, uid));

var cancelButton = document.getElementById("cancelBtn")
cancelButton.addEventListener("click", () => cancel())