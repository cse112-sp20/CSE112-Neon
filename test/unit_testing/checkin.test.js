const sinon = require('sinon');
const fs = require('fs');
const { expect } = require('chai');
const LocalStorageMock = require('./testing_modules/localStorageMock');
var module = require('../../app/js/js_functions/checkin_functions');

const {
  startFlow, addTask, checkPrevTask, checkTeams, getTeamName,failGetTeamName,dialog
} = module;
let html;
const jsdom = require('jsdom');

const { JSDOM } = jsdom;

/** Import and use firestore mock **/
const MockFirebase = require('mock-cloud-firestore');
const firebase = new MockFirebase();
const firestore = firebase.firestore();
const uid = 'odkSxashOmg9QeyRL2cRs00Jke12';



fs.readFile(`${__dirname}/../../app/checkin.html`, 'utf8', async (err, data) => {
  describe('#checkin_functions', () => {
    before (() => {
      html = data;
      const dom = new JSDOM(html);
      global.document = dom.window.document;
      addSpy = sinon.spy(module, 'addTask');
      spyCurr = sinon.spy(module, 'getTeamName');
      failGetTeamNameSpy = sinon.stub(module,'failGetTeamName');
      checkTeamsSpy = sinon.spy(module,'checkTeams');
      checkPrevTaskSpy = sinon.spy(module,'checkPrevTask');
      startFlowSpy = sinon.spy(module, 'startFlow');
    })
    describe('#addTask()', () => {
      let ptDiv;
      before(() => {
        ptDiv = document.getElementById('prevTask');
        document.getElementById('Task1').value = 'This Test Better Work!';
        module.addTask(ptDiv, 'This is a test for addTask');
      })

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
        module.getTeamName(firestore,uid);
      });
      it('getTeamName is called exactly once', () => {
        expect(spyCurr.calledOnce).to.equal(true);
      });
      it('getTeamName is called with correct param',() => {
        expect(spyCurr.calledWith(firestore,uid)).to.equal(true);
      })
      it('getTeamName gets the team name',() => {
        module.getTeamName(firestore,uid).then(res => {
          expect(res).to.equal('Neon');
        });
      });

    });

    describe('#failGetTeamName',() => {
      before(() => {
        module.failGetTeamName();
      });
      it('failGetTeamName is called exactly once', () => {
        expect(failGetTeamNameSpy.calledOnce).to.equal(true);
      });
      it('failGetTeamName is called with correct param',() => {
        expect(failGetTeamNameSpy.calledWith()).to.equal(true);
      });
    });

    describe('#checkTeams',() => {
      before(() => {
        firestore.collection('teams').doc('Neon').collection(uid).doc('status')
            .set({checkedIn : "false", task1 : "Test Task", task2 : "", task3 : "", taskStatus1 : 1  });
        module.checkTeams(firestore,uid)
      });
      it('checkTeams is called exactly once', () => {
        expect(checkTeamsSpy.calledOnce).to.equal(true);
      });
      it('checkTeams is called with correct param',() => {
        expect(checkTeamsSpy.calledWith(firestore, uid)).to.equal(true);
      });
      it('check teams checks if the member is in a team or not', async() => {
        const res = await checkTeams(firestore,uid);
        expect(res).to.equal('Get');
      });
    });

    describe('#checkPrevTask', () => {
      before(() => {
        firestore.collection('teams').doc('Neon').collection(uid).doc('status')
            .set({checkedIn : "false", task1 : "prev1", task2 : "prev2", task3 : "", taskStatus1 : 1  });
        module.checkPrevTask(firestore,uid);
      });
      it('checkPrevTask is called exactly once', () => {
        expect(checkPrevTaskSpy.calledOnce).to.equal(true);
      });
      it('checkPrevTask is called with correct param',() => {
        expect(checkPrevTaskSpy.calledWith(firestore, uid)).to.equal(true);
      });
      it('checkPrevTask gets prev unfinished task with correct values',() => {
        checkPrevTask(firestore,uid).then((res) => {
          expect(res.task1).to.equal("prev1");
          expect(res.task2).to.equal("prev2");
        });
      });
    });

    describe('#startFlow', () => {
      before(() => {
        firestore.collection('teams').doc('Neon').collection(uid).doc('status')
            .set({checkedIn : "false", task1 : "prev1", task2 : "prev2", task3 : "", taskStatus1 : 1  });
        module.startFlow(firestore,uid,'a','b','c');
      });
      it('startFlow is called exactly once', () => {
        expect(startFlowSpy.calledOnce).to.equal(true);
      });
      it('startFlow is called with correct param',() => {
        expect(startFlowSpy.calledWith(firestore, uid,'a','b','c')).to.equal(true);
      });
      it('startFlow starts the flow with correct tasks', () => {
        startFlow(firestore,uid,'a','b','c')
            .then((obj) => {
              firestore.collection('teams').doc('Neon').collection(uid).doc('status')
                  .get().then((res) => {
                let data = res.data();
                expect(data.task1).to.equal('a');
                expect(data.task2).to.equal('b');
                expect(data.task3).to.equal('c');
              });
            });
      });
    });
  });
});