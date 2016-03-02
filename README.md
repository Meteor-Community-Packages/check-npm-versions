# check-npm-versions

Allows "peer" npm dependencies in Meteor 1.3 Atmosphere packages.

Use this package if you are writing an Atmosphere package that depends on a given Npm package is installed at the app level of projects you are installed in.

For example, if you are depending on a Npm-distributed React component, you don't want to `Npm.depends()` on the Npm package in your Atmosphere package, as this will mean a second copy of React will be shipped client-side as a sub-dependency of your package. Instead, you can do:

```js
import { checkNpmVersions } from 'meteor/tmeasday:check-npm-versions';
checkNpmVersions({
  'griddle-react': '0.3.x'
});

const Griddle = require('griddle-react');
```

This will prompt the user with an error message if they do not install `griddle-react` at a correct version directly in their application. In your install instructions, you'll still want to tell them to `npm install --save griddle-react` --- this will just tell them what's wrong if they do not.

Note that you must use `require` rather than `import`, unless you do the check in a separate file, as `import` is hoisted to the top of the file (and thus before the call to `checkNpmVersions`).