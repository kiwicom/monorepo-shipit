// @flow strict-local

import createClonePhase from './phases/createClonePhase';
import createSyncPhase from './phases/createSyncPhase';
import createPushPhase from './phases/createPushPhase';

type PhaseRunnerConfig = $ReadOnly<{|
  // what is the URL of source repo (usually SSH URL like git@github.com:kiwicom/fetch.git)
  sourceURL: string, //  TODO: it's not really a source (?)

  directoryMapping: Map<string, string>,

  // where is the destination Git repo located on filesystem (usually cloned GitHub repo)
  destinationPath: string,
|}>;

export default class PhaseRunner {
  config: PhaseRunnerConfig;

  constructor(config: PhaseRunnerConfig) {
    this.config = config;
  }

  run() {
    const cfg = this.config;

    new Set<() => void>([
      // TODO: clean phase
      createClonePhase(cfg.sourceURL, cfg.destinationPath),
      createSyncPhase(
        cfg.destinationPath,
        cfg.directoryMapping, // TODO: pass down appropriate filters from here instead of `directoryMapping` (should be project specific)
      ),
      // TODO: verify phase
      createPushPhase(cfg.destinationPath),
    ]).forEach(phase => phase());
  }
}
