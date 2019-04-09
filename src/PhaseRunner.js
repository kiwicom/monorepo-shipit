// @flow strict-local

import path from 'path';

import createClonePhase from './phases/createClonePhase';
import createSyncPhase from './phases/createSyncPhase';
import createPushPhase from './phases/createPushPhase';

type PhaseRunnerConfig = $ReadOnly<{|
  // what is the URL of source repo (usually SSH URL like git@github.com:kiwicom/fetch.git)
  sourceURL: string,
  sourceRoots: Set<string>,

  // where is the destination Git repo located on filesystem (usually cloned GitHub repo)
  destinationPath: string,
|}>;

export default class PhaseRunner {
  config: PhaseRunnerConfig;

  constructor(config: PhaseRunnerConfig) {
    this.config = config;
  }

  run() {
    const c = this.config;

    const directoryMapping = new Map();
    for (const sourceRoot of c.sourceRoots) {
      directoryMapping.set(
        sourceRoot.endsWith(path.sep) ? sourceRoot : sourceRoot + path.sep,
        '',
      );
    }

    new Set<() => void>([
      // TODO: clean phase
      createClonePhase(c.sourceURL, c.destinationPath),
      createSyncPhase(
        // TODO: pass down appropriate filters from here instead of `directoryMapping` (it's project specific)
        c.destinationPath,
        c.sourceRoots,
        directoryMapping,
      ),
      // TODO: verify phase
      createPushPhase(c.destinationPath),
    ]).forEach(phase => phase());
  }
}
