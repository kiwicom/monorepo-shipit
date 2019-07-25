// @flow strict-local

import path from 'path';

import testExportedPaths from './testExportedPaths';

testExportedPaths(path.join(__dirname, '..', 'terraform-google-instance-group-named-ports.js'), [
  [
    'src/platform/terraform-google-instance-group-named-ports/set-named-ports.sh',
    'set-named-ports.sh',
  ],
  ['src/platform/terraform-google-instance-group-named-ports/main.tf', 'main.tf'],
  ['src/platform/terraform-google-instance-group-named-ports/variables.tf', 'variables.tf'],

  // invalid cases:
  ['src/packages/xyz/outsideScope.js', undefined], // correctly deleted
  ['package.json', undefined], // correctly deleted
]);
