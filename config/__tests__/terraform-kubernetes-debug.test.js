// @flow strict-local

import path from 'path';

import testExportedPaths from './testExportedPaths';

testExportedPaths(path.join(__dirname, '..', 'terraform-kubernetes-debug.js'), [
  ['src/platform/terraform-kubernetes-debug/interface.tf', 'interface.tf'],
  ['src/platform/terraform-kubernetes-debug/main.tf', 'main.tf'],

  // invalid cases:
  ['src/packages/xyz/outsideScope.js', undefined], // correctly deleted
  ['package.json', undefined], // correctly deleted
]);
