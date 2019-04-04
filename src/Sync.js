// @flow strict-local

import util from 'util';

import Git from './Git';
import Changeset from './Changeset';
import PathFilters from './PathFilters';

export default class Sync {
  getFirstSourceID = (): string => {
    // TODO: just a temporary SHA to start somewhere (first commit in this monorepo)
    return 'd30a77bd2fe0fdfe5739d68fc9592036e94364dd';
  };

  getSourceChangesets = (): Set<Changeset> => {
    const initialRevision = this.getFirstSourceID();

    const repo = new Git();
    const sourceChangesets = new Set<Changeset>();

    sourceChangesets.add(repo.getChangesetFromID(initialRevision)); // TODO: is this correct - the first commit is irrelevant (?)
    repo
      .findDescendantsPath(initialRevision, [
        'src/packages/relay', // TODO: make it configurable
      ])
      .forEach(revision => {
        sourceChangesets.add(repo.getChangesetFromID(revision));
      });

    return sourceChangesets;
  };

  getFilteredChangesets = (): Set<Changeset> => {
    const filteredChangesets = new Set<Changeset>();
    this.getSourceChangesets().forEach(changeset => {
      const changesetWithTrackingID = this.addTrackingData(changeset);
      filteredChangesets.add(
        PathFilters.moveDirectories(
          PathFilters.stripExceptDirectories(changesetWithTrackingID, [
            'src/packages/relay', // TODO: make it configurable
          ]),
          new Map([
            ['src/packages/relay/', ''], // TODO: make it configurable
          ]),
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

  run = () => {
    const changesets = this.getFilteredChangesets();

    // TODO: foreach changes and Git.commitPatch to the cloned OSS repository
    // TODO: push (but in different phase, see FBShipItConfig)

    // eslint-disable-next-line no-console
    console.warn(
      util.inspect(changesets, {
        depth: 4,
        colors: true,
      }),
    );
  };
}
