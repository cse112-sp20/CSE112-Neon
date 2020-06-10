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
      leaveTeamSpy = sinon.spy(module, 'leaveTeam');
      getTeamSpy = sinon.spy(module, 'getTeam');
      statusListenerSpy = sinon.spy(module, 'addStatusListener');
    });

    describe('#addTeamMember', function() {
      let statusList;
      let nameList;
      let nameElem;
      let statusElem;
      before( () => {
        consoleStub = sinon.stub(console, 'log');
        module.addTeamMember(uname, 'Online');
        statusList = document.getElementById('status_list');
        nameList = document.getElementById('name_list');
        nameElem = document.getElementById('name_testing');
        statusElem = document.getElementById('status_testing');
      }); 
      after( () => {
        consoleStub.restore();
        memberSpy.resetHistory();
      });
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
        module.addTeamMember('testing2', 'Online');
        expect(nameList.childElementCount).to.equal(2);
      });
    });

    describe('#onStatusChange', () => {
      let statusElem;
      before( () => {
        module.onStatusChange(uname, 'Offline');
        statusElem = document.getElementById('status_testing');
      });
      after( () => {
        statusSpy.resetHistory();
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
      after( () => {
        initTaskbarSpy.resetHistory();
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
      after( () => {
        initTaskbarSpy.resetHistory();
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
      after( () => {
        checkStatusSpy.resetHistory();
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
      after( () => {
        checkTeamsSpy.resetHistory();
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
      after( () => {
        checkTeamsSpy.resetHistory();
      });
      it('checkTeams is called with correct param', () => {
        expect(checkTeamsSpy.calledWith(firestore, "non-exist-uid")).to.equal(true);
      });
      it('team-none should appear on UI', () => {
        expect(teamNoneDiv.style.display).to.equal('block');
      });
    });
    describe('#leaveTeam', () => {
      let teamNoneDiv;
      before( () => {
        firestore.collection('teams').doc(team).set({
          'odkSxashOmg9QeyRL2cRs00Jke12': true,
        });
        firestore.collection('thermometers').doc(team).set({
          'progress': 0,
          'lastEpoch': (new Date()).getTime()
        });
        module.checkTeams(firestore, uid);
        module.leaveTeam(firestore, uid);
        teamNoneDiv = document.getElementById("teamNoneDiv")
      });
      it('leaveTeam is called once', () => {
        expect(leaveTeamSpy.calledOnce).to.equal(true);
      })
      it('leaveTeam called with correct param', () => {
        expect(leaveTeamSpy.calledWith(firestore, uid)).to.equal(true);
      })
      it('Team is removed', () => {
        expect(teamNoneDiv.style.display).to.equal('block');
      })
    });
    describe('#getTeam', () => {
      let nameList
      before( () => {
        firestore.collection('users').doc('odkSxashOmg9QeyRL2cRs00Jke13').set({
          displayName: 'testing1',
          userStatus: 'Offline',
          team: 'testing_team'
        });
        firestore.collection('users').doc('odkSxashOmg9QeyRL2cRs00Jke14').set({
          displayName: 'testing2',
          userStatus: 'Offline',
          team: 'testing_team'
        });
        firestore.collection('users').doc('odkSxashOmg9QeyRL2cRs00Jke15').set({
          displayName: 'testing3',
          userStatus: 'Offline',
          team: 'testing_team'
        });
        firestore.collection('thermometers').doc(team).set({
          'progress': 0,
          'lastEpoch': (new Date()).getTime()
        });
        nameList = document.getElementById('name_list');
        nameList.innerHTML = "";
        module.getTeam(firestore, team);
        nameList = document.getElementById('name_list');
      })
      it('getTeam is called once', () => {
        expect(getTeamSpy.calledOnce).to.equal(true);
      })
      it('getTeam is called with the correct params', () => {
        expect(getTeamSpy.calledWith(firestore, team)).to.equal(true);
      })
      it('getTeam gets the appropriate team members', () => {
        expect(nameList.children.length).to.equal(3);
      })
    });
    describe('#checkThermometer', () => {
      let thermometer
      before( () => {
        firestore.collection('teams').doc(team).set({
          'odkSxashOmg9QeyRL2cRs00Jke12': true,
        });
        firestore.collection('thermometers').doc(team).set({
          'progress': 40,
          'lastEpoch': (new Date()).getTime()
        });
        module.checkThermometer(firestore, true)
        thermometer = document.getElementById("thermometer")
      })
      it('checkThermometer is called once', () => {
        expect(checkThermometerSpy.calledOnce).to.equal(true);
      })
      it('checkThermometer is called with the correct params', () => {
        expect(checkThermometerSpy.calledWith(firestore, true)).to.equal(true);
      })
      it('checkThermometer correctly sets thermometer', () => {
        firestore.collection('thermometers').doc(team)
          .onSnapshot((doc) => {
            expect(thermometer.value).to.equal(40);
          })
      })
    });
    describe('#addStatusListener', () => {
      before( () => {
        firestore.collection('users').doc(uid).set({
          displayName: 'testing',
          userStatus: 'Offline',
          team: team
        });
        module.addStatusListener(uid, firestore);
      })
      it('addStatusListener is called once', () => {
        expect(statusListenerSpy.calledOnce).to.equal(true);
      })
      it('addStatusListener is called with the correct params', () => {
        expect(statusListenerSpy.calledWith(uid, firestore)).to.equal(true);
      })
      it('addStatusListener retrieves correct user docs', () => {
        firestore.collection('users').doc(uid).get().then((doc) => {
          expect(doc.exists).to.equal(true);
          let data = doc.data();
          expect(data['displayName']).to.equal('testing');
          expect(data['userStatus']).to.equal('Offline');
        });
      });
    });
  });
});