// @flow strict

import Changeset from '../../src/Changeset';
import PhaseRunnerConfig from '../../src/PhaseRunnerConfig';
import requireAndValidateConfig from '../../src/requireAndValidateConfig';

jest.mock('fs');

export default function testExportedPaths(
  configPath: string,
  mapping: $ReadOnlyArray<
    [
      string,
      string | void, // void describes deleted file
    ],
  >,
) {
  const config = requireAndValidateConfig(configPath);

  test.each(mapping)('mapping: %s -> %s', (input, output) => {
    const defaultFilter = new PhaseRunnerConfig(
      'mocked repo path',
      'mocked repo URL',
      config.getDefaultPathMappings(),
    ).getDefaultShipitFilter();

    const inputChangeset = new Changeset().withDiffs(
      new Set([{ path: input, body: 'mocked' }]),
    );

    const outputDataset = defaultFilter(inputChangeset);

    if (output === undefined) {
      expect(...outputDataset.getDiffs()).toBeUndefined();
    } else {
      expect(...outputDataset.getDiffs()).toEqual({
        body: 'mocked',
        path: output,
      });
    }
  });
}
