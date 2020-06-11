const sinon = require('sinon');
const fs = require('fs');
const { expect } = require('chai');
const { JSDOM } = require('jsdom');

const MockFirebase = require('mock-cloud-firestore');
const firebase = new MockFirebase();
const firestore = firebase.firestore();

var module = require('../../app/js/js_functions/jointeam_functions.js');

fs.readFile(`${__dirname}/../../app/jointeam.html`, 'utf8', async (err, data) => {
    html = data;
    const dom = new JSDOM(html);
    global.document = dom.window.document;

    
    cancelStub = sinon.stub(module, 'cancel');
    cancelStub();

    joinTeamStub = sinon.stub(module, 'joinTeam');
    joinTeamStub();

    describe('#jointeam_functions', () => {
        describe('#cancel()', () => {
        it('cancel is called once', () => {
            expect(cancelStub.calledOnce).to.equal(true);
        });
        it('cancel is called with correct arguments', () => {
            expect(cancelStub.calledWith()).to.equal(true);
        });
        });
       describe('#joinTeam', () => {

            it('joinTeam is called exactly once', () => {
                expect(joinTeamStub.calledOnce).to.equal(true);
            });

        });
    });
});
  