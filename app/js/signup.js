const { dialog } = require('electron').remote;

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

const signUpBtn = document.getElementById('signUpBtn');

signUpBtn.addEventListener('click', () => {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const password_rpt = document.getElementById('password_rpt').value;
  console.log(email);
  console.log(password);
  console.log(password_rpt);
  if (password.localeCompare(password_rpt) === 0) {
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
