import semver from 'semver';
import {_} from 'meteor/underscore';

const packageIsInstalled = (name, range) => {
  try {
    const installedVersion = require(`${name}/package.json`).version;  
    return semver.satisfies(installedVersion, range);
  } catch (e) {
    // XXX I guess the only error here is that the module doesn't exist?
    return false;
  }
};

export const checkNpmVersions = (packages) => {
  const failures = [];
  _.forEach(packages, (range, name) => {
    if (!packageIsInstalled(name, range)) {
      failures.push(name);
    }
  });

  if (failures.length === 0) {
    return true;
  }

  failures.forEach(name => {
    const error = failures.map(n => `${n}@${packages[n]} not installed.`).join('\n');
    throw new Error(error);
  });
};
