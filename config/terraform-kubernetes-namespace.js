// @flow strict

module.exports = {
  getStaticConfig() {
    return {
      repository: 'git@github.com:kiwicom/terraform-kubernetes-namespace.git',
    };
  },
  getDefaultPathMappings(): Map<string, string> {
    return new Map([['src/platform/terraform-kubernetes-namespace/', '']]);
  },
};
