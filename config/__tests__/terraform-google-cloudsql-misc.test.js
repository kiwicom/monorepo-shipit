// @flow strict-local

import path from 'path';

import testExportedPaths from './testExportedPaths';

testExportedPaths(path.join(__dirname, '..', 'terraform-google-cloudsql-misc.js'), [
  ['src/platform/terraform-google-cloudsql-misc/main.tf', 'main.tf'],
  ['src/platform/terraform-google-cloudsql-misc/outputs.tf', 'outputs.tf'],
  ['src/platform/terraform-google-cloudsql-misc/versions.tf', 'versions.tf'],
  ['src/platform/terraform-google-cloudsql-misc/variables.tf', 'variables.tf'],

  // invalid cases:
  ['src/packages/xyz/outsideScope.js', undefined], // correctly deleted
  ['package.json', undefined], // correctly deleted
]);
