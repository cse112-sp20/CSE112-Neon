const Application = require('spectron').Application
const assert = require('assert')
const electronPath = require('electron') // Require Electron from the binaries included in node_modules.
const path = require('path')

const load_time = 1200;
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
        await sleep(load_time);
        await this.app.client.click('#signInBtnFake');
        await sleep(load_time);
      } catch(e) {
        throw new Error("Spectron random error, please try again");
      }
      try {
        await this.app.client.click('#leaveTeamButton');
      } catch (e) {
      }
    })
    after(async function () {
      await sleep(load_time);
      await this.app.stop();
    })

    it('tests joinTeam cancel', async function () {
      await sleep(load_time);
      await this.app.client.click('#joinTeamButton');
      await sleep(load_time);
      await this.app.client.setValue('#teamName', 'testTeam');
      await this.app.client.click('#cancelBtn');
      await sleep(load_time);
    })

    it('tests joinTeam join', async function () {
      await sleep(load_time);
      await this.app.client.click('#joinTeamButton');
      await sleep(load_time);
      await this.app.client.setValue('#teamName', 'testTeam');
      await this.app.client.click('#joinBtn');
      await sleep(load_time);
    })
  });

});
