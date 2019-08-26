// @flow strict

module.exports = {
  getStaticConfig() {
    return {
      repository: 'git@github.com:kiwicom/terraform-google-spinnaker-service-account.git',
    };
  },
  getPathMappings(): Map<string, string> {
    return new Map([['src/platform/terraform-google-spinnaker-service-account/', '']]);
  },
};
