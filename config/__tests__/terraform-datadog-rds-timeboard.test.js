// @flow strict-local

import path from 'path';

import testExportedPaths from './testExportedPaths';

testExportedPaths(path.join(__dirname, '..', 'terraform-datadog-rds-timeboard.js'), [
  ['src/platform/terraform-datadog-rds-timeboard/versions.tf', 'versions.tf'],
  ['src/platform/terraform-datadog-rds-timeboard/main.tf', 'main.tf'],
  ['src/platform/terraform-datadog-rds-timeboard/variables.tf', 'variables.tf'],

  // invalid cases:
  ['src/packages/xyz/outsideScope.js', undefined], // correctly deleted
  ['package.json', undefined], // correctly deleted
]);
