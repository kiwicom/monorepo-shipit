// @flow strict

import Changeset from './Changeset';

function matchesAnyPattern(
  path: string,
  stripPatterns: $ReadOnlyArray<RegExp>,
) {
  return stripPatterns.some(stripPattern => stripPattern.test(path));
}

export default class PathFilters {
  /**
   * Remove any modifications to paths matching `stripPatterns`.
   */
  static stripPaths(
    changeset: Changeset,
    stripPatterns: $ReadOnlyArray<RegExp>,
  ): Changeset {
    if (stripPatterns.length === 0) {
      return changeset;
    }
    const diffs = new Set();
    for (const diff of changeset.getDiffs()) {
      const path = diff.path;
      if (matchesAnyPattern(path, stripPatterns)) {
        // stripping because matching pattern was found
        continue;
      }
      diffs.add(diff);
    }
    return changeset.withDiffs(diffs);
  }

  /**
   * Apply patches to a different directory in the destination repository.
   */
  static moveDirectories(
    changeset: Changeset,
    mapping: Map<string, string>,
  ): Changeset {
    const rewriteCallback = oldPath => {
      let newPath = oldPath;
      for (const [src, dest] of mapping.entries()) {
        let matchFound = false;
        if (new RegExp('^' + src).test(newPath)) {
          matchFound = true;
        }
        newPath = newPath.replace(new RegExp('^' + src), dest);
        if (matchFound) {
          break; // only first match in the map
        }
      }
      return newPath;
    };

    const diffs = new Set();
    for (const diff of changeset.getDiffs()) {
      const oldPath = diff.path;
      const newPath = rewriteCallback(oldPath);
      if (oldPath === newPath) {
        diffs.add(diff);
        continue;
      }

      let body = diff.body;
      body = body.replace(
        new RegExp('^--- a/' + oldPath, 'm'),
        '--- a/' + newPath,
      );
      body = body.replace(
        new RegExp('^\\+\\+\\+ b/' + oldPath, 'm'),
        '+++ b/' + newPath,
      );

      diffs.add({
        path: newPath,
        body,
      });
    }

    return changeset.withDiffs(diffs);
  }

  /**
   * Remove any modifications outside of specified roots.
   */
  static stripExceptDirectories(
    changeset: Changeset,
    rawRoots: $ReadOnlyArray<string>,
  ) {
    const roots = rawRoots.map(rawRoot => {
      return rawRoot.endsWith('/') ? rawRoot : rawRoot + '/';
    });
    const diffs = new Set();
    for (const diff of changeset.getDiffs()) {
      const path = diff.path;
      for (const root of roots) {
        if (path.startsWith(root)) {
          diffs.add(diff);
          break;
        }
      }
    }
    return changeset.withDiffs(diffs);
  }
}
