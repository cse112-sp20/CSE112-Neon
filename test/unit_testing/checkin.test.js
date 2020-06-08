const sinon = require('sinon');
const fs = require('fs');
const { expect } = require('chai');
const LocalStorageMock = require('./testing_modules/localStorageMock');
var module = require('../../app/js/js_functions/checkin_functions');

const {
  startFlow, addTask, checkPrevTask, checkTeams, getTeamName, getTeamNameDb
} = module;
let html;
const jsdom = require('jsdom');

const { JSDOM } = jsdom;

/** Import and use firestore mock **/
//const { dialog } = require('electron')
const FirestoreMock = require('firestore-mock');
const firestore = new FirestoreMock();
const uid = 'odkSxashOmg9QeyRL2cRs00Jke12';



fs.readFile(`${__dirname}/../../app/checkin.html`, 'utf8', async (err, data) => {
  html = data;
  const dom = new JSDOM(html);
  global.document = dom.window.document;

  document.getElementById('Task1').value = 'This Test Better Work!';
  checkstub = sinon.stub(module, 'startFlow');
  checkstub();
  addSpy = sinon.spy(module, 'addTask');
  ptDiv = document.getElementById('prevTask');
  module.addTask(ptDiv, 'This is a test for addTask');
  describe('#checkin_functions', () => {
    describe('#addTask()', () => {
      it('addTask is called once', () => {
        expect(addSpy.calledOnce).to.equal(true);
      });
      it('addTask is called with correct arguments', () => {
        expect(addSpy.calledWith(ptDiv, 'This is a test for addTask')).to.equal(true);
      });
      it('addTask adds an element into the list', () => {
        const before_html = ptDiv.innerHTML;
        addSpy(ptDiv, 'Testing for addTask');
        const after_html = ptDiv.innerHTML;
        expect(before_html).to.not.equal(after_html);
      });
    });
    describe('#getTeamName', () => {
        before( () =>
         {
           firestore.collection('teams').doc('Neon').collection(uid).doc('status')
               .set({checkedIn : "false", task1 : "Test Task", task2 : "", task3 : "", taskStatus1 : 1  });
         });
    	it('getTeamName test basic', () => {
    	    var stub = sinon.stub(module, 'getTeamNameDb').callsFake(() => {
    	      //return new Promise(module.getTeamNameDb(firestore, uid));
              //return new Promise(new QuerySnapshot(getTeamNameDb(firestore, uid)));
            });
            console.log(getTeamName(firestore, uid));
		});
	});
  });
});
