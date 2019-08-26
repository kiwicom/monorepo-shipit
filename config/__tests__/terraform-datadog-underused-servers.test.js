// @flow strict-local

import path from 'path';

import testExportedPaths from './testExportedPaths';

testExportedPaths(path.join(__dirname, '..', 'terraform-datadog-underused-servers.js'), [
  ['src/platform/terraform-datadog-underused-servers/main.tf', 'main.tf'],
  ['src/platform/terraform-datadog-underused-servers/variables.tf', 'variables.tf'],
  ['src/platform/terraform-datadog-underused-servers/versions.tf', 'versions.tf'],

  // invalid cases:
  ['src/packages/xyz/outsideScope.js', undefined], // correctly deleted
  ['package.json', undefined], // correctly deleted
]);
