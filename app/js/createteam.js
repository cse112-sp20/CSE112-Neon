const { firebaseConfig } = require('./js/common.js');

/* global firebase, cancel */

/** Initialize Firebase */
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const uid = localStorage.getItem('userid');

const joinTeamButton = document.getElementById('createBtn');

/**
 * Creates a new team and creates a new thermometer for a given teamname
 */
joinTeamButton.addEventListener('click', () => {
  console.log('Clicked');
  const teamName = document.getElementById('teamName').value;
  console.log(teamName);
  console.log(teamName);
  db.collection('users').doc(uid).update({ team: teamName });
  const obj = {};
  obj[uid] = true;
  db.collection('teams').doc(teamName).set(obj)
    .then(() => {
      console.log('Document written');
      const objNew = {};
      const newDay = new Date();
      newDay.setHours(0);
      newDay.setMinutes(0);
      newDay.setSeconds(0);
      objNew.progress = 0;
      objNew.lastEpoch = newDay.getTime();
      db.collection('thermometers').doc(teamName).set(objNew).then(() => {
        console.log(`Created new thermometer for ${teamName}`);
        document.location.href = 'taskbar.html';
      })
        .catch((error) => {
          console.error('Error adding document: ', error);
        });
    })
    .catch((error) => {
      console.error('Error adding document: ', error);
    });
});

const cancelButton = document.getElementById('cancelBtn');
cancelButton.addEventListener('click', () => cancel());
