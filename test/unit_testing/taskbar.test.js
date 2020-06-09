const sinon = require('sinon');
const fs = require('fs');
const { expect, assert } = require('chai');
const LocalStorageMock = require('./testing_modules/localStorageMock');
var module = require('../../app/js/js_functions/taskbar_functions.js');

const { onStatusChange, addTeamMember, checkTeams } = module;

let html;
const jsdom = require('jsdom');
const { JSDOM } = jsdom;

/** Import and use firestore mock **/
const MockFirebase = require('mock-cloud-firestore');
const firebase = new MockFirebase();
const firestore = firebase.firestore();
const uid = 'odkSxashOmg9QeyRL2cRs00Jke12';

fs.readFile(`${__dirname}/../../app/taskbar.html`, 'utf8', async (err, data) => {
  html = data;
  const dom = new JSDOM(html);
  global.document = dom.window.document;
  describe('#taskbar_functions', () => {
    describe('#1.onStatusChange', () => {
      let teamStatusesDiv = document.getElementById('teamStatusesDiv');
      let statusElem = document.createElement('DIV');
      statusElem.id = 'status_testing';
      teamStatusesDiv.appendChild(statusElem);
      statusSpy = sinon.spy(module, 'onStatusChange');
      module.onStatusChange('testing', 'Offline');
      it('onStatusChange is called once', () => {
        expect(addSpy.calledOnce).to.equal(true);
      });
      it('onStatusChange is called with correct param', () => {
        expect(addSpy.calledWith('testing', 'Offline')).to.equal(true);
      });
      it('The status changes to offline', () => {
        assert.equal(statusElem.innerHTML, '😴');
      });
    });
    describe('#2.addTeamMember', () => {
      let teamStatusesDiv = document.getElementById('teamStatusesDiv');
      memberSpy = sinon.spy(module, 'addTeamMember');
      module.addTeamMember('testing', 'Online');
      let nameList = document.getElementById('name_list');
      let nameElem = document.getElementById('name_testing');
      let statusList = document.getElementById('status_list');
      let statusElem = document.getElementById('status_testing');
      it('addTeamMember is called once', () => {
        expect(addSpy.calledOnce).to.equal(true);
      });
      it('addTeamMember is called with correct param', () => {
        expect(addSpy.calledWith('testing', 'Online')).to.equal(true);
      });
      it('Team list should be created', () => {
        assert.notEqual(nameList, null);
      });
      it('Member should be added to the list', () => {
        assert.notEqual(nameElem, null);
        assert.equal(nameElem.innerHTML, 'testing');
      });
      it('Status list should be created', () => {
        assert.notEqual(statusList, null);
      });
      it('Status should be added to the list', () => {
        assert.notEqual(statusElem, null);
        assert.equal(statusElem.innerHTML, '😀');
      });
    });
  });
});