const { firebaseConfig } = require('./common.js');

const {
  checkTeams, endFlow, cancel,
} = require('./js_functions/checkout_functions.js');

/** Initialize Firebase */
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const uid = localStorage.getItem('userid');

checkTeams(uid, db);

const endFlowButton = document.getElementById('endFlowBtn');
endFlowButton.addEventListener('click', () => endFlow(db, uid));

const cancelButton = document.getElementById('cancelBtn');
cancelButton.addEventListener('click', () => cancel());
