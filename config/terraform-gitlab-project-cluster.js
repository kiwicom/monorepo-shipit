// @flow strict

module.exports = {
  getStaticConfig() {
    return {
      repository: 'git@github.com:kiwicom/terraform-gitlab-project-cluster.git',
    };
  },
  getDefaultPathMappings(): Map<string, string> {
    return new Map([['src/platform/terraform-gitlab-project-cluster/', '']]);
  },
};