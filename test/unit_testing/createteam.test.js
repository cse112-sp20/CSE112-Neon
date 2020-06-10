const sinon = require('sinon');
const fs = require('fs');
const { expect, assert } = require('chai');
const LocalStorageMock = require('./testing_modules/localStorageMock');
var module = require('../../app/js/js_functions/createteam_functions.js');

const { createTeam, cancel } = module;

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

fs.readFile(`${__dirname}/../../app/createteam.html`, 'utf8', async (err, data) => {
  describe('#createteam functions', () => {
    before( () => {
      html = data;
      const dom = new JSDOM(html);
      global.document = dom.window.document;

      createSpy = sinon.spy(module, 'createTeam');
      cancelSpy = sinon.spy(module, 'cancel');
    });
    describe('#create team', () => {
      let teamName;
      before( () => {
        consoleStub = sinon.stub(console, 'log');
        errStub = sinon.stub(console, 'error');
        firestore.collection('users').doc(uid).set({ 
          'displayName': uname,
          'userStatus': 'Online',
          'team': ''
        });
        teamName = document.getElementById('teamName');
        teamName.value = team;
        module.createTeam(uid, firestore);
      });
      after( () => {
        consoleStub.restore();
        errStub.restore();
        createSpy.resetHistory();
      });
      it('createTeam is called once', () => {
        expect(createSpy.calledOnce).to.equal(true);
      });
      it('createTeam is called with correct param', () => {
        expect(createSpy.calledWith(uid, firestore)).to.equal(true);
      });
      it('should create a team with given name', () => {
        firestore.collection('teams').doc(team).get().then((doc) => {
          expect(doc.exists).to.equal(true);
        });
      });
      it('should add the user to the team', () => {
        firestore.collection('users').doc(uid).get().then((doc) => {
          const data = doc.data();
          expect(data['team']).to.equal('testing_team');
        });
      });
      it('should create a new thermometer for the team', () => {
        firestore.collection('thermometers').doc(team).get().then((doc) => {
          expect(doc.exists).to.equal(true);
        });
      });
    });
    describe('#cancel', () => {
      it('cancel is called once', () => {
        try{ module.cancel(); }
        catch(TypeError) { expect(cancelSpy.calledOnce).to.equal(true); }
      });
    });
  });
});