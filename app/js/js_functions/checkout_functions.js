/**
 * Checks which team a particular user is currently in
 * @param {string} uid 
 * @param {*} db 
 */
function checkTeams(uid, db) {

    db.collection("teams").where(uid, "==", true)
        .get()
        .then(function(querySnapshot) {
            console.log(querySnapshot.docs)
            if (querySnapshot.docs.length > 0) {
                querySnapshot.forEach(function(doc) {
                    teamName = doc.id
                });
                updateGoal(db, uid)
            } else {

                dialog.showMessageBox({
                    type: 'error',
                    title: 'Error',
                    message: errorMessage
                });
                console.log("Team not found")
                    //document.location.href = 'taskbar.html'
            }
        })
        .catch(function(error) {
            console.log("Error getting documents: ", error);
            //document.location.href = 'taskbar.html'
        });
}

/**
 * create a list of goals that user saved in check-in
 * @param {*} goal 
 * @param {*} n 
 */
function createGoalList(goal, n) {

    // Assigning the attributes
    var id = n.toString();
    var form = document.getElementById("line" + id);
    var label = document.createElement('label');
    var labelId = "task" + id;
    var con = document.getElementById('container' + id);


    // appending the created text to
    // the created label tag
    var s = "";
    label.appendChild(document.createTextNode(goal + s));
    label.id = labelId;


    document.getElementById('h' + id).style.display = "block"

    con.style.position = "absolute";
    con.style.right = "0";
    con.style.display = "inline-block";

    // appending label to div
    form.appendChild(label);
    form.appendChild(con);
}

let taskNum = 1;

/**
 * TODO
 */
function updateGoal(db, uid) {
    var n = 1;
    var goalText = document.getElementById("goalText");
    var docRef = db.collection("teams").doc(teamName).collection(uid).doc("status")
    docRef.get()
        .then(function(doc) {
            if (doc.exists) {
                goalText.style.display = "none";
                var id = "task" + n.toString();
                var data = doc.data()
                while (id in data & data[id] != "") {

                    createGoalList(data[id], n);
                    n++;
                    taskNum++;
                    id = "task" + n.toString();
                }
                if (n == 1) {
                    goalText.innerHTML = "No Task Set For The Day!"
                    goalText.style.display = "block";
                }

            } else {
                console.error("Error getting data");
            }
        })
        .catch(function(error) {
            console.error("Error getting data: ", error);
            //document.location.href = 'taskbar.html'
        });
}

/**
 * Starts endflow
 * @param {*} db 
 * @param {string} uid 
 */
function endFlow(db, uid) {
    updateThermometer(db, uid)
}

/**
 * After thermometer is updated Firebase db is updated with the completed statuses
 */
function handleEndFlow(db, uid) {
    var docRef = db.collection("teams")
    .doc(teamName)
    .collection(uid)
    .doc("status")
        //initialize the things to be pushed
    var obj = {
        checkedIn: false,
    }
    for (i = 1; i < 4; i++) {
        var id = i.toString();
        var taskId = "task" + id;
        var taskStatus = "taskStatus" + id;
        var element = document.getElementById(taskId);
        if (element != null) {
            var t = element.textContent;

            // obj[taskId] = t;
            obj[taskStatus] = 0;
            if (dict[i][k] == 0)
                obj[taskStatus] = 1;
            else if (dict[i][s] == 0)
                obj[taskStatus] = 2;
            else if (dict[i][b] == 0)
                obj[taskStatus] = 3;

            if (obj[taskStatus] == 0)
                obj[taskId] = "";
            else
                obj[taskId] = t;
        } else {
            obj[taskId] = "";
        }

    }
    docRef.set(obj)
        .then(function() {
            console.log("Document written");
            document.location.href = 'taskbar.html'
        })
        .catch(function(error) {
            dialog.showMessageBox({
                type: 'error',
                title: 'Error',
                message: error.message
            });
            console.error("Error adding document: ", error);
            //document.location.href = 'taskbar.html'
        });
}

/**
 * Updates thermometer with completed tasks
 */
function updateThermometer(db, uid) {
    const line1 = document.getElementById("h1")
    const line2 = document.getElementById("h2")
    const line3 = document.getElementById("h3")
    var line1Valid = false,
        line2Valid = false,
        line3Valid = false
    if (window.getComputedStyle(line1).display === "block")
        line1Valid = true
    if (window.getComputedStyle(line2).display === "block")
        line2Valid = true
    if (window.getComputedStyle(line3).display === "block")
        line3Valid = true
    var tasksCompleted = 0
    if (line1Valid) {
        if (dict[1]["completedBtn"] == 0)
            tasksCompleted++
            else
                console.log("Task 1 not completed")
    }
    if (line2Valid) {
        if (dict[2]["completedBtn"] == 0)
            tasksCompleted++
            else
                console.log("Task 2 not completed")
    }
    if (line3Valid) {
        if (dict[3]["completedBtn"] == 0)
            tasksCompleted++
    }
    console.log(tasksCompleted)
    console.log(teamName)
    db.collection("thermometers").doc(teamName)
        .get()
        .then(function(querySnapshot) {
            var timeDiff = (new Date()).getTime() - querySnapshot.data().lastEpoch
            timeDiff = Math.round(timeDiff / 1000)
            console.log(timeDiff)
            var day = 24 * 60 * 60
            var newDay = new Date()
            newDay.setHours(0)
            newDay.setMinutes(0)
            newDay.setSeconds(0)
            if (timeDiff > day) {
                db.collection("thermometers").doc(teamName).set({
                    progress: (tasksCompleted * 10),
                    lastEpoch: newDay.getTime()
                }).then(function() {
                    console.log("Document written")
                    handleEndFlow(db, uid)
                }).catch(function(err) {
                    console.log(err)
                    handleEndFlow(db, uid)
                })
            } else {
                var currProgress = querySnapshot.data().progress
                currProgress += (tasksCompleted * 10)
                db.collection("thermometers").doc(teamName).set({
                    "progress": currProgress,
                    "lastEpoch": querySnapshot.data().lastEpoch
                }).then(function() {
                    console.log("Document written")
                    handleEndFlow(db, uid)
                }).catch(function(err) {
                    console.log(err)
                    handleEndFlow(db, uid)
                })
            }
        })
        .catch(function(error) {
            console.log("Error getting documents: ", error);
            handleEndFlow(db, uid)
        });
}

/**
 * Cancels checkout flow
 */
function cancel() { document.location.href = "taskbar.html" }

module.exports = { checkTeams, createGoalList, updateGoal, endFlow, updateThermometer, cancel };