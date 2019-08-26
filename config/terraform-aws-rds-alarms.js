// @flow strict

module.exports = {
  getStaticConfig() {
    return {
      repository: 'git@github.com:kiwicom/terraform-aws-rds-alarms.git',
    };
  },
  getPathMappings(): Map<string, string> {
    return new Map([['src/platform/terraform-aws-rds-alarms/', '']]);
  },
};
