// @flow

import RepoGIT from '../RepoGIT';
import Changeset from '../Changeset';

jest.mock('fs', () => ({
  // workarounding fake Git repo paths
  existsSync: () => true,
}));

jest.mock('@kiwicom/monorepo-utils', () => {
  return {
    ShellCommand: class {
      stdout = null;
      constructor(path, git, noPager, ...commandArray) {
        const command = commandArray.toString();
        switch (command) {
          case 'rev-list,--max-parents=0,HEAD':
            this.stdout =
              path === 'mocked_repo_path_1'
                ? 'd30a77bd2fe0fdfe5739d68fc9592036e94364dd'
                : '0ca71b3737cbb26fbf037aa15b3f58735785e6e3\n' +
                  '16d6b8ab6fd7f68bfd9f4d312965cb99e8ad911b\n' +
                  'cb07fc2a29c86d1bc11f5415368f778d25d3d20a\n' +
                  '161332a521fe10c41979bcd493d95e2ac562b7ff\n' +
                  '1db95b00a2d2a001fd91cd860a71c639ea04eb53\n' +
                  '2744b2344dc42fa2a1ddf17f4818975cd48f6d42\n' +
                  'e83c5163316f89bfbde7d9ab23ca2e25604af290'; // we should be interested only in this one
            break;
          default:
            throw new Error(`There is no available dataset for command: ${command}`);
        }
      }

      getStdout() {
        return this.stdout;
      }

      runSynchronously() {
        return this;
      }

      setEnvironmentVariables() {
        return this;
      }
    },
  };
});

it('renders patch as expected', () => {
  const repo = new RepoGIT('mocked_repo_path_1');
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

describe('findFirstAvailableCommit', () => {
  beforeEach(() => {
    jest.spyOn(console, 'warn').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('returns first available revision when single root available', () => {
    const repo = new RepoGIT('mocked_repo_path_1');
    expect(repo.findFirstAvailableCommit()).toBe('d30a77bd2fe0fdfe5739d68fc9592036e94364dd');
  });

  it('returns first available revision when multiple roots available', () => {
    const repo = new RepoGIT('mocked_repo_path_2');
    expect(repo.findFirstAvailableCommit()).toBe('e83c5163316f89bfbde7d9ab23ca2e25604af290');
  });
});
