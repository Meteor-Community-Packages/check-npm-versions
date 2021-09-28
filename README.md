# check-npm-versions

Enforces "peer" npm dependencies in Meteor packages.

Use this package if you are writing an Meteor package that depends on a given npm package is installed at the app level of projects you are installed in.

## Usage

If you are depending on a npm-distributed React component, you don't want to `Npm.depends()` on the npm package in your Meteor package, as this will mean a second copy of React will be shipped client-side as a sub-dependency of your package. Instead, you can do:

```js
import { checkNpmVersions } from 'meteor/tmeasday:check-npm-versions';
checkNpmVersions({
  'griddle-react': '0.3.x'
}, 'my:griddle-package');

const Griddle = require('griddle-react');
```

>This must be run on the server so that it has access to the package.json of the package where it can examine the version that is installed.

This will prompt the user with an warning message if they do not install `griddle-react` at a correct version directly in their application. If they install no version at all, your `require` statement will subsequently fail.

In your install instructions, you'll still want to tell them to `npm install --save griddle-react` --- this will just tell them what's wrong if they do not.

## Gotchas

### use require statement
You must use `require` rather than `import`, unless you do the check in a separate file, as `import` is hoisted to the top of the file (and thus will error before the call to `checkNpmVersions`, which means the user won't see the helpful warning telling them what to do).

### package subfolders
If you `import` or `require` a subfolder of a package and have no other references to the package, E.g.:

```javascript
import 'packageName/subfolder';
```

`checkNpmVersions` will output an install failure warning.

`checkNpmVersions` depends on finding `packageName/package.json` for your package.  The meteor `modules-runtime` package builds a data tree of all packages referenced in `import` or `require` statements.  When `packageName/subFolder` is the only reference, `modules-runtime` only recognizes that subfolder and things within it and it cannot find `packageName/package.json`.  This will cause `checkNpmVersions` to believe the package is not loaded, when in fact `packaageName/subfolder` has loaded fine.

This is easily remedied by `whitelisting` the package.json file:

```javascript
if(false) {
  require('packageName/package.json`);
 }
 ```
 
 ### .npm folder
 Sometimes the `modules-runtime` can get confused about what is in  the `.npm` folder and what is in the peer `node_modules` folder.
 
 Make sure you do not have collisions with `Npm.depends` dependencies.  Then you can "clean" build like this:
 ```bash
 rm -rf /path/to/myPackage/.npm
 cd /path/to/myProject
 meteor reset
 meteor run
 ```
 
 
