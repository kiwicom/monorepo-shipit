// @flow strict-local

/* eslint-disable no-console */

import os from 'os';
import fs from 'fs';
import path from 'path';
import { invariant } from '@kiwicom/js';

import PhaseRunner from './PhaseRunner';
import OSSPackages from '../../../open-source';

// TODO: fail on errors (see: https://gitlab.skypicker.com/incubator/universe/-/jobs/4646614)

// TODO: we could (should) eventually keep the temp directory, cache it and just update it
const tmpdir = fs.mkdtempSync(path.join(os.tmpdir(), 'kiwicom-shipit-'));
console.warn(tmpdir);

for (const [, config] of OSSPackages.entries()) {
  const match = config.publicRepo.match(/\/(?<localDirectory>.+)\.git/);
  const localDirectory = match?.groups?.localDirectory;
  invariant(localDirectory != null, 'Cannot resolve local directory.');

  new PhaseRunner({
    sourceURL: config.publicRepo,
    sourceRoots: new Set([config.privatePath]),
    destinationPath: path.join(tmpdir, localDirectory),
  }).run();
}
