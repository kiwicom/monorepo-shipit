// @flow strict

module.exports = {
  getStaticConfig() {
    return {
      repository: 'git@github.com:kiwicom/terraform-aws-cpu-autoscaling.git',
    };
  },
  getPathMappings(): Map<string, string> {
    return new Map([['src/platform/terraform-aws-cpu-autoscaling/', '']]);
  },
};
