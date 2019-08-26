// @flow strict-local

import path from 'path';

import testExportedPaths from './testExportedPaths';

testExportedPaths(path.join(__dirname, '..', 'terraform-aws-elasticache-alarms.js'), [
  ['src/platform/terraform-aws-elasticache-alarms/versions.tf', 'versions.tf'],
  ['src/platform/terraform-aws-elasticache-alarms/main.tf', 'main.tf'],
  ['src/platform/terraform-aws-elasticache-alarms/variables.tf', 'variables.tf'],

  // invalid cases:
  ['src/packages/xyz/outsideScope.js', undefined], // correctly deleted
  ['package.json', undefined], // correctly deleted
]);
