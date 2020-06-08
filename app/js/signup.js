const { dialog } = require('electron').remote;
const { firebaseConfig } = require('./js/common.js');

/* global firebase */

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const signUpBtn = document.getElementById('signUpBtn');

signUpBtn.addEventListener('click', () => {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const password_rpt = document.getElementById('password_rpt').value;
  console.log(email);
  console.log(password);
  console.log(password_rpt);
  if (password.localeCompare(password_rpt) == 0) {
    firebase.auth().createUserWithEmailAndPassword(email, password).then((user) => {
      dialog.showMessageBox({
        title: 'Message',
        message: 'User created successfully! Logging in.',
      });
      console.log(user.user.uid);
      localStorage.setItem('userid', user.user.uid);
      document.location.href = 'taskbar.html';
    }).catch((error) => {
      // Handle errors
      dialog.showMessageBox({
        type: 'error',
        title: 'Error',
        message: error.message,
      });
      console.log(error);
    });
  } else {
    dialog.showMessageBox({
      type: 'error',
      title: 'Error',
      message: 'Password does not match.',
    });
    console.log('Password does not match.');
  }
});
