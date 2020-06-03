var  dialog  = require('electron').remote;

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
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const uid = localStorage.getItem('userid');
let teamName = '';
const task1 = document.getElementById('Task1');
const task2 = document.getElementById('Task2');
const task3 = document.getElementById('Task3');
task1.value = '';
task2.value = '';
task3.value = '';
const prevList = document.getElementById('prevTask');
const todayTask = document.getElementById('todayTask');

checkTeams();
checkPrevTask();

const startFlowButton = document.getElementById('startFlowBtn');
startFlowButton.addEventListener('click', () => startFlow());

prevList.addEventListener('click', (event) => {
  const { target } = event;
  console.log('event', target.parentNode.id);
  text = target.parentNode.firstElementChild.value;
  console.log('text', text);
  parentLi = target.parentNode;

  if (target.innerText == 'Add') {
    if (task1.value == '') {
      task1.value = text;
      task1.parentNode.style.display = 'block';
      prevList.removeChild(parentLi);
    } else if (task2.value == '') {
      task2.value = text;
      task2.parentNode.style.display = 'block';
      prevList.removeChild(parentLi);
    } else if (task3.value == '') {
      task3.value = text;
      task3.parentNode.style.display = 'block';
      prevList.removeChild(parentLi);
    } else {
      dialog.showMessageBox({
        type: 'error',
        title: 'Error',
        message: errorMessage,
      });
    }
  } else if (target.innerText == 'Delete') {
    document.getElementById('prevTask').removeChild(parentLi);
  }
});

document.getElementById('addTasks').addEventListener('click', () => {
  console.log(task1.value);
  if (task1.value == '') {
    task1.parentNode.style.display = 'block';
  } else if (task2.value == '') {
    task2.parentNode.style.display = 'block';
  } else if (task3.value == '') {
    task3.parentNode.style.display = 'block';
  } else {
    console.log('here');
  }
});

var cancelButton = document.getElementById("cancelBtn")
cancelButton.addEventListener("click", () => cancel())
function cancel() { document.location.href = "taskbar.html" }

todayTask.addEventListener('click', (event) => {
  target = event.target;
  console.log(target.innerText);
  if (target.innerText == 'Delete') {
    targetParent = target.parentNode;
    targetParent.style.display = 'none';
    targetParent.firstElementChild.value = '';
  }
});