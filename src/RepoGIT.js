// @flow strict-local

import fs from 'fs';
import path from 'path';
import { invariant } from '@kiwicom/js';
import { ShellCommand } from '@kiwicom/monorepo';

import parsePatch from './parsePatch';
import parsePatchHeader from './parsePatchHeader';
import splitHead from './splitHead';
import Changeset from './Changeset';

/**
 * This is our monorepo part - source of exports.
 */
export interface SourceRepo {
  findDescendantsPath(
    baseRevision: string,
    headRevision: string,
    roots: Set<string>,
  ): $ReadOnlyArray<string>;
  getChangesetFromID(revision: string): Changeset;
  getNativePatchFromID(revision: string): string;
  getNativeHeaderFromIDWithPatch(revision: string, patch: string): string;
  getChangesetFromExportedPatch(header: string, patch: string): Changeset;
}

/**
 * Exported repository containing `kiwicom-source-id` handles.
 */
export interface DestinationRepo {
  findLastSourceCommit(roots: Set<string>): string;
  renderPatch(changeset: Changeset): string;
  commitPatch(changeset: Changeset): void;
  checkoutBranch(branchName: string): void;
  push(): void;
}

export default class RepoGIT implements SourceRepo, DestinationRepo {
  localPath: string;

  constructor(localPath: string) {
    invariant(
      fs.existsSync(path.join(localPath, '.git')),
      '%s is not a GIT repo.',
      localPath,
    );

    this.localPath = localPath;
  }

  _gitCommand = (...args: $ReadOnlyArray<string>) => {
    return new ShellCommand(
      this.localPath,
      'git',
      '--no-pager',
      ...args,
    ).setEnvironmentVariables(
      new Map([
        // https://git-scm.com/docs/git#_environment_variables
        ['GIT_CONFIG_NOSYSTEM', '1'],
        ['GIT_TERMINAL_PROMPT', '0'],
      ]),
    );
  };

  push() {
    this._gitCommand('push', 'origin', 'master')
      .setOutputToScreen()
      .runSynchronously();
  }

  checkoutBranch(branchName: string) {
    this._gitCommand('checkout', '-b', branchName)
      .setOutputToScreen()
      .runSynchronously();
  }

  clean() {
    this._gitCommand(
      'clean', // remove untracked files from the working tree
      '-x', // ignore .gitignore
      '-f', // force
      '-f', // double force
      '-d', // remove untracked directories in addition to untracked files
    )
      .setOutputToScreen()
      .runSynchronously();
  }

  isCorrupted(): boolean {
    const exitCode = this._gitCommand('fsck', '--strict')
      .setNoExceptions()
      .runSynchronously()
      .getExitCode();
    return exitCode !== 0;
  }

  findLastSourceCommit = (roots: Set<string>): string => {
    const rawLog = this._gitCommand(
      'log',
      '-1',
      '--grep',
      '^kiwicom-source-id: [a-z0-9]\\+$',
      ...roots,
    )
      .setNoExceptions() // empty repo fails with: "your current branch 'master' does not have any commits yet"
      .runSynchronously()
      .getStdout();
    const match = rawLog
      .trim()
      .match(/kiwicom-source-id: (?<commit>[a-z0-9]+)$/m);
    return match?.groups?.commit ?? 'd30a77bd2fe0fdfe5739d68fc9592036e94364dd'; // very first commit in incubator/universe
  };

  getNativePatchFromID = (revision: string): string => {
    return this._gitCommand(
      'format-patch',
      '--no-renames',
      '--no-stat',
      '--stdout',
      '--full-index',
      '--format=', // contain nothing but the code changes
      '-1',
      revision,
    )
      .runSynchronously()
      .getStdout();
  };

  getNativeHeaderFromIDWithPatch = (
    revision: string,
    patch: string,
  ): string => {
    const fullPatch = this._gitCommand(
      'format-patch',
      '--no-renames',
      '--no-stat',
      '--stdout',
      '--full-index',
      '-1',
      revision,
    )
      .runSynchronously()
      .getStdout();
    if (patch.length === 0) {
      // this is an empty commit, so everything is the header
      return fullPatch;
    }
    return fullPatch.replace(patch, '');
  };

  getChangesetFromID = (revision: string): Changeset => {
    const patch = this.getNativePatchFromID(revision);
    const header = this.getNativeHeaderFromIDWithPatch(revision, patch);
    const changeset = this.getChangesetFromExportedPatch(header, patch);
    console.warn(`Filtering changeset for: ${revision}`); // eslint-disable-line no-console
    return changeset.withID(revision);
  };

  getChangesetFromExportedPatch = (
    header: string,
    patch: string,
  ): Changeset => {
    const changeset = parsePatchHeader(header);
    const diffs = new Set();
    for (const hunk of parsePatch(patch)) {
      const diff = this.parseDiffHunk(hunk);
      if (diff !== null) {
        diffs.add(diff);
      }
    }
    return changeset.withDiffs(diffs);
  };

  parseDiffHunk = (hunk: string) => {
    const [head, tail] = splitHead(hunk, '\n');
    const match = head.match(/^diff --git [ab]\/(?:.*?) [ab]\/(?<path>.*?)$/);
    if (!match) {
      return null;
    }
    const path = match.groups?.path;
    invariant(path != null, 'Cannot parse path from the hunk.');
    return { path, body: tail };
  };

  // TODO: originally `findNextCommit` - pls reconsider
  findDescendantsPath = (
    baseRevision: string,
    headRevision: string,
    roots: Set<string>,
  ): $ReadOnlyArray<string> => {
    const log = this._gitCommand(
      'log',
      '--reverse',
      '--ancestry-path',
      '--no-merges',
      '--pretty=tformat:%H',
      baseRevision + '..' + headRevision,
      ...roots,
    )
      .runSynchronously()
      .getStdout();

    // return descendant hashes
    return log.trim().split('\n');
  };

  commitPatch = (changeset: Changeset): void => {
    const diff = this.renderPatch(changeset);
    try {
      this._gitCommand('am', '--keep-non-patch', '--keep-cr')
        .setStdin(diff)
        .setOutputToScreen()
        .runSynchronously();
    } catch (error) {
      this._gitCommand('am', '--show-current-patch')
        .setOutputToScreen()
        .runSynchronously();
      this._gitCommand('am', '--abort')
        .setOutputToScreen()
        .runSynchronously();
      throw error;
    }
  };

  renderPatch = (changeset: Changeset): string => {
    let renderedDiffs = '';
    for (const diff of changeset.getDiffs()) {
      const path = diff.path;
      renderedDiffs += `diff --git a/${path} b/${path}
${diff.body}`;
    }

    // Mon Sep 17 is a magic date used by format-patch to distinguish from real mailboxes
    // see: https://git-scm.com/docs/git-format-patch
    return `From ${changeset.getID()} Mon Sep 17 00:00:00 2001
From: ${changeset.getAuthor()}
Date: ${changeset.getTimestamp()}
Subject: [PATCH] ${changeset.getSubject()}

${changeset.getDescription()}

${renderedDiffs}
--
2.21.0
`;
  };
}