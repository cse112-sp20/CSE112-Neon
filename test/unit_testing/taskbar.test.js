var module = require('../../app/js/js_functions/taskbar_functions.js');
const sinon = require('sinon');
const fs = require('fs');
const { expect } = require('chai');
const jsdom = require('jsdom');

const { JSDOM } = jsdom;
let memberList;
let memberName;
let memberStatus;
let nameList;
let statusElem;
let addTeamMemberSpy;
let onStatusChangeSpy;

fs.readFile(`${__dirname}/../../app/taskbar.html`, 'utf8', async (err, data) => {
   

    describe('#taskbar_functions',() => {
        before(() => {
            html = data;
            const dom = new JSDOM(html);
            global.document = dom.window.document;
        
            addTeamMemberSpy = sinon.spy(module,'addTeamMember');
            onStatusChangeSpy = sinon.spy(module,'onStatusChange');
            memberName = 'mN';
            memberStatus = 'Offline';
            module.addTeamMember(memberName,memberStatus);
            nameList = document.getElementById('name_list');
            module.onStatusChange(memberName,memberStatus);
            statusElem = document.getElementById('status_mN');
        });

        describe('#addTeamMember',() => {
            
            it('addTeamMember is called once', () => {
                expect(addTeamMemberSpy.calledOnce).to.equal(true);
            });
            it('addTeamMember is called with correct arguments', () => {
                expect(addTeamMemberSpy.calledWith(memberName,memberStatus)).to.equal(true);
            });
            it('addTeamMember creates the correct memberList', () => {
                addTeamMemberSpy(memberName,memberStatus);
                const nameList = document.getElementById('name_list');
                const once = nameList.childElementCount;
                addTeamMemberSpy(memberName,memberStatus);
                const twice = nameList.childElementCount; 
                expect(twice).to.equal(once+1);
            });
        });

        describe('#onStatusChange',() => {
           
            it('onStatusChange is called once', () => {
                expect(onStatusChangeSpy.calledOnce).to.equal(true);
            });
            it('onStatusChange is called with correct arguments', () => {
                expect(onStatusChangeSpy.calledWith(memberName,memberStatus)).to.equal(true);
            });
            
        });
    
    });

});
