// @flow strict-local

import path from 'path';

import testExportedPaths from './testExportedPaths';

testExportedPaths(path.join(__dirname, '..', 'terraform-google-cloudsql-core-mysql.js'), [
  ['src/platform/terraform-google-cloudsql-core-mysql/failover_replica.tf', 'failover_replica.tf'],
  ['src/platform/terraform-google-cloudsql-core-mysql/master.tf', 'master.tf'],
  ['src/platform/terraform-google-cloudsql-core-mysql/read_replica.tf', 'read_replica.tf'],
  ['src/platform/terraform-google-cloudsql-core-mysql/versions.tf', 'versions.tf'],
  ['src/platform/terraform-google-cloudsql-core-mysql/variables.tf', 'variables.tf'],

  // invalid cases:
  ['src/packages/xyz/outsideScope.js', undefined], // correctly deleted
  ['package.json', undefined], // correctly deleted
]);
