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
      // console.log("Error getting documents: ", error);
      document.location.href = 'signin.html';
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
 * TODO
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
 * Link to createteam
 */
function createTeam() {
  document.location.href = 'createteam.html';
}

/**
 * Link to jointeam
 */
function joinTeam() {
  console.log('Join Team');
  document.location.href = 'jointeam.html';
}

/**
 * TODO
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

// Utility functions

/**
 * Adds the team member to the team div on UI name
 * @param {string} name: user's name to display
 * @param {string} status: user's status, in string
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

/**
 * Change the status of the team member on UI
 * @param {*} name: user's name
 * @param {*} status: user's new status
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

module.exports = {
  checkTeams, getTeam, checkStatus, createTeam, joinTeam, leaveTeam, addTeamMember, checkThermometer,
   addStatusListener, onStatusChange,
};
