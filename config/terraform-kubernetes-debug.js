// @flow strict

module.exports = {
  getStaticConfig() {
    return {
      repository: 'git@github.com:kiwicom/terraform-kubernetes-debug.git',
    };
  },
  getPathMappings(): Map<string, string> {
    return new Map([['src/platform/terraform-kubernetes-debug/', '']]);
  },
};
