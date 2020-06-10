const sinon = require('sinon');
const fs = require('fs');
const { expect } = require('chai');
const { JSDOM } = require('jsdom');

var module = require('../../app/js/js_functions/checkout_functions.js');
const {
    setColor, setListener, createGoalList, cancel,
} = module;


let html;
let dom;
let setColorSpy;
let createGoalListSpy;
let setListenerSpy;
let cancelStub;
let task1;
let completedBtn1;


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
    });

});