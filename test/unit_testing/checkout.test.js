const sinon = require('sinon');
const fs = require('fs');
const { expect } = require('chai');
const { JSDOM } = require('jsdom');

var module = require('../../app/js/js_functions/checkout_functions.js');
const {
    setColor, setListener, createGoalList, cancel,
} = module;

const { JSDOM } = jsdom;
/** Import and use firestore mock **/
const MockFirebase = require('mock-cloud-firestore');
const firebase = new MockFirebase();
const firestore = firebase.firestore();
const uid = 'OwkxFmv1k7OnibEQswl8lmNYGPh2';

let html;
let dom;
let setColorSpy;
let createGoalListSpy;
let setListenerSpy;
let cancelStub;
let task1;
let completedBtn1;

const {
    setColor,
    setListener,
    createGoalList,
    cancel,
    updateGoal,
    checkTeams,
    handleEndFlow,
    updateThermometer,
    endFlow,
} = module;


fs.readFile(`${__dirname}/../../app/checkout.html`, 'utf8', async (err, data) => {
    describe('#checkout_functions', () => {
        before(() => {
            html = data;
            dom = new JSDOM(html);
            global.document = dom.window.document;

            setColorSpy = sinon.spy(module, 'setColor');
            createGoalListSpy = sinon.spy(module, 'createGoalList');
            setListenerSpy = sinon.spy(module, 'setListener');
            cancelStub = sinon.stub(module, 'cancel');
            checkTeamsSpy = sinon.spy(module, 'checkTeams');
            updateGoalSpy = sinon.spy(module, 'updateGoal');
            handleEndFlowSpy = sinon.spy(module, 'handleEndFlow');
            endFlowSpy = sinon.spy(module, 'endFlow');

            module.createGoalList("task1", 1);
            module.setListener(1);
            module.setColor('completedBtn', '#7FFF00', 1);

            task1 = document.getElementById('task1');
            completedBtn1 = document.getElementById('completedBtn1');



            cancelStub();
        });

        describe('#createGoalList()', () => {

            it('createGoalList is called once', () => {
                expect(createGoalListSpy.calledOnce).to.equal(true);
            });
            it('createGoalList is called with correct arguments', () => {
                expect(createGoalListSpy.calledWith('task1', 1)).to.equal(true);
            });
            it('createGoalList creates the correct list', () => {
                const text = task1.innerHTML;
                expect(text).to.equal('task1');
            });
        });

        describe('#setColor()', () => {
            it('setColor is called once', () => {
                expect(setColorSpy.calledOnce).to.equal(true);
            });
            it('setColor is called with correct arguments', () => {
                expect(setColorSpy.calledWith('completedBtn', '#7FFF00', 1)).to.equal(true);
            });
            it('setColor sets the correct color for a button', () => {
                const before = completedBtn1.style.backgroundColor;
                setColorSpy('completedBtn', 'red', 1);
                const after = completedBtn1.style.backgroundColor;
                expect(before).to.not.equal(after);
            });
        });

        describe('#setListener()', () => {
            it('setListener is called once', () => {
                expect(setListenerSpy.calledOnce).to.equal(true);
            });
            it('setListener is called with correct arguments', () => {
                expect(setListenerSpy.calledWith(1)).to.equal(true);
            });
            it('setListener sets the correct listeners for the buttons of a specific row', () => {
                /* if the listener is set up properly and the completed button is clicked
                  it will show a green color ('rgb(127, 255, 0)') */
                completedBtn1.click();
                const buttonColor = completedBtn1.style.backgroundColor;
                expect(buttonColor).to.equal('rgb(127, 255, 0)');
            });
        });

        describe('#cancel()', () => {
            it('cancel is called once', () => {
                expect(cancelStub.calledOnce).to.equal(true);
            });
            it('cancel is called with correct arguments', () => {
                expect(cancelStub.calledWith()).to.equal(true);
            });
        });

        describe('#updateGoal()', () => {
            before( () => {
                firestore.collection('teams').doc('Neon').collection(uid).doc('status')
                .set({checkedIn : "false", task1 : "task1", task2 : "", task3 : "", taskStatus1 : 1  });
                module.updateGoal(firestore, uid, 'Neon');
            });
            it('updateGoal is called once', () => {
                expect(updateGoalSpy.calledOnce).to.equal(true);
            });
            it('updateGoal is called with correct arguments', () => {
                expect(updateGoalSpy.calledWith(firestore, uid)).to.equal(true);
            });
            it('updateGoal displays the correct tasks', () => {
                const text = task1.innerHTML;
                expect(text).to.equal('task1');
            });
        });


        describe('#checkTeams()', () => {
            before(() => {
                firestore.collection('teams').doc('Neon').set({
                    'OwkxFmv1k7OnibEQswl8lmNYGPh2' : true,
                })
                module.checkTeams(uid, firestore);

              });
              it('checkTeams is called exactly once', () => {
                expect(checkTeamsSpy.calledOnce).to.equal(true);
              });
              it('checkTeams is called with correct param',() => {
                expect(checkTeamsSpy.calledWith(uid, firestore)).to.equal(true);
              }); 

        });

        describe('#handleEndFlow()', () => {
            before( () => {
                firestore.collection('teams').doc('Neon').collection(uid).doc('status')
                .set({checkedIn : "false", task1 : 'task1', task2 : '', task3 : '', taskStatus : 0  });
                module.handleEndFlow(firestore, uid, 'Neon');    
            });
            it('handleEndFlow is called once', () => {
                expect(handleEndFlowSpy.calledOnce).to.equal(true);
            });
            it('handleEndFlow is called with correct arguments', () => {
                expect(handleEndFlowSpy.calledWith(firestore, uid)).to.equal(true);
            });
            it('handleEndFlow should push the correct values to firestore', () => {
                firestore.collection('teams').doc('Neon').collection(uid).doc('status')
                .get().then((doc)=>{
                    expect(doc.exists).to.equal(true);
                    let data = doc.data();
                    expect(data['task1']).to.equal('');
                    expect(data['task2']).to.equal('');
                    expect(data['task3']).to.equal('');
                    expect(data['taskStatus1']).to.equal(0);
                })

            });
        });
        // describe('#endFlow()', () => {
        //     before( () => {
        //         module.endFlow();
        //     });
        //     it('endFlow is called once', () => {
        //         expect(endFlowSpy.calledOnce).to.equal(true);
        //     });
        //     it('endFlow is called with correct arguments', () => {
        //         expect(endFlowSpy.calledWith()).to.equal(true);
        //     });
        // });
    });

});