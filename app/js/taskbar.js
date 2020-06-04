const { dialog } = require('electron').remote;

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

const status_emoji = {
  Online: '😀',
  Offline: '😴',
  Coding: '👨‍💻',
  Researching: '👀',
  Documenting: '📝',
  Meeting: '👥',
};

/** Initialize Firebase */
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
// User info
const uid = localStorage.getItem('userid');
const uname = localStorage.getItem('displayName');


/**
 * Create user doc if not present in firebase,
 * if the user is present, this will simply updates its status to online
 */
const ref = db.collection('users').doc(uid);
ref.get().then((doc) => {
  if (doc.exists) {
    ref.update({
      displayName: uname,
      userStatus: 'Online',
    });
  } else {
    ref.set({
      displayName: uname,
      userStatus: 'Online',
    });
  }
});

/**
 * Top user information logistics
 */
document.getElementById('username').innerHTML = uname;
document.getElementById('userStatus').onchange = function () {
  const { value } = document.getElementById('userStatus');
  db.collection('users').doc(uid).update({
    userStatus: value,
  })
    .catch((error) => {
      console.error('Error attempting to change user status: ', error);
    });
};

/**
 * Top right log out button logistics
 */
const logoutButton = document.getElementById('logOutBtn');
logoutButton.addEventListener('click', () => {
  firebase.auth().signOut().then(() => {
    localStorage.removeItem('userid');
    localStorage.removeItem('email');
    localStorage.removeItem('displayName');
    document.location.href = 'signin.html';
  }).catch((error) => {
    // Handle errors
    dialog.showMessageBox({
      type: 'error',
      title: 'Error',
      message: error.message,
    });
    console.log(error);
  });
});


function startFlow() { document.location.href = 'checkin.html'; }

function endFlow() { document.location.href = 'checkout.html'; }

// Left column logistics
const startFlowButton = document.getElementById('startFlowButton');
startFlowButton.addEventListener('click', () => startFlow());

const endFlowButton = document.getElementById('endFlowButton');
endFlowButton.addEventListener('click', () => endFlow());

const flowDiv = document.getElementById('flowDiv');
const teamNoneDiv = document.getElementById('teamNoneDiv');
const teamExistsDiv = document.getElementById('teamExistsDiv');
const teamStatusesDiv = document.getElementById('teamStatusesDiv');
flowDiv.style.display = 'none';
teamNoneDiv.style.display = 'none';
teamExistsDiv.style.display = 'none';
endFlowButton.style.display = 'none';


// Right column logistics
// let teamName;
const createTeamButton = document.getElementById('createTeamButton');
createTeamButton.addEventListener('click', () => createTeam());
const joinTeamButton = document.getElementById('joinTeamButton');
joinTeamButton.addEventListener('click', () => joinTeam());
const leaveTeamButton = document.getElementById('leaveTeamButton');
leaveTeamButton.addEventListener('click', () => leaveTeam());

checkTeams();
