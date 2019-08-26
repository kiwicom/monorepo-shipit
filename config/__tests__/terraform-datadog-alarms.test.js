// @flow strict-local

import path from 'path';

import testExportedPaths from './testExportedPaths';

testExportedPaths(path.join(__dirname, '..', 'terraform-datadog-alarms.js'), [
  ['src/platform/terraform-datadog-alarms/versions.tf', 'versions.tf'],
  ['src/platform/terraform-datadog-alarms/main.tf', 'main.tf'],
  ['src/platform/terraform-datadog-alarms/variables.tf', 'variables.tf'],

  // invalid cases:
  ['src/packages/xyz/outsideScope.js', undefined], // correctly deleted
  ['package.json', undefined], // correctly deleted
]);
