const { firebaseConfig } = require('./js/common.js');
const createTeamFunctions = require('./js/js_functions/createteam_functions.js');

/* global firebase */

/** Initialize Firebase */
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const uid = localStorage.getItem('userid');

const joinTeamButton = document.getElementById('createBtn');

/**
 * Creates a new team and creates a new thermometer for a given teamname
 */
joinTeamButton.addEventListener('click', () => createTeamFunctions.createTeam(uid, db));

const cancelButton = document.getElementById('cancelBtn');
cancelButton.addEventListener('click', () => createTeamFunctions.cancel());
