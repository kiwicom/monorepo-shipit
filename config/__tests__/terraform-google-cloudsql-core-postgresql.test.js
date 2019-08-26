// @flow strict-local

import path from 'path';

import testExportedPaths from './testExportedPaths';

testExportedPaths(path.join(__dirname, '..', 'terraform-google-cloudsql-core-postgresql.js'), [
  ['src/platform/terraform-google-cloudsql-core-postgresql/master.tf', 'master.tf'],
  ['src/platform/terraform-google-cloudsql-core-postgresql/replica.tf', 'replica.tf'],
  ['src/platform/terraform-google-cloudsql-core-postgresql/versions.tf', 'versions.tf'],
  ['src/platform/terraform-google-cloudsql-core-postgresql/variables.tf', 'variables.tf'],

  // invalid cases:
  ['src/packages/xyz/outsideScope.js', undefined], // correctly deleted
  ['package.json', undefined], // correctly deleted
]);
