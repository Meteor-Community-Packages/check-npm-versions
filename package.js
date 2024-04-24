/* global Package:readonly, Npm:readonly  */
Package.describe({
  name: 'tmeasday:check-npm-versions',
  version: '1.0.3',
  summary: 'Check that required npm packages are installed at the app level',
  git: 'https://github.com/tmeasday/check-npm-versions.git',
  documentation: 'README.md',
});

Npm.depends({ semver: '6.3.0' }); // 7.x versions are incompatible with Internet Explorer

Package.onUse(function (api) {
  api.versionsFrom(['2.0', '3.0-rc.0']);
  api.use('typescript');
  api.use('zodern:types');
  api.mainModule('check-npm-versions.ts');
});
