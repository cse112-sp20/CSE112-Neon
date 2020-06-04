const { firebaseConfig } = require('./js/common.js');
const regexGUID = /\?guid=([\dA-z]*[-][\dA-z]*[-][\dA-z]*)/;
const guid = window.location.search.match(regexGUID)[1];
console.log(guid);

/** Initialize Firebase */
firebase.initializeApp(firebaseConfig);

const h3 = document.getElementById('loginstatus');

/**
 * Gets redirect result, if there isn't a redirect result then redirects page to Google sign in page. After
 * redirect result is obtained then post to server.
 */
firebase.auth().getRedirectResult().then((result) => {
  if (result.credential) {
    // This gives you a Google Access Token. You can use it to access the Google API.
    const token = result.credential.accessToken;
    // ...
  }
  // The signed-in user info.
  const { user } = result;
  if (!user) {
    const provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithRedirect(provider);
  } else {
    console.log(user);
    console.log(user.displayName);
    const id = {
      displayName: user.displayName,
      email: user.email,
      uid: user.uid,
      guid,
    };
    console.log(id);
    const xhr = new XMLHttpRequest();
    const url = '/registerlogin';
    xhr.open('POST', url, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onreadystatechange = function () { // Call a function when the state changes.
      if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
        const response = JSON.parse(xhr.response);
      }
    };
    xhr.send(JSON.stringify(id));
    h3.innerHTML = 'You have successfully logged in, please return to Neon Pulse.';
  }
}).catch((error) => {
  // Handle Errors here.
  const errorCode = error.code;
  const errorMessage = error.message;
  // The email of the user's account used.
  const { email } = error;
  // The firebase.auth.AuthCredential type that was used.
  const { credential } = error;
  // ...
});
