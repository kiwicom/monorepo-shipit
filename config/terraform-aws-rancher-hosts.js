// @flow strict

module.exports = {
  getStaticConfig() {
    return {
      repository: 'git@github.com:kiwicom/terraform-aws-rancher-hosts.git',
    };
  },
  getPathMappings(): Map<string, string> {
    return new Map([['src/platform/terraform-aws-rancher-hosts/', '']]);
  },
};
