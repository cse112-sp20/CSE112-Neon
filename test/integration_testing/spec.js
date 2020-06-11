const Application = require('spectron').Application
const assert = require('assert')
const electronPath = require('electron') // Require Electron from the binaries included in node_modules.
const path = require('path')

const loadTime = 1500;
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
      await this.app.client.click('#signInBtnFake');
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
  });
  describe('Interior Functionality', async function() {
    /** INSERT CHECKIN/OUT/STATUS FUNCTIONS HERE **/
  })
});
