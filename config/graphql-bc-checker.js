// @flow strict

module.exports = {
  getStaticConfig() {
    return {
      repository: 'git@github.com/kiwicom/graphql-bc-checker.git',
    };
  },
  getDefaultPathMappings(): Map<string, string> {
    return new Map([['src/packages/graphql-bc-checker/', '']]);
  },
};
