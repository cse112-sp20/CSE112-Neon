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
      objNew.progress = 0;
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
