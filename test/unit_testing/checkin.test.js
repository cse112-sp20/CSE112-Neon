var sinon = require('sinon')
var fs = require('fs');
var expect = require('chai').expect;
const LocalStorageMock = require('./testing_modules/localStorageMock');
var module = require('../../app/js/js_functions/checkin_functions');
var {startFlow,addTask,checkPrevTask,checkTeams} = module;
var html;
const jsdom = require('jsdom')
const {JSDOM} = jsdom;

fs.readFile(__dirname+ '/../../app/checkin.html', 'utf8', async function(err,data){
	html = data;
	const dom = new JSDOM(html);
        global.document = dom.window.document;
	
    document.getElementById("Task1").value = "This Test Better Work!";
	checkstub = sinon.stub(module,'startFlow');
	checkstub();
	addSpy = sinon.spy(module,'addTask');
	ptDiv = document.getElementById('prevTask');
	module.addTask(ptDiv,'This is a test for addTask');
	describe('#addTask()', function() {
		it('addTask is called once', function(){
			expect(addSpy.calledOnce).to.equal(true);
		});
		it('addTask is called with correct arguments',function(){
			expect(addSpy.calledWith(ptDiv,'This is a test for addTask')).to.equal(true);
		});
		it('addTask adds an element into the list', () => {
		   const before_html = ptDiv.innerHTML;
		   addSpy(ptDiv,  'Testing for addTask');
		   const after_html = ptDiv.innerHTML;
		   expect(before_html).to.not.equal(after_html);
		});
		/*
		it('addTask adds a task element into the list',function(){
			var expectedTask =  '<li>'+'<input style="display: inline-block;" value="This is a test for addTask">'
            +'<button class="bt">Add</button>'
            +'<button class="bt">Delete</button>'+'</li>';
			expect((ptDiv.innerHTML.substring(46,251)).trim()).to.equal(expectedTask);
		});*/
	});
});
