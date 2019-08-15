/* eslint-env jest */

import path from 'path';
import fakeDialog from 'spectron-fake-dialog';
import { makeTestingApp, startApps, stopApps, resetApps } from './helpers';
import { dataDir } from '../paths';

let app;

const longPause = 750;
const mediumPause = 500;

const clickAnyway = async (_app, _selector) => {
  await _app.client.execute((selector) => {
    window.document.querySelector(selector).click();
  }, _selector);
};

const setup = async () => {
  app = makeTestingApp('Network-Canvas');
  await fakeDialog.apply(app);
  await startApps(app);
  await resetApps(app);
};

const teardown = async () => {
  await stopApps(app);
};

describe('Start screen', () => {
  beforeAll(setup);
  afterAll(teardown);

  it('on first load it shows no protocols installed', async () => {
    await app.client.isVisible('.getting-started');
  });

  it('can load a protocol from disk', async () => {
    const mockProtocolPath = path.join(dataDir, 'mock.netcanvas');
    const mockFilenames = [mockProtocolPath];

    await fakeDialog.mock([{ method: 'showOpenDialog', value: mockFilenames }]);
    await app.client.isVisible('.getting-started');
    await app.client.click('[name=add-a-protocol]');
    await app.client.waitForVisible('.protocol-import-dialog__tabs');
    await app.client.click('.tab=Local file');
    await app.client.waitForVisible('h4=Protocol imported successfully!');
    await app.client.click('button=Continue');
    await app.client.pause(mediumPause);
    await app.client.click('button.overlay__close');
    await app.client.pause(mediumPause);
  });

  it('can reset state', async () => {
    await app.client.click('svg[name=settings]');
    await app.client.pause(mediumPause);

    await app.client.waitForVisible('#reset-all-nc-data');
    await app.client.moveToObject('#reset-all-nc-data'); // for added realism, as we click using dom
    await clickAnyway(app, '#reset-all-nc-data');
    await app.client.pause(mediumPause);
    await app.client.click('button=Continue');
  });
});