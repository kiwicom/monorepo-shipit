// @flow strict-local

import path from 'path';

import testExportedPaths from './testExportedPaths';

testExportedPaths(
  path.join(__dirname, '..', 'terraform-gitlab-project-cluster.js'),
  [
    [
      'src/platform/terraform-gitlab-project-cluster/environment_scope.sh',
      'environment_scope.sh',
    ],
    ['src/platform/terraform-gitlab-project-cluster/main.tf', 'main.tf'],
    [
      'src/platform/terraform-gitlab-project-cluster/variables.tf',
      'variables.tf',
    ],

    // invalid cases:
    ['src/packages/xyz/outsideScope.js', undefined], // correctly deleted
    ['package.json', undefined], // correctly deleted
  ],
);
