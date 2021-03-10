/* global Package:readonly, Npm:readonly  */
Package.describe({
  name: 'tmeasday:check-npm-versions',
  version: '1.0.1',
  summary: 'Check that required npm packages are installed at the app level',
  git: 'https://github.com/tmeasday/check-npm-versions.git',
  documentation: 'README.md',
});

Npm.depends({ semver: '7.3.4' });

Package.onUse(function (api) {
  api.versionsFrom('2.0');
  api.use('typescript');
  api.mainModule('check-npm-versions.ts');
});
