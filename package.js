/* global Package:readonly, Npm:readonly  */
Package.describe({
  name: 'tmeasday:check-npm-versions',
  version: '2.0.0',
  summary: 'Check that required npm packages are installed at the app level',
  git: 'https://github.com/tmeasday/check-npm-versions.git',
  documentation: 'README.md',
});

Npm.depends({ semver: '6.3.0' }); // 7.x versions are incompatible with Internet Explorer

Package.onUse(function (api) {
  api.versionsFrom(['2.8.0', '3.0.1']);
  api.use('typescript');
  api.use('zodern:types@1.0.13');
  api.mainModule('check-npm-versions.ts');
});
