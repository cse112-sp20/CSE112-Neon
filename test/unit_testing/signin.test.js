const sinon = require('sinon');
const fs = require('fs');
const { expect, assert } = require('chai');
const LocalStorageMock = require('./testing_modules/localStorageMock');
var module = require('../../app/js/js_functions/signin_functions.js');

const { guidVal } = module;

let html;
const jsdom = require('jsdom');
const { JSDOM } = jsdom;

const MockFirebase = require('mock-cloud-firestore');
const firebase = new MockFirebase();
const firestore = firebase.firestore();
const uname = 'testing';
const team = 'testing_team';
const uid = 'odkSxashOmg9QeyRL2cRs00Jke12';

fs.readFile(`${__dirname}/../../app/signin.html`, 'utf8', async (err, data) => {
  describe('#signin functions', () => {
    before( () => {
      guidSpy = sinon.spy(module, 'guidVal');
    });
    describe('#guidVal', () => {
      let val1; 
      let val2;
      before( () => {
        val1 = module.guidVal();
        val2 = module.guidVal();
      });
      it('guidVal is called exacly twice', () => {
        expect(guidSpy.calledTwice).to.equal(true);
      });
      it('should generate different values', () => {
        expect(val1).to.not.equal(val2);
      });
      it('both values match the pattern', () => {
        let regexp = /^[a-z0-9]{8}-[a-z0-9]{4}-[a-z0-9]{4}$/
        expect(regexp.test(val1)).to.equal(true);
        expect(regexp.test(val2)).to.equal(true);
      });
    });
  });
});