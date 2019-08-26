// @flow strict-local

import path from 'path';

import testExportedPaths from './testExportedPaths';

testExportedPaths(path.join(__dirname, '..', 'terraform-aws-vpc.js'), [
  ['src/platform/terraform-aws-vpc/module.tf', 'module.tf'],
  ['src/platform/terraform-aws-vpc/bastion.tf', 'bastion.tf'],
  ['src/platform/terraform-aws-vpc/vars.tf', 'vars.tf'],
  ['src/platform/terraform-aws-vpc/versions.tf', 'versions.tf'],
  ['src/platform/terraform-aws-vpc/data/user_data.bastion.sh', 'data/user_data.bastion.sh'],

  // invalid cases:
  ['src/packages/xyz/outsideScope.js', undefined], // correctly deleted
  ['package.json', undefined], // correctly deleted
]);
