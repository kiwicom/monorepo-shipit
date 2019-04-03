// @flow

import util from 'util';

import Git from './Git';
import Changeset from './Changeset';

export default class Sync {
  getFirstSourceID = (): string => {
    // TODO: just a temporary SHA to start somewhere (related to src/packages/relay)
    return '71d3b4ce16f77de7e2d51847f29813803660d744';
  };

  getSourceChangesets = (): Set<Changeset> => {
    const initialRevision = this.getFirstSourceID();

    const repo = new Git();
    const sourceChangesets = new Set<Changeset>();

    sourceChangesets.add(repo.getChangesetFromID(initialRevision));
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
      // TODO: apply filters (paths) and tracking data (kiwicom-source-id) on top of it (see: addTrackingData)
      filteredChangesets.add(this.addTrackingData(changeset));
    });
    return filteredChangesets;
  };

  addTrackingData = (changeset: Changeset) => {
    const revision = changeset.getID();
    const newMessage =
      changeset.getMessage() + '\n\nkiwicom-source-id: ' + revision;
    return changeset.withMessage(newMessage.trim());
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
