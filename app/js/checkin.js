const dialog = require('electron').remote;
const { firebaseConfig } = require('./common.js');
const { checkTeams, checkPrevTask, startFlow } = require('./js_functions/checkin_functions.js');

/* global firebase */

/** Initialize Firebase */
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const uid = localStorage.getItem('userid');
const task1 = document.getElementById('Task1');
const task2 = document.getElementById('Task2');
const task3 = document.getElementById('Task3');
task1.value = '';
task2.value = '';
task3.value = '';
const prevList = document.getElementById('prevTask');
const todayTask = document.getElementById('todayTask');

checkTeams(db, uid);
checkPrevTask(db, uid);
const startFlowButton = document.getElementById('startFlowBtn');
startFlowButton.addEventListener('click', () => startFlow(db, uid, task1, task2, task3));

/**
 * TODO
 */
prevList.addEventListener('click', (event) => {
  const { target } = event;
  const text = target.parentNode.firstElementChild.value;
  const parentLi = target.parentNode;

  if (target.innerText === 'Add') {
    if (task1.value === '') {
      task1.value = text;
      task1.parentNode.style.display = 'block';
      prevList.removeChild(parentLi);
    } else if (task2.value === '') {
      task2.value = text;
      task2.parentNode.style.display = 'block';
      prevList.removeChild(parentLi);
    } else if (task3.value === '') {
      task3.value = text;
      task3.parentNode.style.display = 'block';
      prevList.removeChild(parentLi);
    } else {
      dialog.showMessageBox({
        type: 'error',
        title: 'Error',
        message: 'Error',
      });
    }
  } else if (target.innerText === 'Delete') {
    document.getElementById('prevTask').removeChild(parentLi);
  }
});

/**
 * TODO
 */
document.getElementById('addTasks').addEventListener('click', () => {
  console.log(task1.value);
  if (task1.value === '') {
    task1.parentNode.style.display = 'block';
  } else if (task2.value === '') {
    task2.parentNode.style.display = 'block';
  } else if (task3.value === '') {
    task3.parentNode.style.display = 'block';
  } else {
    console.log('here');
  }
});

/**
 * Cancels checkin flow
 */
function cancel() { document.location.href = 'taskbar.html'; }
const cancelButton = document.getElementById('cancelBtn');
cancelButton.addEventListener('click', () => cancel());

/**
 * TODO
 */
todayTask.addEventListener('click', (event) => {
  const targetVal = event.target;
  if (targetVal.innerText === 'Delete') {
    const targetParent = targetVal.parentNode;
    targetParent.style.display = 'none';
    targetParent.firstElementChild.value = '';
  }
});
