const sinon = require('sinon');
const fs = require('fs');
const { expect } = require('chai');
const LocalStorageMock = require('./testing_modules/localStorageMock');
var module = require('../../app/js/js_functions/checkin_functions');

const {
  startFlow, addTask, checkPrevTask, checkTeams,
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
  console.log(ptDiv.innerHTML);
  addSpy(ptDiv, 'This test');
  console.log(ptDiv.innerHTML);
  addSpy(ptDiv, 'This is a test for addTask');
  describe('#addTask()', () => {
    it('addTask is called once', () => {
      expect(addSpy.called).to.equal(true);
    });
  	it('addTask changes HTML elements ', () => {
  		const before_html = ptDiv.innerHTML;
  		addSpy(ptDiv,  'Testing for addTask');
  		const after_html = ptDiv.innerHTML;
  		expect(before_html).to.not.equal(after_html);
  	});
  });
  // checkstub().expects('startFlow').atLeast(1);
});
