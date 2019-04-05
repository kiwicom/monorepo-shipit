// @flow

import Git from '../Git';
import Changeset from '../Changeset';

it('TODO', () => {
  const repo = new Git('mocked_repo_path');
  const changeset = new Changeset()
    .withID('mocked_id')
    .withTimestamp('mocked_timestamp')
    .withAuthor('mocked_author')
    .withSubject('mocked_subject')
    .withDescription('mocked_description')
    .withDiffs(
      new Set([
        { path: 'mocked_path1', body: 'mocked_body1\n' },
        { path: 'mocked_path2', body: 'mocked_body2\n' },
      ]),
    );
  expect(repo.renderPatch(changeset)).toMatchSnapshot();
});
