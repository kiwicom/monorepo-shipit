// @flow strict-local

import path from 'path';

import testExportedPaths from './testExportedPaths';

testExportedPaths(path.join(__dirname, '..', 'terraform-google-datadog-service-account.js'), [
  ['src/platform/terraform-google-datadog-service-account/main.tf', 'main.tf'],
  ['src/platform/terraform-google-datadog-service-account/interface.tf', 'interface.tf'],
  ['src/platform/terraform-google-datadog-service-account/versions.tf', 'versions.tf'],

  // invalid cases:
  ['src/packages/xyz/outsideScope.js', undefined], // correctly deleted
  ['package.json', undefined], // correctly deleted
]);
