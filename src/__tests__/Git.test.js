// @flow

import RepoGIT from '../RepoGIT';
import Changeset from '../Changeset';

jest.mock('fs', () => ({
  // workarounding fake Git repo paths
  existsSync: () => true,
}));

it('renders patch as expected', () => {
  const repo = new RepoGIT('mocked_repo_path');
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
