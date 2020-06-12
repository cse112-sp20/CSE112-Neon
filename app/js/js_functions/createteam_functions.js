/**
 * Creates a new team and creates a new thermometer for a given teamname
 * @param {string} uid: user ID
 * @param {*}       db: database reference
 */
function createTeam(uid, db) {
  console.log('Clicked');
  const teamName = document.getElementById('teamName').value;
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
}

/**
 * Cancels create team flow
 */
function cancel() { document.location.href = 'taskbar.html'; }

module.exports = { cancel, createTeam };
