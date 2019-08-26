// @flow strict-local

import path from 'path';

import testExportedPaths from './testExportedPaths';

testExportedPaths(path.join(__dirname, '..', 'terraform-aws-ftp-transfer-user.js'), [
  ['src/platform/terraform-aws-ftp-transfer-user/versions.tf', 'versions.tf'],
  ['src/platform/terraform-aws-ftp-transfer-user/main.tf', 'main.tf'],
  ['src/platform/terraform-aws-ftp-transfer-user/variables.tf', 'variables.tf'],
  ['src/platform/terraform-aws-ftp-transfer-user/iam.tf', 'iam.tf'],

  // invalid cases:
  ['src/packages/xyz/outsideScope.js', undefined], // correctly deleted
  ['package.json', undefined], // correctly deleted
]);
