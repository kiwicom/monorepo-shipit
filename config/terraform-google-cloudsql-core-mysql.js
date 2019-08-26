// @flow strict

module.exports = {
  getStaticConfig() {
    return {
      repository: 'git@github.com:kiwicom/terraform-google-cloudsql-core-mysql.git',
    };
  },
  getPathMappings(): Map<string, string> {
    return new Map([['src/platform/terraform-google-cloudsql-core-mysql/', '']]);
  },
};
