// @flow strict

module.exports = {
  getStaticConfig() {
    return {
      repository: 'git@github.com:kiwicom/terraform-datadog-aws-lb-alarms.git',
    };
  },
  getPathMappings(): Map<string, string> {
    return new Map([['src/platform/terraform-datadog-aws-lb-alarms/', '']]);
  },
};
