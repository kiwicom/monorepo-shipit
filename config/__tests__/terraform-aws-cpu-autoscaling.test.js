// @flow strict-local

import path from 'path';

import testExportedPaths from './testExportedPaths';

testExportedPaths(path.join(__dirname, '..', 'terraform-aws-cpu-autoscaling.js'), [
  ['src/platform/terraform-aws-cpu-autoscaling/versions.tf', 'versions.tf'],
  ['src/platform/terraform-aws-cpu-autoscaling/module.tf', 'module.tf'],
  ['src/platform/terraform-aws-cpu-autoscaling/interface.tf', 'interface.tf'],

  // invalid cases:
  ['src/packages/xyz/outsideScope.js', undefined], // correctly deleted
  ['package.json', undefined], // correctly deleted
]);
