// @flow strict-local

import path from 'path';

import testExportedPaths from './testExportedPaths';

testExportedPaths(path.join(__dirname, '..', 'terraform-aws-rds-core.js'), [
  ['src/platform/terraform-aws-rds-core/main.tf', 'main.tf'],
  ['src/platform/terraform-aws-rds-core/replica.tf', 'replica.tf'],
  ['src/platform/terraform-aws-rds-core/providers.tf', 'providers.tf'],
  ['src/platform/terraform-aws-rds-core/variables.tf', 'variables.tf'],
  ['src/platform/terraform-aws-rds-core/versions.tf', 'versions.tf'],

  // invalid cases:
  ['src/packages/xyz/outsideScope.js', undefined], // correctly deleted
  ['package.json', undefined], // correctly deleted
]);
