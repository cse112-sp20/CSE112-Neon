const { dialog } = require('electron').remote;

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

/**
 * Checks which team a particular user is currently in
 */
function checkTeams() {
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
 */
function checkPrevTask() {
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
                    statusObj = status.data();
                    ptDiv = document.getElementById('prevTask');
                    console.log(statusObj.task1);
                    if (statusObj.task1 != '' || statusObj.task2 != '' || statusObj.task3 != '') {
                        ptDiv.style.display = 'block';
                    }
                    if (statusObj.task1 != '') {
                        addTask(ptDiv, statusObj.task1);
                    }
                    if (statusObj.task2 != '') {
                        addTask(ptDiv, statusObj.task2);
                    }
                    if (statusObj.task3 != '') {
                        addTask(ptDiv, statusObj.task3);
                    }
                })
                .catch((error) => {
                    console.log('Error checking prev tasks', error);
                });
        });
}
checkPrevTask();

const startFlowButton = document.getElementById('startFlowBtn');
startFlowButton.addEventListener('click', () => startFlow());

// startflow will always send 3 tasks value, if the user didn't not set any of them, just set the val to be ""
/**
 * TODO
 */
function startFlow() {
    console.log('tv1', task1.value);
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

/**
 * TODO
 */
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

/**
 * Cancels checkin flow
 */
function cancel() { document.location.href = "taskbar.html" }

/**
 * TODO
 */
todayTask.addEventListener('click', (event) => {
    target = event.target;
    console.log(target.innerText);
    if (target.innerText == 'Delete') {
        targetParent = target.parentNode;
        targetParent.style.display = 'none';
        targetParent.firstElementChild.value = '';
    }
});