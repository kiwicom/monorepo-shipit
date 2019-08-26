// @flow strict

module.exports = {
  getStaticConfig() {
    return {
      repository: 'git@github.com:kiwicom/terraform-datadog-rds-timeboard.git',
    };
  },
  getPathMappings(): Map<string, string> {
    return new Map([['src/platform/terraform-datadog-rds-timeboard/', '']]);
  },
};
