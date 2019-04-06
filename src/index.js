// @flow strict-local

/* eslint-disable no-console */

import os from 'os';
import fs from 'fs';
import path from 'path';
import { ChildProcess } from '@kiwicom/monorepo';
import { invariant } from '@kiwicom/js';

import Sync from './Sync';
import OSSPackages from '../../../open-source';

// TODO: fail on errors (see: https://gitlab.skypicker.com/incubator/universe/-/jobs/4646614)
// TODO: fix fucked-up packages (where we lost Git history because of multiple roots):
// - src/packages/bc-checker -> src/packages/graphql-bc-checker
// - src/packages/global-id -> src/packages/graphql-global-id
// - src/_graphql-resolve-wrapper -> src/packages/graphql-resolve-wrapper
// - src/packages/npm-publisher -> src/packages/monorepo-npm-publisher
// - vault2env (prolly not fixable, I forgot to import this package with history from the previous repository - no biggie)

// TODO: we could (should) eventually keep the temp directory, cache it and just update it
const tmpdir = fs.mkdtempSync(path.join(os.tmpdir(), 'kiwicom-shipit-'));

console.warn(tmpdir);

for (const [, config] of OSSPackages.entries()) {
  ChildProcess.executeSystemCommand('git', ['clone', config.publicRepo], {
    stdio: 'inherit',
    cwd: tmpdir,
  });

  const match = config.publicRepo.match(/\/(?<localDirectory>.+)\.git/);
  const localDirectory = match?.groups?.localDirectory;
  invariant(localDirectory != null, 'Cannot resolve local directory.');
  const clonedir = path.join(tmpdir, localDirectory);

  ChildProcess.executeSystemCommand(
    'git',
    ['config', 'user.email', 'mrtnzlml+kiwicom-github-bot@gmail.com'],
    {
      stdio: 'inherit',
      cwd: clonedir,
    },
  );
  ChildProcess.executeSystemCommand(
    'git',
    ['config', 'user.name', 'kiwicom-github-bot'],
    {
      stdio: 'inherit',
      cwd: clonedir,
    },
  );

  new Sync({
    clonedir,
    roots: [config.privatePath],
    directoryMapping: new Map([[config.privatePath + '/', '']]),
  }).run(() => {
    console.warn('Filtering done, pushing...');

    ChildProcess.executeSystemCommand('git', ['push', 'origin', 'master'], {
      stdio: 'inherit',
      cwd: clonedir,
    });
  });
}
