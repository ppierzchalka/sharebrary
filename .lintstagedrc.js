const { execSync } = require('child_process');

const getAffectedFiles = () => {
  try {
    const output = execSync('git diff --cached --name-only --diff-filter=ACMR')
      .toString()
      .trim();
    return output.length ? output.split('\n') : [];
  } catch (error) {
    console.error('Error getting affected files:', error);
    return [];
  }
};

module.exports = {
  '*': (files) => {
    const affectedFiles = getAffectedFiles();
    if (affectedFiles.length === 0) return [];

    const commands = ['nx affected --target=lint', 'nx affected --target=test'];

    return commands;
  },
};
