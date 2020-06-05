const dialog = require('electron').remote;

const errorMessage = 'An error occurred when trying to find your team, returning to main page.';
let teamName;


/* a dictionary to check if any button is clicked */
const dict = {};
const c = 'completedBtn';
const k = 'keepBtn';
const s = 'sosBtn';
const b = 'blockedBtn';
let j;
for (j = 1; j <= 3; j += 1) {
  dict[j] = {};
  dict[j][c] = 1;
  dict[j][k] = 1;
  dict[j][s] = 1;
  dict[j][b] = 1;
}
const colors = {};
colors[c] = '#7FFF00';
colors[k] = '#00B4AB';
colors[s] = '#FFD832';
colors[b] = 'red';

/**
 * set the color of a row of button to the desired
 * @param {*} btn
 * @param {*} color
 * @param {*} i
 */
function setColor(btn, color, i) {
  const keys = Object.keys(dict[i]);
  for (let n = 0; n < keys.length; n += 1) {
    const property = document.getElementById(keys[n] + i.toString());
    if (keys[n] === btn) {
      if (dict[i][btn] === 0) {
        property.style.backgroundColor = '#FFFFFF';
        dict[i][btn] = 1;
      } else {
        property.style.backgroundColor = color;
        dict[i][btn] = 0;
      }
    } else {
      property.style.backgroundColor = '#FFFFFF';
      dict[i][keys[n]] = 1;
    }
  }
}
for (j = 1; j <= 3; j += 1) {
  setColor(c, '#7FFF00', j);
}

/**
 * create a list of goals that user saved in check-in
 * @param {*} goal
 * @param {integer} n
 */
function createGoalList(goal, n) {
  // Assigning the attributes
  const id = n.toString();
  const form = document.getElementById(`line${id}`);
  const label = document.createElement('label');
  const labelId = `task${id}`;
  const con = document.getElementById(`container${id}`);

  // appending the created text to
  // the created label tag
  const s = '';
  label.appendChild(document.createTextNode(goal + s));
  label.id = labelId;


  document.getElementById(`h${id}`).style.display = 'block';

  con.style.position = 'absolute';
  con.style.right = '0';
  con.style.display = 'inline-block';

  // appending label to div
  form.appendChild(label);
  form.appendChild(con);
}

/**
 * TODO
 */
function updateGoal(db, uid) {
  let n = 1;
  const goalText = document.getElementById('goalText');
  const docRef = db.collection('teams').doc(teamName).collection(uid).doc('status');
  docRef.get()
    .then((doc) => {
      if (doc.exists) {
        goalText.style.display = 'none';
        let id = `task${n.toString()}`;
        const data = doc.data();
        while (id in data && data[id] !== '') {
          createGoalList(data[id], n);
          n += 1;
          id = `task${n.toString()}`;
        }
        if (n === 1) {
          goalText.innerHTML = 'No Task Set For The Day!';
          goalText.style.display = 'block';
        }
      } else {
        console.error('Error getting data');
      }
    })
    .catch((error) => {
      console.error('Error getting data: ', error);
      // document.location.href = 'taskbar.html'
    });
}

/**
 * Checks which team a particular user is currently in
 * @param {string} uid
 * @param {*} db
 */
function checkTeams(uid, db) {
  db.collection('teams').where(uid, '==', true)
    .get()
    .then((querySnapshot) => {
      console.log(querySnapshot.docs);
      if (querySnapshot.docs.length > 0) {
        querySnapshot.forEach((doc) => {
          teamName = doc.id;
          updateGoal(db, uid, teamName);
        });
      } else {
        dialog.showMessageBox({
          type: 'error',
          title: 'Error',
          message: errorMessage,
        });
        console.log('Team not found');
        // document.location.href = 'taskbar.html'
      }
    })
    .catch((error) => {
      console.log('Error getting documents: ', error);
      // document.location.href = 'taskbar.html'
    });
}

