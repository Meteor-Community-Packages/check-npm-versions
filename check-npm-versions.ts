import { Meteor } from 'meteor/meteor';
import semver from 'semver';

type boolOrString = boolean | string;

interface indexBoolorString {
  [key: string]: boolOrString
}

interface indexAny {
  [key: string]: any
}

// Returns:
//   - true      if a version of the package in the range is installed
//   - false     if no version is installed
//   - version#  if incompatible version is installed
const compatibleVersionIsInstalled = (name: string, range: string | semver.Range): boolOrString => {
  try {
    const installedVersion = require(`${name}/package.json`).version;
    if (semver.satisfies(installedVersion, range)) {
      return true;
    } else {
      return installedVersion;
    }
  } catch (e: any) {
    // XXX add something to the tool to make this more reliable
    const message = e.toString();
    // One message comes out of the installation npm package the other from npm directly
    if (message.includes('Cannot find module') || message.includes("Can't find npm module")) {
      return false;
    } else {
      throw e;
    }
  }
};

export const checkNpmVersions = (packages: indexAny, packageName: string): void => {
  if (Meteor.isDevelopment) {
    const failures: indexBoolorString = {};

    for (const name of Object.keys(packages)) {
      const range = packages[name];
      const failure = compatibleVersionIsInstalled(name, range);

      if (failure !== true) {
        failures[name] = failure;
      }
    }

    if (Object.keys(failures).length === 0) {
      return;
    }

    const errors: string[] = [];

    for (const name of Object.keys(failures)) {
      const installed = failures[name];
      const requirement = `${name}@${packages[name]}`;

      if (installed) {
        errors.push(` - ${name}@${installed} installed, ${requirement} needed`);
      } else {
        errors.push(` - ${name}@${packages[name]} not installed.`);
      }
    }

    const qualifier = packageName ? `(for ${packageName}) ` : '';
    console.warn(`WARNING: npm peer requirements ${qualifier}not installed:
  ${errors.join('\n')}

  Read more about installing npm peer dependencies:
    http://guide.meteor.com/using-packages.html#peer-npm-dependencies
  `);
  }
};
