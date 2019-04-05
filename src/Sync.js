// @flow strict-local

import Git from './Git';
import Changeset from './Changeset';
import PathFilters from './PathFilters';

type Configuration = {|
  +clonedir: string,
  +roots: $ReadOnlyArray<string>,
  +directoryMapping: Map<string, string>,
|};

export default class Sync {
  repo: Git;
  roots: $ReadOnlyArray<string>;
  directoryMapping: Map<string, string>;

  constructor(config: Configuration) {
    this.repo = new Git(config.clonedir);
    this.roots = config.roots;
    this.directoryMapping = config.directoryMapping;
  }

  getSourceChangesets = (): Set<Changeset> => {
    const initialRevision = this.repo.findLastSourceCommit();
    const sourceChangesets = new Set<Changeset>();
    this.repo
      .findDescendantsPath(initialRevision, this.roots)
      .forEach(revision => {
        sourceChangesets.add(this.repo.getChangesetFromID(revision));
      });
    return sourceChangesets;
  };

  getFilteredChangesets = (): Set<Changeset> => {
    const filteredChangesets = new Set<Changeset>();
    this.getSourceChangesets().forEach(changeset => {
      const changesetWithTrackingID = this.addTrackingData(changeset);
      filteredChangesets.add(
        PathFilters.moveDirectories(
          PathFilters.stripExceptDirectories(
            changesetWithTrackingID,
            this.roots,
          ),
          this.directoryMapping,
        ),
      );
    });
    return filteredChangesets;
  };

  addTrackingData = (changeset: Changeset): Changeset => {
    const revision = changeset.getID();
    const newDescription =
      changeset.getDescription() + '\n\nkiwicom-source-id: ' + revision;
    return changeset.withDescription(newDescription.trim());
  };

  run = (cb: () => void) => {
    const changesets = this.getFilteredChangesets();

    changesets.forEach(changeset => {
      if (changeset.isValid()) {
        this.repo.commitChangeset(changeset);
      }
    });

    cb();
  };
}
