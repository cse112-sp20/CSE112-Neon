const { dialog } = require('electron');
const { firebaseConfig } = require('./js/common.js');
const joinTeamFunctions = require('./js/js_functions/jointeam_functions.js');

/* global firebase */

/** Initialize Firebase */
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const uid = localStorage.getItem('userid');

// On joinBtn clicked
const joinTeamButton = document.getElementById('joinBtn');
joinTeamButton.addEventListener('click', () => {
  const teamName = document.getElementById('teamName').value;
  joinTeamFunctions.joinTeam(teamName, db, uid, dialog);
});

// On cancelButton clicked
const cancelButton = document.getElementById('cancelBtn');
cancelButton.addEventListener('click', () => joinTeamFunctions.cancel());
