import semver from 'semver';
import { _ } from 'meteor/underscore';

// Returns:
//   - true      if a version of the package in the range is installed
//   - false     if no version is installed
//   - version#  if incompatible version is installed
const compatibleVersionIsInstalled = (name, range) => {
  try {
    const installedVersion = require(`${name}/package.json`).version;  
    if (semver.satisfies(installedVersion, range)) {
      return true;
    } else {
      return installedVersion;
    }
  } catch (e) {
    console.log(e)
    // XXX I guess the only error here is that the module doesn't exist?
    return false;
  }
};

export const checkNpmVersions = (packages, packageName) => {
  const failures = {};
  _.forEach(packages, (range, name) => {
    const failure = compatibleVersionIsInstalled(name, range);
    if (failure !== true) {
      failures[name] = failure;
    }
  });

  if (_.keys(failures).length === 0) {
    return true;
  }

  const errors = [];
  _.forEach(failures, (installed, name) => {
    const requirement = `${name}@${packages[name]}`;

    if (installed) {
      errors.push(` - ${name}@${installed} installed, ${requirement} needed`);
    } else {
      errors.push(` - ${name}@${packages[name]} not installed.`);
    }
  });

  const qualifier = packageName ? `(for ${packageName}) ` : '';
  console.warn(`WARNING: npm peer requirements ${qualifier}not installed:
${errors.join('\n')}

Read more about installing npm peer dependencies:
  http://guide.meteor.com/using-packages.html#peer-npm-dependencies
`);
};
