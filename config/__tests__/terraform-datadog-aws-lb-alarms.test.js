// @flow strict-local

import path from 'path';

import testExportedPaths from './testExportedPaths';

testExportedPaths(path.join(__dirname, '..', 'terraform-datadog-aws-lb-alarms.js'), [
  ['src/platform/terraform-datadog-aws-lb-alarms/versions.tf', 'versions.tf'],
  ['src/platform/terraform-datadog-aws-lb-alarms/main.tf', 'main.tf'],
  ['src/platform/terraform-datadog-aws-lb-alarms/variables.tf', 'variables.tf'],

  // invalid cases:
  ['src/packages/xyz/outsideScope.js', undefined], // correctly deleted
  ['package.json', undefined], // correctly deleted
]);
