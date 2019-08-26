// @flow strict-local

import path from 'path';

import testExportedPaths from './testExportedPaths';

testExportedPaths(path.join(__dirname, '..', 'terraform-google-spinnaker-service-account.js'), [
  ['src/platform/terraform-google-spinnaker-service-account/main.tf', 'main.tf'],
  ['src/platform/terraform-google-spinnaker-service-account/interface.tf', 'interface.tf'],
  ['src/platform/terraform-google-spinnaker-service-account/versions.tf', 'versions.tf'],
  ['src/platform/terraform-google-spinnaker-service-account/get-info.sh', 'get-info.sh'],

  // invalid cases:
  ['src/packages/xyz/outsideScope.js', undefined], // correctly deleted
  ['package.json', undefined], // correctly deleted
]);
