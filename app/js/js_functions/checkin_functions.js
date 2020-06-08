const { dialog } = require('electron')
/**
 * return the user's teamname
 * @param {*} db
 * @param {string} uid
 */

function getTeamNameDb(db, uid) {
    return db.collection('teams').where(uid, '==', true).get();
}

function getTeamName(db, uid) {
  const getTN = function tn(resolve) {
      var thing = this.getTeamNameDb(db, uid);
      thing.then((querySnapshot) => {
        if (querySnapshot.docs.length > 0) {
          querySnapshot.forEach((doc) => {
            resolve(doc.id);
          });
        }
      });
  };
  return new Promise(getTN);
}

/**
 * show warnings if a user fail to join a team
 * @param {*} db
 * @param {string} uid
 */
function failGetTeamName() {
  const errorMessage = 'An error occurred when trying to find your team, returning to main page.';
  dialog.showMessageBox({
    type: 'error',
    title: 'Error',
    message: errorMessage,
  });
  document.location.href = 'taskbar.html';
}

/**
 * Checks if a user joined a team or not
 * @param {*} db
 * @param {string} uid
 */
function checkTeams(db, uid) {
  getTeamName(db, uid)
    .then()
    .catch(failGetTeamName);
}

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

function checkPrevTaskDb(db, teamName, uid) {
    return db.collection('teams')
        .doc(teamName)
        .collection(uid).doc('status')
        .get();
}

/**
 * TODO
 * @param {*} db
 * @param {string} uid
 */
function checkPrevTask(db, uid) {
  getTeamName(db, uid)
    .then((teamName) => {
      checkPrevTaskDb(db, teamName, uid)
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

function startFlowDb(db, teamName, uid, obj) {
    return db.collection('teams').doc(teamName).collection(uid).doc('status')
        .set(obj);
}

/**
 * TODO
 */
function startFlow(db, uid, task1, task2, task3) {
  getTeamName(db, uid)
    .then((teamName) => {
      const obj = {
        checkedIn: true,
        task1: task1.value,
        task2: task2.value,
        task3: task3.value,
        taskStatus: 1,
      };
      startFlowDb(db, teamName, uid, obj)
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
  checkTeams, checkPrevTask, startFlow, addTask, getTeamName, getTeamNameDb
};
