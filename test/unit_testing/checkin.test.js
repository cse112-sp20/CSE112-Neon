const sinon = require('sinon');
const fs = require('fs');
const { expect } = require('chai');
const LocalStorageMock = require('./testing_modules/localStorageMock');
const { firebase, firestore, uid } = require('./testing_modules/firebaseMock');

var module = require('../../app/js/js_functions/checkin_functions');
const {
  startFlow, addTask, checkPrevTask, checkTeams, getTeamName, getTeamNameDb
} = module;
let html;
const jsdom = require('jsdom');

const { JSDOM } = jsdom;


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
    	it('getTeamName is called exactly once', () => {
    	    var spyCurr = sinon.spy(module, 'getTeamName');
            module.getTeamName(firestore, uid[0]);
            expect(spyCurr.calledOnce).to.equal(true);
		});
	});
  });
});