/**
 * After thermometer is updated Firebase db is updated with the completed statuses
 */
function handleEndFlow(db, uid) {
  const docRef = db.collection('teams').doc(teamName).collection(uid).doc('status');
  // initialize the things to be pushed
  const obj = {
    checkedIn: false,
  };
  for (let i = 1; i < 4; i += 1) {
    const id = i.toString();
    const taskId = `task${id}`;
    const taskStatus = `taskStatus${id}`;
    const element = document.getElementById(taskId);
    if (element != null) {
      const t = element.textContent;

      obj[taskStatus] = 0;
      // TODO: THERE IS NO K OR S WHAT IS THIS??????????????????????????
      // if (dict[i][k] == 0) obj[taskStatus] = 1;
      // else if (dict[i][s] == 0) obj[taskStatus] = 2;
      // else if (dict[i][b] == 0) obj[taskStatus] = 3;

      if (obj[taskStatus] === 0) obj[taskId] = '';
      else obj[taskId] = t;
    } else {
      obj[taskId] = '';
    }
  }
  docRef.set(obj)
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
      // document.location.href = 'taskbar.html'
    });
}

/**
 * Updates thermometer with completed tasks
 */
function updateThermometer(db, uid) {
  console.log(dict);
  const line1 = document.getElementById('h1');
  const line2 = document.getElementById('h2');
  const line3 = document.getElementById('h3');
  let line1Valid = false;
  let line2Valid = false;
  let line3Valid = false;
  if (window.getComputedStyle(line1).display === 'block') line1Valid = true;
  if (window.getComputedStyle(line2).display === 'block') line2Valid = true;
  if (window.getComputedStyle(line3).display === 'block') line3Valid = true;
  let tasksCompleted = 0;
  if (line1Valid) {
    if (dict[1].completedBtn === 0) tasksCompleted += 1;
    else console.log('Task 1 not completed');
  }
  if (line2Valid) {
    if (dict[2].completedBtn === 0) tasksCompleted += 1;
    else console.log('Task 2 not completed');
  }
  if (line3Valid) {
    if (dict[3].completedBtn === 0) tasksCompleted += 1;
  }
  console.log(tasksCompleted);
  console.log(teamName);
  db.collection('thermometers').doc(teamName)
    .get()
    .then((querySnapshot) => {
      let timeDiff = (new Date()).getTime() - querySnapshot.data().lastEpoch;
      timeDiff = Math.round(timeDiff / 1000);
      console.log(timeDiff);
      const day = 24 * 60 * 60;
      const newDay = new Date();
      newDay.setHours(0);
      newDay.setMinutes(0);
      newDay.setSeconds(0);
      if (timeDiff > day) {
        db.collection('thermometers').doc(teamName).set({
          progress: (tasksCompleted * 10),
          lastEpoch: newDay.getTime(),
        }).then(() => {
          console.log('Document written');
          handleEndFlow(db, uid);
        })
          .catch((err) => {
            console.log(err);
            handleEndFlow(db, uid);
          });
      } else {
        let currProgress = querySnapshot.data().progress;
        currProgress += (tasksCompleted * 10);
        db.collection('thermometers').doc(teamName).set({
          progress: currProgress,
          lastEpoch: querySnapshot.data().lastEpoch,
        }).then(() => {
          console.log('Document written');
          handleEndFlow(db, uid);
        })
          .catch((err) => {
            console.log(err);
            handleEndFlow(db, uid);
          });
      }
    })
    .catch((error) => {
      console.log('Error getting documents: ', error);
      handleEndFlow(db, uid);
    });
}

/**
 * Starts endflow
 * @param {*} db
 * @param {string} uid
 */
function endFlow(db, uid) {
  updateThermometer(db, uid);
}

/**
 * Cancels checkout flow
 */
function cancel() { document.location.href = 'taskbar.html'; }

module.exports = {
  checkTeams, createGoalList, updateGoal, endFlow, updateThermometer, cancel,
};
