const { dialog } = require('electron').remote;
const { firebaseConfig } = require('./js/common.js');

/* global firebase */

/** Initialize Firebase */
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const uid = localStorage.getItem('userid');

/**
 * Logic for joining a team, checks if team exists then adds current user to the team.
 */
const joinTeamButton = document.getElementById('joinBtn');
joinTeamButton.addEventListener('click', () => {
  const teamName = document.getElementById('teamName').value;
  console.log('Clicked');
  console.log(teamName);
  db.collection('teams').doc(teamName)
    .get()
    .then((querySnapshot) => {
      console.log(querySnapshot);
      console.log(querySnapshot.data());
      const obj = querySnapshot.data();
      if (obj) {
        console.log('Team exists');
        // Join team
        db.collection('users').doc(uid).update({ team: teamName });
        obj[uid] = true;
        db.collection('teams').doc(teamName).set(obj)
          .then(() => {
            console.log(`${uid} joined team ${teamName}`);
            document.location.href = 'taskbar.html';
          })
          .catch((error) => {
            console.error('Error adding document: ', error);
          });
      } else {
        dialog.showMessageBox({
          type: 'error',
          title: 'Error',
          message: 'Team does not exist.',
        });
      }
    })
    .catch((error) => {
      console.log(error);
    });
});


const cancelButton = document.getElementById('cancelBtn');
cancelButton.addEventListener('click', () => cancel());
