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
      global.XMLHttpRequest = sinon.useFakeXMLHttpRequest();
      guidSpy = sinon.spy(module, 'guidVal');
      signInSpy = sinon.spy(module, 'signIn');
    });
    describe('#guidVal', () => {
      let val1; 
      let val2;
      before( () => {
        val1 = module.guidVal();
        val2 = module.guidVal();
      });
      after( () => {
        guidSpy.resetHistory();
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
    describe('#signIn', () => {
      const storageMock = new LocalStorageMock();
      const fakeXHR = {
        readyState: 4,
        status: 200,
        response: '',
        open: function(method, url, bool){},
        setRequestHeader: function(header, type) {},
        send: function() {},
        onreadystatechange: function() { console.log("onreadystatechange is called"); }
      };
      const fakeShell = {
        openExternal: function(url) {
          const regexGUID = /\?guid=([\dA-z]*[-][\dA-z]*[-][\dA-z]*)/;
          guid = url.match(regexGUID)[1];
          url = `http://localhost:3000/checklogin?guid=${guid}`;
          const id = {
            displayName: uname,
            email: 'unit@test.com',
            uid: uid,
            guid,
          };
          fakeXHR.response = JSON.stringify(id);
        }
      };
      before( () => {
        consoleStub = sinon.stub(console, 'log');
        module.signIn(fakeXHR, fakeShell, storageMock);
        setTimeout(() => { 
          try {
            fakeXHR.onreadystatechange();
          }
          catch(TypeError){ /* Suppress document.location.href */ }
        }, 1000);
      });
      after(() => {
        consoleStub.restore();
      });
      it('#signIn is called once', () => {
        expect(signInSpy.calledOnce).to.equal(true);
      });
      it('#Check if user info is received and set correctly', () => {
        setTimeout(() => { 
          expect(storageMock.getItem('userid')).to.equal('odkSxashOmg9QeyRL2cRs00Jke12');
          expect(storageMock.getItem('displayName')).to.equal(uname);
          expect(storageMock.getItem('email')).to.equal("unit@test.com");
        }, 1000);
        
      });
    });
  });
});