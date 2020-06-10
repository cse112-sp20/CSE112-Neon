const { firebaseConfig } = require('./js/common.js');
const joinTeamFunctions = require('./js/js_functions/jointeam_functions.js');

/* global firebase */

/** Initialize Firebase */
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const uid = localStorage.getItem('userid');

// On joinBtn clicked
const joinTeamButton = document.getElementById('joinBtn');
joinTeamButton.addEventListener('click', () => { joinTeamFunctions.joinTeam(db, uid); });

// On cancelButton clicked
const cancelButton = document.getElementById('cancelBtn');
cancelButton.addEventListener('click', () => joinTeamFunctions.cancel());
