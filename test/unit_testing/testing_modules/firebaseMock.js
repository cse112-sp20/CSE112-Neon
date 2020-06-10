const MockFirebase = require('mock-cloud-firestore');
const firebase = new MockFirebase();
const firestore = firebase.firestore();

const uid = ['odkSxashOmg9QeyRL2cRs00Jke12'];

/** Insert Standard Testing Firestore Data Here **/
firestore.collection('teams').doc('Neon').collection(uid[0]).doc('status')
    .set({checkedIn : "false", task1 : "Test Task", task2 : "", task3 : "", taskStatus1 : 1  });

module.exports = {firebase, firestore, uid};