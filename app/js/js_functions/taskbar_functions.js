const { dialog } = require('electron').remote;
const firebase = require('firebase/app');

// The emojis for each status
const statusEmoji = {
  Online: '😀',
  Offline: '😴',
  Coding: '👨‍💻',
  Researching: '👀',
  Documenting: '📝',
  Meeting: '👥',
};

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
// User info
const uid = localStorage.getItem('userid');
const uname = localStorage.getItem('displayName');
let teamName;
// HTML elements
const flowDiv = document.getElementById('flowDiv');
const teamExistsDiv = document.getElementById('teamExistsDiv');
const teamNoneDiv = document.getElementById('teamNoneDiv');
const startFlowButton = document.getElementById('startFlowButton');
const endFlowButton = document.getElementById('endFlowButton');

// Utility functions

/**
 * Change the status of the team member on UI
 * @param {*} name: user's name
 * @param {*} status: user's new status
 */
function onStatusChange(name, status) {
  const statusElem = document.getElementById(`status_${name}`);
  if (statusElem != null) {
    statusElem.classList.add('hide');
    setTimeout(() => {
      statusElem.innerHTML = statusEmoji[status];
    }, 500);
    setTimeout(() => {
      statusElem.classList.remove('hide');
    }, 500);
  }
}

/**
 * Adds the team member to the team div on UI name
 * @param {string} name: user's name to display
 * @param {string} status: user's status, in string
 */
function addTeamMember(name, status) {
  const teamStatusesDiv = document.getElementById('teamStatusesDiv');
  console.log(`Adding member ${name}, status: ${status}`);
  let init = false;
  let nameList = document.getElementById('name_list');
  if (nameList == null) {
    init = true;
    nameList = document.createElement('UL');
    nameList.id = 'name_list';
  }
  const memberElem = document.createElement('LI');
  memberElem.innerHTML = name;
  memberElem.id = `name_${name}`;
  nameList.appendChild(memberElem);
  if (init) { teamStatusesDiv.appendChild(nameList); }

  init = false;
  let statusList = document.getElementById('status_list');
  if (statusList == null) {
    init = true;
    statusList = document.createElement('UL');
    statusList.id = 'status_list';
  }
  const statusElem = document.createElement('LI');
  statusElem.innerHTML = statusEmoji[status];
  statusElem.id = `status_${name}`;
  statusList.appendChild(statusElem);
  if (init) { teamStatusesDiv.appendChild(statusList); }
}

/**
 * Adds a listener to the status of the given user with id
 * @param {*} id: user's id
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

// Body functions

/**
 * Create user doc if not present in firebase,
 * if the user is present, this will simply updates its status to online
 */
function initUser() {
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
}

/**
 * Check if the user has checked in in the team
 */
function checkStatus() {
  flowDiv.style.display = 'block';
  teamExistsDiv.style.display = 'block';
  console.log(teamName);
  const docRef = db.collection('teams').doc(teamName).collection(uid).doc('status');
  docRef.get()
    .then((doc) => {
      if (doc.exists) {
        if (doc.data().checkedIn) {
          startFlowButton.style.display = 'none';
          endFlowButton.style.display = 'block';
        }
      }
    })
    .catch((error) => {
      console.error('Error getting data: ', error);
    });
}

/**
 * Checks value of thermometer and updates ui
 */
function checkThermometer() {
  const thermometer = document.getElementById('thermometer');

  // Checking lastTime was reset
  db.collection('thermometers').doc(teamName)
    .onSnapshot((doc) => {
      console.log('Current data: ', doc.data());
      const data = doc.data();
      thermometer.value = data.progress;
      let timeDiff = (new Date()).getTime() - data.lastEpoch;
      timeDiff = Math.round(timeDiff / 1000);
      console.log(timeDiff);
      const day = 24 * 60 * 60;
      const newDay = new Date();
      newDay.setHours(0);
      newDay.setMinutes(0);
      newDay.setSeconds(0);
      if (timeDiff > day) {
        db.collection('thermomemters').doc(teamName).set({
          progress: 0,
          lastEpoch: newDay.getTime(),
        });
      }
    });
}

/**
 * Get the team members, and add listeners to their status change
 */
function getTeam() {
  db.collection('users').where('team', '==', teamName).get()
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        // console.log(doc.id, " => ", doc.data());
        // console.log(doc.get("userStatus"));
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

/**
 * Check if the user is already in a team.
 * If so, join the team automatically
 */
function checkTeams() {
  db.collection('teams').where(uid, '==', true).get()
    .then((querySnapshot) => {
      // console.log(querySnapshot.docs)
      if (querySnapshot.docs.length > 0) {
        querySnapshot.forEach((doc) => {
          // doc.data() is never undefined for query doc snapshots
          // console.log(doc.id, " => ", doc.data());
          // console.log("Team name: ", doc.id)
          teamName = doc.id;
          checkStatus();
        });
        teamExistsDiv.style.display = 'block';
        const h2 = document.getElementById('teamName');
        h2.innerHTML = teamName;
        checkThermometer();
        getTeam();
      } else {
        teamNoneDiv.style.display = 'block';
        // console.log("Team not found")
      }
    })
    .catch((error) => {
      dialog.showMessageBox({
        type: 'error',
        title: 'Error',
        message: error.message,
      });
      document.location.href = 'signin.html';
    });
}

/**
 * Remove the user from the current team in the datbase and redirect to the main UI.
 */
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

/**
 * Logs the user out and return to the signin page.
 */
function logout() {
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
}

module.exports = {
  initUser,
  checkTeams,
  getTeam,
  checkStatus,
  leaveTeam,
  addTeamMember,
  checkThermometer,
  addStatusListener,
  onStatusChange,
  logout,
};
