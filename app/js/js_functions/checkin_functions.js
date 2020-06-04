/* eslint no-shadow: ["error", { "allow": ["teamName"] }] */

let teamName = '';
const { dialog } = require('electron').remote;

/**
 * TODO
 * @param {*} parent
 * @param {*} text
 */
function addTask(parent, text) {
  const task = `
        <li>
            <input style="display: inline-block;" value = "${text}">
            <button class="bt">Add</button>
            <button class="bt">Delete</button>
        </li>`;
  parent.insertAdjacentHTML('beforeend', task);
}

/**
 * Checks which team a particular user is currently in
 * @param {*} db
 * @param {string} uid
 */
function checkTeams(db, uid) {
  const errorMessage = 'An error occurred when trying to find your team, returning to main page.';
  db.collection('teams').where(uid, '==', true)
    .get()
    .then((querySnapshot) => {
      console.log(querySnapshot.docs);
      if (querySnapshot.docs.length > 0) {
        querySnapshot.forEach((doc) => {
          teamName = doc.id;
        });
      } else {
        dialog.showMessageBox({
          type: 'error',
          title: 'Error',
          message: errorMessage,
        });
        console.log('Team not found');
        document.location.href = 'taskbar.html';
      }
    })
    .catch((error) => {
      dialog.showMessageBox({
        type: 'error',
        title: 'Error',
        message: errorMessage,
      });
      console.log('Error getting documents: ', error);
      document.location.href = 'taskbar.html';
    });
}

/**
 * TODO
 * @param {*} db
 * @param {string} uid
 */
function checkPrevTask(db, uid) {
  db.collection('teams').where(uid, '==', true)
    .get()
    .then((querySnapshot) => {
      console.log(querySnapshot.docs);
      if (querySnapshot.docs.length > 0) {
        querySnapshot.forEach((doc) => {
          teamName = doc.id;
        });
      }
      return teamName;
    })
    .then((teamName) => {
      db.collection('teams')
        .doc(teamName)
        .collection(uid).doc('status')
        .get()
        .then((status) => {
          const statusObj = status.data();
          const ptDiv = document.getElementById('prevTask');
          console.log(statusObj.task1);
          if (statusObj.task1 !== '' || statusObj.task2 !== '' || statusObj.task3 !== '') {
            ptDiv.style.display = 'block';
          }
          if (statusObj.task1 !== '') {
            addTask(ptDiv, statusObj.task1);
          }
          if (statusObj.task2 !== '') {
            addTask(ptDiv, statusObj.task2);
          }
          if (statusObj.task3 !== '') {
            addTask(ptDiv, statusObj.task3);
          }
        })
        .catch((error) => {
          console.log('Error checking prev tasks', error);
        });
    });
}

// startflow will always send 3 tasks value, if the user didn't not set any of them,
// just set the val to be ""
/**
 * TODO
 */
function startFlow(db, uid, task1, task2, task3) {
  db.collection('teams').where(uid, '==', true)
    .get()
    .then((querySnapshot) => {
      console.log(querySnapshot.docs);
      if (querySnapshot.docs.length > 0) {
        querySnapshot.forEach((doc) => {
          teamName = doc.id;
        });
      }
      return teamName;
    })
    .then((teamName) => {
      const obj = {
        checkedIn: true,
        task1: task1.value,
        task2: task2.value,
        task3: task3.value,
        taskStatus: 1,
      };
      db.collection('teams').doc(teamName).collection(uid).doc('status')
        .set(obj)
        .then(() => {
          console.log('Document written');
          document.location.href = 'taskbar.html';
        })
        .catch((error) => {
          dialog.showMessageBox({
            type: 'error',
            title: 'Error',
            message: error.message,
          });
          console.error('Error adding document: ', error);
          document.location.href = 'taskbar.html';
        });
    });
}


module.exports = {
  checkTeams, checkPrevTask, startFlow, addTask,
};
