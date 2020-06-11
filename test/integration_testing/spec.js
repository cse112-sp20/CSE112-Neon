const Application = require('spectron').Application
const assert = require('assert')
const electronPath = require('electron') // Require Electron from the binaries included in node_modules.
const path = require('path')
const { expect } = require('chai');

const loadTime = 2500;
const invalidName = 'invalidNameShouldNotWork';

const waitUntil = time => new Promise(r => setTimeout(r, time));
async function sleep() {
  try {
    await this.app.client.waitUntilWindowLoaded(3500);
  } catch(e) {}
  await waitUntil(2500);
}

describe('Integration Testing will now start for Create Team, Join Team, Leave Team, Log Out!', async function(){
  this.timeout(1000000)

  before(async function() {
    try {
      this.app = await new Application({
        path: electronPath,
        args: [path.join(__dirname, '../..')]
      });
      await sleep();
      await this.app.start();
      await sleep();
      await this.app.client.click('#testingEntry');
      await sleep();
    } catch(e) {
      throw new Error("Spectron random error, please try again");
    }
  })
  after(async function () {
    await sleep();
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
        await sleep();
        await this.app.client.click('#createTeamButton');
        await sleep();
        await this.app.client.setValue('#teamName', 'testTeam');
        await this.app.client.click('#cancelBtn');
        await sleep();
      })
      it('tests createTeam with pre-existing team name', async function () {
        await sleep();
        await this.app.client.click('#createTeamButton');
        await sleep();
        await this.app.client.setValue('#teamName', 'testTeam');
        await this.app.client.click('#createBtn');
        await sleep();
      })
    });

    describe('Join Team Functionality', async function () {
      it('tests joinTeam cancel', async function () {
        await sleep();
        await this.app.client.click('#joinTeamButton');
        await sleep();
        await this.app.client.setValue('#teamName', 'testTeam');
        await this.app.client.click('#cancelBtn');
        await sleep();
      })

      it('tests joinTeam join invalid name', async function () {
        await sleep();
        await this.app.client.click('#joinTeamButton');
        await sleep();
        await this.app.client.setValue('#teamName', invalidName);
        await sleep();
        await this.app.client.click('#joinBtn');
        await sleep();
        try {
          //See if back on it went through and now on taskbar taskbar
          await this.app.client.click('leaveTeamButton');
          await sleep();
          assert(false, 'Test is allowed to join invalid name: ' + invalidName);
        } catch (e) {
          //If caught error then it works properly
          await sleep();
          assert(true, 'Test is not allowed to join invalid name: ' + invalidName);
          //Get back to taskbar for next test
          await this.app.client.click('#cancelBtn');
          await sleep();
        }
      })

      it('tests joinTeam join valid name', async function () {
        await sleep();
        await this.app.client.click('#joinTeamButton');
        await sleep();
        await this.app.client.setValue('#teamName', 'testTeam');
        await this.app.client.click('#joinBtn');
        await sleep();
      })
    });
  });

  describe('Interior Functionality', async function() {
    /** INSERT CHECKIN/OUT/STATUS FUNCTIONS HERE **/
    describe('Status Functionality', async function() {
      it('test if status change shows', async function() {
        await sleep();
        const before = await this.app.client.getHTML('#teamStatusesDiv');
        await this.app.client.selectByIndex('#userStatus', 1);
        await sleep();
        const after = await this.app.client.getHTML('#teamStatusesDiv');
        await sleep();
        expect(before).to.not.equal(after);
      })
    });
    describe('Check-In Functionality', async function () {
      it('test startFlow', async function () {
        await sleep();
        try {
          await this.app.client.click('#startFlowButton');
        } catch (e) {
          assert(false, 'Start flow button does not exist even though it should');
        }
        await sleep();
      });
      it('test cancel Check-In Flow', async function () {
        await sleep();
        await this.app.client.click('#cancelBtn');
        assert(this.app.client.$('#logOutBtn').isExisting(),
            'The cancel button brings the user to taskbar');
      });
      it('test checkIn and checkOut with no tasks', async function() {
        await sleep();
        await this.app.client.click('#startFlowButton');
        await sleep();
        await this.app.client.click('#startFlowBtn');
        await sleep();
        await this.app.client.click('#endFlowButton');
        await sleep();
        await this.app.client.click('#endFlowBtn');
        await sleep();
        /*
        assert(this.app.client.$('#logOutBtn').isExisting(),
          'The end flow button brings the user to taskbar');
        assert(this.app.client.$('#startFlowButton').isExisting(),
          'The end flow button brings back the startFlow button');
         */
      });
      it('test checkIn addTask needs to be filled', async function() {
        await sleep();
        await this.app.client.click('#startFlowButton');
        await sleep();
        //const before = await this.app.client.getHTML('#todayTask');
        await this.app.client.click('#addTasks');
        await sleep();
        //const after = await this.app.client.getHTML('#todayTask');
        await sleep();
        await this.app.client.click('#cancelBtn');
        await sleep();
        //expect(before).equal.to(after);
      });
    });
    describe('Log Out Functionality', async function () {
      it('test if logOut button actually logs out user', async function () {
        await sleep();
        await this.app.client.click('#logOutBtn');
        await sleep();
        //Make sure logged out successfully
        try {
          //Should be on sign-in page, try to sign in to catch
          await this.app.client.click('#signInBtn');
          await sleep();
        } catch (e) {
          assert(false, 'Test does not log-out on log-out click');
        }
      })
    });
  })
});
