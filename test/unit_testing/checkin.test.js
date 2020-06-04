var sinon = require('sinon')
var fs = require('fs');
var expect = require('chai').expect;
const LocalStorageMock = require('./testing_modules/localStorageMock');
var module = require('../../app/js/js_functions/checkin_functions');
var {startFlow,addTask,checkPrevTask,checkTeams} = module;
var html;


/*
global.localStorage = new LocalStorageMock;
global.localStorage.setItem('userid', 'odkSxashOmg9QeyRL2cRs00Jke12');
	/*
var firebaseConfig = {
    apiKey: "AIzaSyBmn_tDSlm4lLdrvSqj8Yb00KkYae8cL-Y",
    authDomain: "neon-pulse-development.firebaseapp.com",
    databaseURL: "https://neon-pulse-development.firebaseio.com",
    projectId: "neon-pulse-development",
    storageBucket: "neon-pulse-development.appspot.com",
    messagingSenderId: "240091062123",
    appId: "1:240091062123:web:babe11f5f03ced38fbb62e",
    measurementId: "G-VMS6JL8H4S"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
var db = firebase.firestore();
var uid = 'odkSxashOmg9QeyRL2cRs00Jke12';
//localStorage.setItem('userid', 'odkSxashOmg9QeyRL2cRs00Jke12');
var teamName = "neon";*/
const jsdom = require('jsdom')
const {JSDOM} = jsdom;

fs.readFile(__dirname+ '/../../app/checkin.html', 'utf8', async function(err,data){
	html = data;
	const dom = new JSDOM(html);
        global.document = dom.window.document;
	
    document.getElementById("Task1").value = "This Test Better Work!";
	checkstub = sinon.stub(module,'startFlow');
	checkstub();
	addSpy = sinon.spy(module,'addTask');
	ptDiv = document.getElementById('prevTask');
	addSpy(ptDiv,'This is a test for addTask');
	describe('#addTask()', function() {
		it('addTask is called once', function(){
			expect(addSpy.called).to.equal(true)
		});
	});
	//checkstub().expects('startFlow').atLeast(1);
});
