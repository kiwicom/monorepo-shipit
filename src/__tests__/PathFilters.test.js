// @flow strict-local

import PathFilters from '../PathFilters';
import Changeset from '../Changeset';

describe('stripPaths', () => {
  test.each([
    ['No change', [], ['foo', 'bar', 'herp/derp', 'herp/derp-derp', 'derp']],
    [
      'Remove top level file',
      [/^bar$/],
      ['foo', 'herp/derp', 'herp/derp-derp', 'derp'],
    ],
    ['Remove directory', [/^herp\//], ['foo', 'bar', 'derp']],
    ['Remove file', [/(?:^|\/)derp(?:\/|$)/], ['foo', 'bar', 'herp/derp-derp']],
    [
      'Multiple patterns',
      [/^foo$/, /^bar$/],
      ['herp/derp', 'herp/derp-derp', 'derp'],
    ],
  ])('%s', (testName, stripPatterns, expectedFiles) => {
    const paths = ['foo', 'bar', 'herp/derp', 'herp/derp-derp', 'derp'];
    const changeset = new Changeset().withDiffs(
      new Set(paths.map(path => ({ path, body: 'placeholder' }))),
    );
    const diffs = PathFilters.stripPaths(changeset, stripPatterns).getDiffs();
    expect([...diffs].map(diff => diff.path)).toEqual(expectedFiles);
  });
});

describe('moveDirectories', () => {
  test.each([
    [
      'first takes precedence (first is more specific)',
      new Map([
        // from => to
        ['foo/public_tld/', ''],
        ['foo/', ''],
      ]),
      ['foo/orig_root_file', 'foo/public_tld/public_root_file'],
      ['orig_root_file', 'public_root_file'],
    ],
    [
      // this mapping doesn't make sense given the behavior, just using it to check that order matters
      'first takes precedence (second is more specific)',
      new Map([['foo/', ''], ['foo/public_tld/', '']]),
      ['foo/orig_root_file', 'foo/public_tld/public_root_file'],
      ['orig_root_file', 'public_tld/public_root_file'],
    ],
    [
      'only one rule applied',
      new Map([['foo/', ''], ['bar/', 'project_bar/']]),
      ['foo/bar/part of project foo', 'bar/part of project bar'],
      [
        'bar/part of project foo', // this shouldn't turn into 'project_bar/part of project foo'
        'project_bar/part of project bar',
      ],
    ],
    [
      'missing trailing slashes',
      new Map([['foo', 'bar'], ['xyz/', 'aaa']]),
      ['foo/file', 'foo_baz/file', 'xyz/file'],
      [
        'bar/file',
        'bar_baz/file',
        'aaafile', // this can be a gotcha for someone
      ],
    ],
  ])('%s', (testName, mapping, inputPaths, expected) => {
    const changeset = new Changeset().withDiffs(
      new Set(inputPaths.map(path => ({ path, body: 'placeholder' }))),
    );
    const diffs = PathFilters.moveDirectories(changeset, mapping).getDiffs();
    expect([...diffs].map(diff => diff.path)).toEqual(expected);
  });
});

describe('moveDirectoriesReverse', () => {
  test.each([
    [
      'second takes precedence (first is more specific)',
      new Map([
        // from => to
        ['foo/public_tld/', ''],
        ['foo/', 'bar/'],
      ]),
      ['foo/orig_root_file', 'foo/public_tld/public_root_file'],
      ['bar/orig_root_file', 'public_root_file'],
    ],
    [
      'only one rule applied',
      new Map([['foo/', ''], ['bar/', 'project_bar/']]),
      ['foo/bar/part of project foo', 'bar/part of project bar'],
      [
        'bar/part of project foo', // this shouldn't turn into 'project_bar/part ...'
        'project_bar/part of project bar',
      ],
    ],
    [
      'subdirectories',
      new Map([['foo/test/', 'testing/'], ['foo/', '']]),
      ['foo/test/README', 'foo/src.c'],
      ['testing/README', 'src.c'],
    ],
  ])('%s', (testName, mapping, inputPaths, expected) => {
    const changeset = new Changeset().withDiffs(
      new Set(inputPaths.map(path => ({ path, body: 'placeholder' }))),
    );
    const diffs = PathFilters.moveDirectories(changeset, mapping).getDiffs();
    expect([...diffs].map(diff => diff.path)).toEqual(expected);

    const reversedChangeset = new Changeset().withDiffs(diffs);
    const reversedDiffs = PathFilters.moveDirectoriesReverse(
      reversedChangeset,
      mapping,
    ).getDiffs();
    expect([...reversedDiffs].map(diff => diff.path)).toEqual(inputPaths);
  });

  it('throw exception when mapping contains duplicate destinations', () => {
    // Please note: this is technically OK for normal mapping. However, it's
    // not possible to revers such a mapping because it's not clear how
    // should be the paths restored.
    const changeset = new Changeset();
    const brokenMapping = new Map([
      ['foo/', 'duplicate/'],
      ['bar/', 'duplicate/'],
    ]);
    expect(() =>
      PathFilters.moveDirectoriesReverse(changeset, brokenMapping),
    ).toThrowError(
      'It is not possible to reverse mapping with duplicate destinations.',
    );
  });
});

describe('stripExceptDirectories', () => {
  test.each([
    [['foo'], ['foo/bar', 'herp/derp'], ['foo/bar']],
    [['foo/'], ['foo/bar', 'herp/derp'], ['foo/bar']],
    [['foo'], ['foo/bar', 'foobaz'], ['foo/bar']],
    [
      ['foo', 'herp'],
      ['foo/bar', 'herp/derp', 'baz'],
      ['foo/bar', 'herp/derp'],
    ],
  ])(
    'strips packages outside of the defined scope correctly: %#',
    (roots, inputPaths, expected) => {
      const changeset = new Changeset().withDiffs(
        new Set(inputPaths.map(path => ({ path, body: 'placeholder' }))),
      );
      const diffs = PathFilters.stripExceptDirectories(
        changeset,
        roots,
      ).getDiffs();
      expect([...diffs].map(diff => diff.path)).toEqual(expected);
    },
  );
});
