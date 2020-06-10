const Application = require('spectron').Application
const assert = require('assert')
const electronPath = require('electron') // Require Electron from the binaries included in node_modules.
const path = require('path')

const sleep = time => new Promise(r => setTimeout(r, time));

describe('Integration Testing will now start!', async function(){
  this.timeout(1000000)

  describe('Join Team Functionality', async function(){
    before(async function () {
      try {
        this.app = await new Application({
          path: electronPath,
          args: [path.join(__dirname, '../..')]
        });
        await this.app.start();
        await sleep(2000);
        await this.app.client.click('#signInBtnFake');
        //await this.app.client.waitUntilWindowLoaded(10000);
        await sleep(2000);
      } catch(e) {
        throw new Error("Spectron random error, please try again");
      }
      try {
        await this.app.client.click('#leaveTeamButton');
      } catch (e) {
      }
    })
    after(async function () {
      await this.app.stop();
    })

    it('tests joinTeam cancel', async function () {
      //await this.app.client.click('#signInBtnFake');
      //await this.app.client.waitUntilWindowLoaded(10000);
      await sleep(2000);
      await this.app.client.click('#joinTeamButton');
      //await this.app.client.waitUntilWindowLoaded(10000);
      await sleep(2000);
      await this.app.client.setValue('#teamName', 'testTeam');
      await this.app.client.click('#cancelBtn');
      //await this.app.client.waitUntilWindowLoaded(10000);
      await sleep(2000);
    })

    it('tests joinTeam join', async function () {
      //await this.app.client.click('#signInBtnFake');
      //await this.app.client.waitUntilWindowLoaded(10000);
      await sleep(2000);
      await this.app.client.click('#joinTeamButton');
      //await this.app.client.waitUntilWindowLoaded(10000);
      await sleep(2000);
      await this.app.client.setValue('#teamName', 'testTeam');
      await this.app.client.click('#joinBtn');
      //await this.app.client.waitUntilWindowLoaded(10000);
      await sleep(2000);
    })
  });

});
