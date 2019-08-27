// @flow strict-local

import path from 'path';

import testExportedPaths from './testExportedPaths';

testExportedPaths(path.join(__dirname, '..', 'terraform-aws-rds-misc.js'), [
  ['src/platform/terraform-aws-rds-misc/main.tf', 'main.tf'],
  ['src/platform/terraform-aws-rds-misc/providers.tf', 'providers.tf'],
  ['src/platform/terraform-aws-rds-misc/variables.tf', 'variables.tf'],
  ['src/platform/terraform-aws-rds-misc/versions.tf', 'versions.tf'],

  // invalid cases:
  ['src/packages/xyz/outsideScope.js', undefined], // correctly deleted
  ['package.json', undefined], // correctly deleted
]);
