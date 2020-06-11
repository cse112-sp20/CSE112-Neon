

/**
 * Cancel join team flow
 */
function cancel() { document.location.href = 'taskbar.html'; }

/**
 * Logic for joining a team, checks if team exists then adds current user to the team.
 */
function joinTeam(db, uid, dialog) {
  const teamName = document.getElementById('teamName').value;
  db.collection('teams').doc(teamName)
    .get()
    .then((querySnapshot) => {
      const obj = querySnapshot.data();
      if (obj) {
        // Join team
        db.collection('users').doc(uid).update({ team: teamName });
        obj[uid] = true;
        db.collection('teams').doc(teamName).set(obj)
          .then(() => {
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
}

module.exports = { cancel, joinTeam };
