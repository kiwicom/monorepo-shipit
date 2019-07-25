// @flow strict

module.exports = {
  getStaticConfig() {
    return {
      repository: 'git@github.com:kiwicom/terraform-google-instance-group-named-ports.git',
    };
  },
  getPathMappings(): Map<string, string> {
    return new Map([['src/platform/terraform-google-instance-group-named-ports/', '']]);
  },
};
