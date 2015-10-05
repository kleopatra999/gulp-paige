'use strict';

var exec = require('child_process').execSync;
var gutil = require('gulp-util');

module.exports = function (_ref) {
  var address = _ref.address;
  var files = _ref.files;
  var _ref$target = _ref.target;
  var target = _ref$target === undefined ? 'local' : _ref$target;
  var _ref$webdriver = _ref.webdriver;
  var webdriver = _ref$webdriver === undefined ? {} : _ref$webdriver;
  var _ref$mochaOptions = _ref.mochaOptions;
  var mochaOptions = _ref$mochaOptions === undefined ? {} : _ref$mochaOptions;
  var _ref$options = _ref.options;
  var options = _ref$options === undefined ? {} : _ref$options;
  var webdriverUrl = webdriver.url;
  var webdriverPlatform = webdriver.platform;
  var webdriverBrowser = webdriver.browser;
  var webdriverVersion = webdriver.version;

  if (!address) {
    gutil.log(gutil.colors.red('Required application address missing.'));
    return;
  }

  if (!files) {
    gutil.log(gutil.colors.red('Required test files missing.'));
    return;
  }

  if (mochaOptions.grep && options.suite) {
    gutil.log(gutil.colors.red('Cannot grep and run a suite at the same time.'));
    return;
  }

  var paigeCommand = genPaigeCommand({
    target: target,
    address: address,
    files: files,
    webdriver: webdriver,
    mochaOptions: mochaOptions,
    options: options
  });

  gutil.log('Application URI: ' + address);
  gutil.log('WebDriver target: ' + (webdriverUrl || 'local'));
  gutil.log('WebDriver platform: ' + (webdriverPlatform || 'local'));
  gutil.log('WebDriver browser: ' + (webdriverBrowser || 'firefox'));
  if (webdriverVersion) {
    gutil.log('WebDriver version: ' + webdriverVersion);
  }

  gutil.log('Running command: ' + gutil.colors.cyan(paigeCommand));

  exec(paigeCommand, { stdio: 'inherit' });
};

function genPaigeCommand(_ref2) {
  var target = _ref2.target;
  var address = _ref2.address;
  var files = _ref2.files;
  var webdriver = _ref2.webdriver;
  var mochaOptions = _ref2.mochaOptions;
  var options = _ref2.options;

  var remoteAddress = undefined,
      paigeOptions = undefined,
      parallelOptions = undefined;

  if (target === 'remote') {
    if (!webdriver.url) {
      gutil.log(gutil.colors.red('Required webdriver address missing.'));
      return;
    }

    remoteAddress = webdriver.url;
  }

  files = '\'' + files + '\'';

  var webdriverConfig = [webdriver.platform ? '--webdriverPlatform ' + webdriver.platform : undefined, webdriver.browser ? '--webdriverBrowser ' + webdriver.browser : undefined, webdriver.version ? '--webdriverVersion ' + webdriver.version : undefined].filter(Boolean).join(' ');

  if (options.paigeOptions) {
    paigeOptions = '--additional-config ' + options.paigeOptions;
  }

  mochaOptions = [mochaOptions.bail ? '--bail' : undefined, '--slow 30000', '--timeout 20000', '--ui bdd', mochaOptions.grep ? '--grep ' + mochaOptions.grep : undefined, options.suite ? '--grep :' + options.suite + ':' : undefined].filter(Boolean).join(' ');

  if (options.parallel) {
    parallelOptions = "-p";
  }

  return ['./node_modules/.bin/paige', target, address, remoteAddress, files, webdriverConfig, paigeOptions, mochaOptions, parallelOptions, '--colors'].filter(Boolean).join(' ');
}
