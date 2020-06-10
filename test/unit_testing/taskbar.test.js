const sinon = require('sinon');
const fs = require('fs');
const { expect, assert } = require('chai');
const LocalStorageMock = require('./testing_modules/localStorageMock');
var module = require('../../app/js/js_functions/taskbar_functions.js');

const {
  onStatusChange,
  leaveTeam,
  logout,
  addTeamMember,
  addStatusListener,
  checkThermometer,
  getTeam,
  checkStatus,
  initTaskbar,
  checkTeams, } = module;

let html;
const jsdom = require('jsdom');
const { JSDOM } = jsdom;

/** Import and use firestore mock **/
const MockFirebase = require('mock-cloud-firestore');
const firebase = new MockFirebase();
const firestore = firebase.firestore();
const uname = 'testing';
const team = 'testing_team';
const uid = 'odkSxashOmg9QeyRL2cRs00Jke12';

fs.readFile(`${__dirname}/../../app/taskbar.html`, 'utf8', async (err, data) => {
  describe('#taskbar_functions', function() {
    before( () => {
      html = data;
      const dom = new JSDOM(html);
      global.document = dom.window.document;

      memberSpy = sinon.spy(module, 'addTeamMember');
      statusSpy = sinon.spy(module, 'onStatusChange');
      initTaskbarSpy = sinon.spy(module, 'initTaskbar');
      checkStatusSpy = sinon.spy(module, 'checkStatus');
      checkTeamsSpy  = sinon.spy(module, 'checkTeams');
      checkThermometerSpy = sinon.spy(module, 'checkThermometer');
    });
    describe('#addTeamMember', function() {
      let statusList;
      let nameList;
      let nameElem;
      let statusElem;

      before( () => {
        module.addTeamMember(uname, 'Online');
        statusList = document.getElementById('status_list');
        nameList = document.getElementById('name_list');
        nameElem = document.getElementById('name_testing');
        statusElem = document.getElementById('status_testing');
      }); 
      it('addTeamMember is called once', () => {
        expect(memberSpy.calledOnce).to.equal(true);
      });
      it('addTeamMember is called with correct param', () => {
        expect(memberSpy.calledWith(uname, 'Online')).to.equal(true);
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
    describe('#onStatusChange', () => {
      let statusElem;
      before( () => {
        module.onStatusChange(uname, 'Offline');
        statusElem = document.getElementById('status_testing');
      });
      it('onStatusChange is called once', () => {
        expect(statusSpy.calledOnce).to.equal(true);
      });
      it('onStatusChange is called with correct param', () => {
        expect(statusSpy.calledWith(uname, 'Offline')).to.equal(true);
      });
      it('should change the status to offline', () => {
        setTimeout(() => {
          assert.equal(statusElem.innerHTML, '😴');
        }, 500);
      });
    });  
    describe('#initTaskbar create user', () => {
      before( () => {
        module.initTaskbar(uname, uid, firestore);
      });
      it('initTaskbar is called with correct param', () => {
        expect(initTaskbarSpy.calledWith(uname, uid, firestore)).to.equal(true);
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
        module.initTaskbar(uname, uid, firestore);
      });
      it('initTaskbar is called with correct param', () => {
        expect(initTaskbarSpy.calledWith(uname, uid, firestore)).to.equal(true);
      });
      it('should update the current user profile', () => {
        firestore.collection('users').doc(uid).get().then((doc) => {
          expect(doc.exists).to.equal(true);
          let data = doc.data();
          expect(data['displayName']).to.equal('testing');
          expect(data['userStatus']).to.equal('Online');
        });
      });
    });
    describe('#checkStatus', () => {
      let startFlowButton;
      let endFlowButton;
      before( () => {
        firestore.collection('teams').doc(team).collection(uid).doc('status').set({
          checkedIn : true, task1 : "", task2 : "", task3 : "", taskStatus: 0,
        });
        module.checkStatus(firestore, uid, team);
        startFlowButton = document.getElementById('startFlowButton');
        endFlowButton = document.getElementById('endFlowButton');
      });
      it('checkStatus is called with correct param', () => {
        expect(checkStatusSpy.calledWith(firestore, uid, team)).to.equal(true);
      });
      it('should update the style of buttons when checked in', () =>{
        expect(startFlowButton).to.not.equal(null);
        expect(endFlowButton).to.not.equal(null);
        expect(startFlowButton.style.display).to.equal('none');
        expect(endFlowButton.style.display).to.equal('block');
      });
    });
    describe('#checkTeams exists', () => {
      let teamExistsDiv;
      let teamDiv;
      before( () => {
        firestore.collection('teams').doc(team).set({
          'odkSxashOmg9QeyRL2cRs00Jke12': true,
        });
        firestore.collection('thermometers').doc(team).set({
          'progress': 0,
        });
        module.checkTeams(firestore, uid);
        teamExistsDiv = document.getElementById('teamExistsDiv');
        teamDiv = document.getElementById('teamName');
      });
      it('checkTeams is called with correct param', () => {
        expect(checkTeamsSpy.calledWith(firestore, uid)).to.equal(true);
      });
      it('team name should appear on UI', () => {
        expect(teamExistsDiv.style.display).to.equal('block');
        expect(teamDiv.innerHTML).to.equal(team);
      });
    });
    describe('#checkTeams not exists', () => {
      let teamNoneDiv;
      before( () => {
        module.checkTeams(firestore, "non-exist-uid");
        teamNoneDiv = document.getElementById('teamNoneDiv');
      });
      it('checkTeams is called with correct param', () => {
        expect(checkTeamsSpy.calledWith(firestore, uid)).to.equal(true);
      });
      it('team-none should appear on UI', () => {
        expect(teamNoneDiv.style.display).to.equal('block');
      });
    });
  });
});