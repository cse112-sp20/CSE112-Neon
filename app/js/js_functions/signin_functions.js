function guidVal() {
  const s4 = () => Math.floor((1 + Math.random()) * 0x10000)
    .toString(16)
    .substring(1);
    // return id of format 'aaaaaaaa'-'aaaa'-'aaaa'-'aaaa'-'aaaaaaaaaaaa'
  return `${s4() + s4()}-${s4()}-${s4()}`;
}


/**
 * Opens up google sign in page, then continually pings server for response from
 * redirect. Once that redirect response is received then userid, email, and name
 * are retrieved. Then redirects to taskbar.html
 */
function signIn(xhrRef, shell, localStorage) {
  const xhr = xhrRef;
  const guid = guidVal();
  const intervalVar = setInterval(() => {
    const url = `http://localhost:3000/checklogin?guid=${guid}`;
    xhr.open('get', url, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    // Call a function when the state changes.
    xhr.onreadystatechange = function onreadystatechange() {
      if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
        console.log('Response is');
        console.log(xhr.response);
        const response = JSON.parse(xhr.response);
        if (response.guid) {
          console.log('Successfully logged in');
          clearInterval(intervalVar);
          this.setStorage(localStorage, response.uid, response.displayName, response.email);
        }
      }
    };
    xhr.send();
  }, 1000);
  console.log('Signing in');

  const url = `http://localhost:3000/googlesignin.html?guid=${guid}`;
  shell.openExternal(url);
}

/**
 * Helper function that updates local storage and document.
 */
function setStorage(localStorage, uid, displayName, email) {
  localStorage.setItem('userid', uid);
  localStorage.setItem('displayName', displayName);
  localStorage.setItem('email', email);
  document.location.href = 'taskbar.html';
}

module.exports = { guidVal, signIn, setStorage };
