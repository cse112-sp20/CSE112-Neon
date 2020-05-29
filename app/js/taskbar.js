const { dialog } = require('electron').remote;

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
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
// User info
const uid = localStorage.getItem('userid');
const uname = localStorage.getItem('displayName');

// Create user doc if not present in firebase,
// if the user is present, this will simply updates its status to online
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

// Top user information logistics
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

// Top right log out button logistics
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

function startFlow() { document.location.href = 'checkin.html'; }
function endFlow() { document.location.href = 'checkout.html'; }


// Right column logistics
let teamName;
const createTeamButton = document.getElementById('createTeamButton');
createTeamButton.addEventListener('click', () => createTeam());
const joinTeamButton = document.getElementById('joinTeamButton');
joinTeamButton.addEventListener('click', () => joinTeam());
const leaveTeamButton = document.getElementById('leaveTeamButton');
leaveTeamButton.addEventListener('click', () => leaveTeam());

checkTeams();

/* Check if the user is already in a team.
 * If so, join the team automatically
 */
function checkTeams() {
  db.collection('teams').where(uid, '==', true).get()
    .then((querySnapshot) => {
      console.log(querySnapshot.docs);
      if (querySnapshot.docs.length > 0) {
        querySnapshot.forEach((doc) => {
          // doc.data() is never undefined for query doc snapshots
          console.log(doc.id, ' => ', doc.data());
          console.log('Team name: ', doc.id);
          teamName = doc.id;
          checkStatus();
        });
        teamExistsDiv.style.display = 'block';
        const h2 = document.getElementById('teamName');
        h2.innerHTML = teamName;
        getTeam();
      } else {
        teamNoneDiv.style.display = 'block';
        console.log('Team not found');
      }
    })
    .catch((error) => {
      dialog.showMessageBox({
        type: 'error',
        title: 'Error',
        message: error.message,
      });
      console.log('Error getting documents: ', error);
      document.location.href = 'signin.html';
    });
}

// Get the team members, and add listeners to their status change
function getTeam() {
  db.collection('users').where('team', '==', teamName).get()
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        console.log(doc.id, ' => ', doc.data());
        console.log(doc.get('userStatus'));
        const displayName = doc.get('displayName');
        const status = doc.get('userStatus');
        addTeamMember(displayName, status);
        addStatusListener(doc.id);
      });
    })
    .catch((error) => {
      console.log('Error getting documents: ', error);
    });
}

function checkStatus() {
  flowDiv.style.display = 'block';
  teamExistsDiv.style.display = 'block';

  const docRef = db.collection('teams').doc(teamName).collection(uid).doc('status');
  docRef.get()
    .then((doc) => {
      if (doc.exists) {
        if (doc.data().checkedIn) {
          startFlowButton.style.display = 'none';
          endFlowButton.style.display = 'block';
        }
      } else {
        console.error('Error getting data');
      }
    })
    .catch((error) => {
      console.error('Error getting data: ', error);
    });
}

function createTeam() {
  document.location.href = 'createteam.html';
}

function joinTeam() {
  console.log('Join Team');
  document.location.href = 'jointeam.html';
}

function leaveTeam() {
  // Attempt to remove the status document from the corresponding user in the team document
  db.collection('teams').doc(teamName).collection(uid).doc('status')
    .delete()
    .then(() => {
      console.log('Successfully removed status document from teams collection');

      // If successful, also remove the uid=true field from the team document
      const docRef = db.collection('teams').doc(teamName);
      docRef.update({
        [uid]: firebase.firestore.FieldValue.delete(),
      }).then(() => {
        console.log('Successfully removed uid field from teams collection');
        document.location.href = 'taskbar.html';
      }).catch((error) => {
        console.error('Error removing field: ', error);
      });
    })
    .catch((error) => {
      console.error('Error removing document: ', error);
    });
}

// Utility functions

/* Adds the team member to the team div on UI
 * name: user's name to display
 * status: user's status, in string
 */
function addTeamMember(name, status) {
  console.log(`Adding member ${name}, status: ${status}`);
  let init = false;
  let namelist = document.getElementById('name_list');
  if (namelist == null) {
    init = true;
    namelist = document.createElement('UL');
    namelist.id = 'name_list';
  }
  const member_elem = document.createElement('LI');
  member_elem.innerHTML = name;
  member_elem.id = `name_${name}`;
  namelist.appendChild(member_elem);
  if (init) { teamStatusesDiv.appendChild(namelist); }

  init = false;
  let statuslist = document.getElementById('status_list');
  if (statuslist == null) {
    init = true;
    statuslist = document.createElement('UL');
    statuslist.id = 'status_list';
  }
  const status_elem = document.createElement('LI');
  status_elem.innerHTML = status_emoji[status];
  status_elem.id = `status_${name}`;
  statuslist.appendChild(status_elem);
  if (init) { teamStatusesDiv.appendChild(statuslist); }
}

/* Adds a listener to the status of the given user with id
 * id: user's id
 */
function addStatusListener(id) {
  db.collection('users').doc(id)
    .onSnapshot((doc) => {
      const displayName = doc.get('displayName');
      const status = doc.get('userStatus');
      console.log(`${displayName} change status to ${status}`);
      onStatusChange(displayName, status);
    });
}

/* Change the status of the team member on UI
 * name: user's name
 * status: user's new status
 */
function onStatusChange(name, status) {
  const status_elem = document.getElementById(`status_${name}`);
  if (status_elem != null) {
    status_elem.classList.add('hide');
    setTimeout(() => {
      status_elem.innerHTML = status_emoji[status];
    }, 500);
    setTimeout(() => {
      status_elem.classList.remove('hide');
    }, 500);
  }
}
