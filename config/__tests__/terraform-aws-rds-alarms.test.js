// @flow strict-local

import path from 'path';

import testExportedPaths from './testExportedPaths';

testExportedPaths(path.join(__dirname, '..', 'terraform-aws-rds-alarms.js'), [
  ['src/platform/terraform-aws-rds-alarms/versions.tf', 'versions.tf'],
  ['src/platform/terraform-aws-rds-alarms/main.tf', 'main.tf'],
  ['src/platform/terraform-aws-rds-alarms/variables.tf', 'variables.tf'],
  ['src/platform/terraform-aws-rds-alarms/providers.tf', 'providers.tf'],

  // invalid cases:
  ['src/packages/xyz/outsideScope.js', undefined], // correctly deleted
  ['package.json', undefined], // correctly deleted
]);
