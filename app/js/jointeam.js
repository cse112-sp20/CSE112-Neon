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
const db = firebase.firestore();
const uid = localStorage.getItem('userid');

var joinTeamButton = document.getElementById("joinBtn")
joinTeamButton.addEventListener("click", function() {
    var teamName = document.getElementById("teamName").value;
    console.log("Clicked")
    console.log(teamName)
    db.collection("teams").doc(teamName)
        .get()
        .then(function(querySnapshot) {
            console.log(querySnapshot)
            console.log(querySnapshot.data())
            var obj = querySnapshot.data()
            if (obj) {
                console.log("Team exists")
                //Join team
                db.collection("users").doc(uid).update({ "team": teamName}) 
                obj[uid] = true
                db.collection("teams").doc(teamName).set(obj)
                    .then(function() {
                        console.log(uid + " joined team " + teamName);
                        document.location.href = "taskbar.html"
                    })
                    .catch(function(error) {
                        console.error("Error adding document: ", error);
                    })
            } else {
                dialog.showMessageBox({
                    type: 'error',
                    title: 'Error',
                    message: "Team does not exist."
                });
            }
        })
        .catch(function(error) {
            console.log(error)
        })
})


var cancelButton = document.getElementById("cancelBtn")
cancelButton.addEventListener("click", () => cancel())
function cancel() { document.location.href = "taskbar.html" }
