
const {
  checkTeams, endFlow, cancel, setColor,
} = require('./js_functions/checkout_functions.js');

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

checkTeams(uid, db);

const endFlowButton = document.getElementById('endFlowBtn');
endFlowButton.addEventListener('click', () => endFlow(db, uid));

const cancelButton = document.getElementById('cancelBtn');
cancelButton.addEventListener('click', () => cancel());

// const completedBtn1 = document.getElementById('completedBtn1');
// completedBtn1.addEventListener('click', () => setColor('completedBtn', '#7FFF00', 1));

// const completedBtn2 = document.getElementById('completedBtn2');
// completedBtn2.addEventListener('click', () => setColor('completedBtn', '#7FFF00', 2));

// const completedBtn1 = document.getElementById('completedBtn3');
// completedBtn3.addEventListener('click', () => setColor('completedBtn', '#7FFF00', 3));

// const keepBtn1 = document.getElementById('keepBtn1');
// keepBtn1.addEventListener('click', () => setColor('keepBtn', '#00B4AB', 1));
// const keepBtn2 = document.getElementById('keepBtn2');
// keepBtn2.addEventListener('click', () => setColor('keepBtn', '#00B4AB',2));
// const keepBtn3 = document.getElementById('keepBtn3');
// keepBtn3.addEventListener('click', () => setColor('keepBtn', '#00B4AB',3));

// const sosBtn1 = document.getElementById('sosBtn1');
// sosBtn1.addEventListener('click', () => setColor('sosBtn', '#00B4AB',1));
// const sosBtn2 = document.getElementById('sosBtn2');
// sosBtn2.addEventListener('click', () => setColor('sosBtn', '#00B4AB',2));
// const sosBtn3 = document.getElementById('sosBtn3');
// sosBtn3.addEventListener('click', () => setColor('sosBtn', '#00B4AB',3));

// const blockedBtn1 = document.getElementById('blockedBtn1');
// blockedBtn1.addEventListener('click', () => setColor('blockedBtn', 'red',1));

// const blockedBtn2 = document.getElementById('blockedBtn2');
// blockedBtn2.addEventListener('click', () => setColor('blockedBtn', 'red',2));

// const blockedBtn3 = document.getElementById('blockedBtn3');
// blockedBtn3.addEventListener('click', () => setColor('blockedBtn', 'red',3));
