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

  describe('#taskbar_functions', function() {
    memberSpy = sinon.spy(module, 'addTeamMember');
    module.addTeamMember('testing', 'Online');
    const statusList = document.getElementById('status_list');
    const nameList = document.getElementById('name_list');
    const nameElem = document.getElementById('name_testing');
    const statusElem = document.getElementById('status_testing');

    describe('#addTeamMember', function() {
      it('addTeamMember is called once', () => {
        expect(memberSpy.calledOnce).to.equal(true);
      });
      it('addTeamMember is called with correct param', () => {
        expect(memberSpy.calledWith('testing', 'Online')).to.equal(true);
      });
      it('should create a team list', () => {
        assert.notEqual(nameList, null);
      });
      it('should add member to team list', () => {
        assert.notEqual(nameElem, null);
        assert.equal(nameElem.innerHTML, 'testing');
      });
      it('should create a status list', () => {
        assert.notEqual(statusList, null);
      });
      it('should status member to status list', () => {
        assert.notEqual(statusElem, null);
        assert.equal(statusElem.innerHTML, '😀');
      });
      it('addTeamMember creates the correct memberList', () => {
        expect(nameList.childElementCount).to.equal(1);
      });
    });
    
    statusSpy = sinon.spy(module, 'onStatusChange');
    module.onStatusChange('testing', 'Offline');
    describe('#onStatusChange', () => {
      it('onStatusChange is called once', () => {
        expect(statusSpy.calledOnce).to.equal(true);
      });
      it('onStatusChange is called with correct param', () => {
        expect(statusSpy.calledWith('testing', 'Offline')).to.equal(true);
      });
      it('should change the status to offline', () => {
        setTimeout(() => {
          assert.equal(statusElem.innerHTML, '😴');
        }, 500);
      });
    });  
    describe('#initTaskbar create user', () => {
      initTaskbarSpy = sinon.spy(module, 'initTaskbar');
      module.initTaskbar('testing', uid, firestore);
      it('initTaskbar is called with correct param', () => {
        expect(initTaskbarSpy.calledWith('testing', uid, firestore)).to.equal(true);
      });
      it('should create a new user profile', () => {
        firestore.collection('users').doc(uid).get().then((doc) => {
          expect(doc.exists).to.equal(true);
          let data = doc.data();
          expect(data['displayName']).to.equal('testing');
          expect(data['userStatus']).to.equal('Online');
        });
      });
    });
    describe('#initTaskbar update user', () => {
      before( () => {
        firestore.collection('users').doc(uid).set({
          displayName: 'testing',
          userStatus: 'Offline',
        });
      });
      it('initTaskbar is called with correct param', () => {
        expect(initTaskbarSpy.calledWith('testing', uid, firestore)).to.equal(true);
      });
      it('should update the current user profile', () => {
        module.initTaskbar('testing', uid, firestore);
        firestore.collection('users').doc(uid).get().then((doc) => {
          expect(doc.exists).to.equal(true);
          let data = doc.data();
          expect(data['displayName']).to.equal('testing');
          expect(data['userStatus']).to.equal('Online');
        });
      });
    });
  });
});