// @flow strict-local

import path from 'path';

import testExportedPaths from './testExportedPaths';

testExportedPaths(
  path.join(__dirname, '..', 'terraform-kubernetes-namespace.js'),
  [
    ['src/platform/terraform-kubernetes-namespace/outputs.tf', 'outputs.tf'],
    ['src/platform/terraform-kubernetes-namespace/main.tf', 'main.tf'],
    [
      'src/platform/terraform-kubernetes-namespace/variables.tf',
      'variables.tf',
    ],

    // invalid cases:
    ['src/packages/xyz/outsideScope.js', undefined], // correctly deleted
    ['package.json', undefined], // correctly deleted
  ],
);
