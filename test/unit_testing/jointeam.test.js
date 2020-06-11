const sinon = require('sinon');
const fs = require('fs');
const { expect } = require('chai');

let html;
const jsdom = require('jsdom');
const { JSDOM } = jsdom;

const MockFirebase = require('mock-cloud-firestore');
const firebase = new MockFirebase();
const firestore = firebase.firestore();
const uname = 'testing';
const team = 'testing_team';
const uid = 'odkSxashOmg9QeyRL2cRs00Jke12';

var module = require('../../app/js/js_functions/jointeam_functions.js');

fs.readFile(`${__dirname}/../../app/jointeam.html`, 'utf8', async (err, data) => {
    describe('#jointeam_functions', () => {
        before( () => {
            html = data;
            const dom = new JSDOM(html);
            global.document = dom.window.document;
            cancelSpy = sinon.spy(module, 'cancel');
            joinTeamSpy = sinon.spy(module, 'joinTeam');
        });
        describe('#cancel()', () => {
            let redirect = false;
            before( () => {
                try{ module.cancel(); }
                catch(TypeError) { redirect = true; }
            });
            it('cancel is called once', () => {
                expect(cancelSpy.calledOnce).to.equal(true);
            });
            it('cancel is called with correct arguments', () => {
                expect(cancelSpy.calledWith()).to.equal(true);
            });
            it('cancel should redirect the page', () => {
                expect(redirect).to.equal(true);
            });
        });
        describe('#joinTeam not exist', () => {
            const dialog = {
                called: false,
                showMessageBox: function(opt) { this.called = true; }
            }
            before( () => {
                module.joinTeam(team, firestore, uid, dialog);
            });
            after( () => {
                joinTeamSpy.resetHistory();
            });
             it('joinTeam is called exactly once', () => {
                expect(joinTeamSpy.calledOnce).to.equal(true);
            });
            it('joinTeam is called with correct arguments', () => {
                expect(joinTeamSpy.calledWith(team, firestore, uid, dialog)).to.equal(true);
            });
            it('should prompt error when team not exists', () => {
                expect(dialog['called']).to.equal(true);
            });
        });
        describe('#joinTeam exists', () => {
            const dialog = {
                called: false,
                showMessageBox: function(opt) { this.called = true; }
            }
            before( () => {
                errStub = sinon.stub(console, 'error');
                firestore.collection('users').doc(uid).set({ 
                  'displayName': uname,
                  'userStatus': 'Online',
                  'team': ''
                });
                firestore.collection('teams').doc(team).set({
                    'uid1': true,
                    'uid2': true
                });
                module.joinTeam(team, firestore, uid, dialog);
            });
            after( () => {
                errStub.restore();
                joinTeamSpy.resetHistory();
            });
            it('joinTeam is called exactly once', () => {
                expect(joinTeamSpy.calledOnce).to.equal(true);
            });
            it('joinTeam is called with correct arguments', () => {
                expect(joinTeamSpy.calledWith(team, firestore, uid, dialog)).to.equal(true);
            });
            it('User should join the team', () => {
                firestore.collection('users').doc(uid).get().then((doc) => {
                  const data = doc.data();
                  expect(data['team']).to.equal('testing_team');
                });
            });
            it('The team should add the user as a member', () => {
                firestore.collection('teams').doc(team).get().then((doc) => {
                    const data = doc.data();
                    expect(data[uid]).to.equal(true);
                });
            });
        });
    });
});
  