// @flow strict-local

import createClonePhase from './phases/createClonePhase';
import createSyncPhase from './phases/createSyncPhase';
import createPushPhase from './phases/createPushPhase';
import PhaseRunnerConfig from './PhaseRunnerConfig';

export default class PhaseRunner {
  config: PhaseRunnerConfig;

  constructor(config: PhaseRunnerConfig) {
    this.config = config;
  }

  run() {
    const cfg = this.config;

    new Set<() => void>([
      // TODO: clean phase
      createClonePhase(cfg.exportedRepoURL, cfg.exportedRepoPath),
      createSyncPhase(cfg),
      // TODO: verify phase
      createPushPhase(cfg.exportedRepoPath),
    ]).forEach(phase => phase());
  }
}
