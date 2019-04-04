// @flow strict-local

import Sync from './Sync';

// TODO: fix fucked-up packages (where we lost Git history because of multiple roots):
// - src/packages/bc-checker -> src/packages/graphql-bc-checker
// - src/packages/global-id -> src/packages/graphql-global-id
// - src/_graphql-resolve-wrapper -> src/packages/graphql-resolve-wrapper
// - src/packages/npm-publisher -> src/packages/monorepo-npm-publisher
// - vault2env (prolly not fixable, I forgot to import this package with history from the previous repository - no biggie)

// yarn monorepo-babel-node src/packages/monorepo-shipit/src/index.js
// TODO: changeset.withDebugMessage

new Sync().run();
