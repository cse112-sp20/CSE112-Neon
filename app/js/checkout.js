
const { firebaseConfig } = require('./common.js');

const {
  checkTeams, endFlow, cancel,
} = require('./js_functions/checkout_functions.js');


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