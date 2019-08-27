// @flow strict-local

import path from 'path';

import testExportedPaths from './testExportedPaths';

testExportedPaths(path.join(__dirname, '..', 'terraform-aws-rancher-hosts.js'), [
  ['src/platform/terraform-aws-rancher-hosts/module.tf', 'module.tf'],
  ['src/platform/terraform-aws-rancher-hosts/output.tf', 'output.tf'],
  ['src/platform/terraform-aws-rancher-hosts/providers.tf', 'providers.tf'],
  ['src/platform/terraform-aws-rancher-hosts/vars.tf', 'vars.tf'],
  ['src/platform/terraform-aws-rancher-hosts/versions.tf', 'versions.tf'],
  ['src/platform/terraform-aws-rancher-hosts/userdata/r-host.sh.template', 'userdata/r-host.sh.template'],

  // invalid cases:
  ['src/packages/xyz/outsideScope.js', undefined], // correctly deleted
  ['package.json', undefined], // correctly deleted
]);
