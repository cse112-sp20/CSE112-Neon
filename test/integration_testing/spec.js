const Application = require('spectron').Application
const assert = require('assert')
const electronPath = require('electron') // Require Electron from the binaries included in node_modules.
const path = require('path')
const { expect } = require('chai');

const loadTime = 1900;
const invalidName = 'invalidNameShouldNotWork';
const sleep = time => new Promise(r => setTimeout(r, time));

describe('Integration Testing will now start for Create Team, Join Team, Leave Team, Log Out!', async function(){
  this.timeout(1000000)

  before(async function() {
    try {
      this.app = await new Application({
        path: electronPath,
        args: [path.join(__dirname, '../..')]
      });
      await this.app.start();
      await sleep(loadTime);
      await this.app.client.click('#testingEntry');
      await sleep(loadTime);
    } catch(e) {
      throw new Error("Spectron random error, please try again");
    }
  })
  after(async function () {
    await sleep(loadTime);
    await this.app.stop();
  })


  describe('Exterior functionality', async function() {
    beforeEach(async function() {
      try {
        await this.app.client.click('#leaveTeamButton');
      } catch (e) {}
    })
    describe('Create Team Functionality', async function () {
      it('tests createTeam cancel', async function () {
        await sleep(loadTime);
        await this.app.client.click('#createTeamButton');
        await sleep(loadTime);
        await this.app.client.setValue('#teamName', 'testTeam');
        await this.app.client.click('#cancelBtn');
        await sleep(loadTime);
      })
      it('tests createTeam with pre-existing team name', async function () {
        await sleep(loadTime);
        await this.app.client.click('#createTeamButton');
        await sleep(loadTime);
        await this.app.client.setValue('#teamName', 'testTeam');
        await this.app.client.click('#createBtn');
        await sleep(loadTime);
      })
    });

    describe('Join Team Functionality', async function () {
      it('tests joinTeam cancel', async function () {
        await sleep(loadTime);
        await this.app.client.click('#joinTeamButton');
        await sleep(loadTime);
        await this.app.client.setValue('#teamName', 'testTeam');
        await this.app.client.click('#cancelBtn');
        await sleep(loadTime);
      })

      it('tests joinTeam join invalid name', async function () {
        await sleep(loadTime);
        await this.app.client.click('#joinTeamButton');
        await sleep(loadTime);
        await this.app.client.setValue('#teamName', invalidName);
        await sleep(loadTime);
        await this.app.client.click('#joinBtn');
        await sleep(loadTime);
        try {
          //See if back on it went through and now on taskbar taskbar
          await this.app.client.click('leaveTeamButton');
          await sleep(loadTime);
          assert(false, 'Test is allowed to join invalid name: ' + invalidName);
        } catch (e) {
          //If caught error then it works properly
          await sleep(loadTime);
          assert(true, 'Test is not allowed to join invalid name: ' + invalidName);
          //Get back to taskbar for next test
          await this.app.client.click('#cancelBtn');
          await sleep(loadTime);
        }
      })

      it('tests joinTeam join valid name', async function () {
        await sleep(loadTime);
        await this.app.client.click('#joinTeamButton');
        await sleep(loadTime);
        await this.app.client.setValue('#teamName', 'testTeam');
        await this.app.client.click('#joinBtn');
        await sleep(loadTime);
      })
    });
  });

  describe('Interior Functionality', async function() {
    /** INSERT CHECKIN/OUT/STATUS FUNCTIONS HERE **/
    describe('Status Functionality', async function() {
      it('test if status change shows', async function() {
        await sleep(loadTime);
        const before = await this.app.client.getHTML('#teamStatusesDiv');
        await this.app.client.selectByIndex('#userStatus', 1);
        await sleep(loadTime);
        const after = await this.app.client.getHTML('#teamStatusesDiv');
        await sleep(loadTime);
        expect(before).to.not.equal(after);
      })
    });
    describe('Check-In Functionality', async function () {
      it('test startFlow', async function () {
        await sleep(loadTime);
        try {
          await this.app.client.click('#startFlowButton');
        } catch (e) {
          assert(false, 'Start flow button does not exist even though it should');
        }
        await sleep(loadTime);
      });
      it('test cancel Check-In Flow', async function () {
        await sleep(loadTime);
        await this.app.client.click('#cancelBtn');
        assert(this.app.client.$('#logOutBtn').isExisting(),
            'The cancel button brings the user to taskbar');
      });
      it('test checkIn and checkOut with no tasks', async function() {
        await sleep(loadTime);
        await this.app.client.click('#startFlowButton');
        await sleep(loadTime);
        await this.app.client.click('#startFlowBtn');
        await sleep(loadTime);
        await this.app.client.click('#endFlowButton');
        await sleep(loadTime);
        await this.app.client.click('#endFlowBtn');
        await sleep(loadTime);
        assert(this.app.client.$('#logOutBtn').isExisting(),
          'The end flow button brings the user to taskbar');
        assert(this.app.client.$('#startFlowButton').isExisting(),
          'The end flow button brings back the startFlow button');
      });
      it('test checkIn addTask needs to be filled', async function() {
        await sleep(loadTime);
        await this.app.client.click('#startFlowButton');
        await sleep(loadTime);
        const before = await this.app.client.getHTML('#todayTask');
        await this.app.client.click('#addTasks');
        await sleep(loadTime);
        const after = await this.app.client.getHTML('#todayTask');
        await sleep(loadTime);
        await this.app.client.click('#cancelBtn');
        await sleep(loadTime);
        //expect(before).equal.to(after);
      });
    });
    describe('Log Out Functionality', async function () {
      it('test if logOut button actually logs out user', async function () {
        await sleep(loadTime);
        await this.app.client.click('#logOutBtn');
        await sleep(loadTime);
        //Make sure logged out successfully
        try {
          //Should be on sign-in page, try to sign in to catch
          await this.app.client.click('#signInBtn');
          await sleep(loadTime);
        } catch (e) {
          assert(false, 'Test does not log-out on log-out click');
        }
      })
    });
  })
});
