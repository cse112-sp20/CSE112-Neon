const Application = require('spectron').Application
const assert = require('assert')
const electronPath = require('electron') // Require Electron from the binaries included in node_modules.
const path = require('path')
const { expect } = require('chai');

/* Time allocated to loading, if action is not performed by this time there is a failure */
const loadTime = 4000;
/* Time to wait after each action, solely for user, tests run without this wait*/
const userViewTime = 400;
const invalidName = 'invalidNameShouldNotWork';

const app = new Application({
  path: electronPath,
  args: [path.join(__dirname, '../..')]
});

const waitUntil = time => new Promise(ex => setTimeout(ex, time));

async function waitUntilAction(action) {
  await app.client.waitUntil(async () => {
    try {
      await action();
      return true;
    } catch(e) {
      return false;
    }
  }, {timeout:loadTime});
  await waitUntil(userViewTime);
}

describe('Integration Testing will now start for Create Team, Join Team, Leave Team, Log Out!', async function(){
  this.timeout(1000000)

  before(async function() {
    await waitUntil(loadTime);
    await app.start();
    await waitUntilAction(async () => {app.client.click('#testingEntry')});
  })
  after(async function () {
    await waitUntil(loadTime);
    await app.stop();
  })


  describe('Exterior functionality', async function() {
    beforeEach(async function() {
      try {
        await waitUntilAction(async () => {app.client.click('#leaveTeamButton')});
      //Here it is okay if it can't click the leaveTeamButton, some cases require this
      } catch(e) {}
    })
    describe('Create Team Functionality', async function () {
      it('tests createTeam cancel', async function () {
        await waitUntilAction(async () => {app.client.click('#createTeamButton')});
        await waitUntilAction(async () => {app.client.setValue('#teamName', 'testTeam')})
        await waitUntilAction(async () => {app.client.click('#cancelBtn')});
      })
      it('tests createTeam with pre-existing team name', async function () {
        await waitUntilAction(async () => {app.client.click('#createTeamButton')});
        await waitUntilAction(async () => {app.client.setValue('#teamName', 'testTeam')});
        await waitUntilAction(async () => {app.client.click('#createBtn')});
      })
    });

    describe('Join Team Functionality', async function () {
      it('tests joinTeam cancel', async function () {
        await waitUntilAction(async () => {app.client.click('#joinTeamButton')});
        await waitUntilAction(async () => {app.client.setValue('#teamName', 'testTeam')});
        await waitUntilAction(async () => {app.client.click('#cancelBtn')});
      })

      it('tests joinTeam join invalid name', async function () {
        await waitUntilAction(async () => {app.client.click('#joinTeamButton')});
        await waitUntilAction(async () => {app.client.setValue('#teamName', invalidName)});
        await waitUntilAction(async () => {app.client.click('#joinBtn')});

        try {
          //See if back on it went through and now on taskbar taskbar
          await waitUntilAction(async () => {app.client.click('leaveTeamButton')});
          await assert(false, 'Test is allowed to join invalid name: ' + invalidName);
        } catch (e) {
          //If caught error then it works properly
          await assert(true, 'Test is not allowed to join invalid name: ' + invalidName);
          //Get back to taskbar for next test
          await waitUntilAction(async () => {app.client.click('#cancelBtn')});
        }
      })

      it('tests joinTeam join valid name', async function () {
        await waitUntilAction(async () => {app.client.click('#joinTeamButton')});
        await waitUntilAction(async () => {app.client.setValue('#teamName', 'testTeam')});
        await waitUntilAction(async () => {app.client.click('#joinBtn')});
      })
    });
  });
  describe('Interior Functionality', async function() {
    /** INSERT CHECKIN/OUT/STATUS FUNCTIONS HERE **/
    /*
    describe('Status Functionality', async function() {
      it('test if status change shows', async function() {
        await waitUntilAction(async () => {before = await app.client.getHTML('#teamStatusesDiv')});
        await waitUntilAction(async () => {app.client.selectByIndex('#userStatus', 1)});
        await sleep();
        await waitUntilAction(async () => {after = await app.client.getHTML('#teamStatusesDiv')});

        await expect(before).to.not.equal(after);
      })
    });
     */
    /*
    describe('Check-In Functionality', async function () {
      it('test startFlow', async function () {
        await sleep();
        try {
          await app.client.click('#startFlowButton');
        } catch (e) {
          assert(false, 'Start flow button does not exist even though it should');
        }
        await sleep();
      });
      it('test cancel Check-In Flow', async function () {
        await sleep();
        await app.client.click('#cancelBtn');
        assert(app.client.$('#logOutBtn').isExisting(),
            'The cancel button brings the user to taskbar');
      });
      it('test checkIn and checkOut with no tasks', async function() {
        await sleep();
        await app.client.click('#startFlowButton');
        await sleep();
        await app.client.click('#startFlowBtn');
        await sleep();
        await app.client.click('#endFlowButton');
        await sleep();
        await app.client.click('#endFlowBtn');
        await sleep();
        assert(app.client.$('#logOutBtn').isExisting(),
          'The end flow button brings the user to taskbar');
        assert(app.client.$('#startFlowButton').isExisting(),
          'The end flow button brings back the startFlow button');
      });
      it('test checkIn addTask needs to be filled', async function() {
        await sleep();
        await app.client.click('#startFlowButton');
        await sleep();
        //const before = await app.client.getHTML('#todayTask');
        await app.client.click('#addTasks');
        await sleep();
        //const after = await app.client.getHTML('#todayTask');
        await sleep();
        await app.client.click('#cancelBtn');
        await sleep();
        //expect(before).equal.to(after);
      });
    });
     */
    describe('Log Out Functionality', async function () {
      it('test if logOut button actually logs out user', async function () {
        await waitUntilAction(async () => {app.client.click('#logOutBtn')});

        //Make sure logged out successfully
        try {
          //Should be on sign-in page, try to sign in to catch
          await waitUntilAction(async () => {app.client.click('#signInBtn')});

        } catch (e) {
          await assert(false, 'Test does not log-out on log-out click');
        }
      })
    });
  })
});
