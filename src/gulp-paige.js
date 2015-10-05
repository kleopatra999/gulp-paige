const exec = require('child_process').execSync;
const gutil = require('gulp-util');

module.exports = function({ address, files, target = 'local', webdriver = {}, mochaOptions = {}, options = {} }) {
  const { url: webdriverUrl, platform: webdriverPlatform, browser: webdriverBrowser, version: webdriverVersion } = webdriver;

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

  const paigeCommand = genPaigeCommand({
    target,
    address,
    files,
    webdriver,
    mochaOptions,
    options
  });

  gutil.log(`Application URI: ${address}`);
  gutil.log('WebDriver target: ' + (webdriverUrl || 'local'));
  gutil.log('WebDriver platform: ' + (webdriverPlatform || 'local'));
  gutil.log('WebDriver browser: ' + (webdriverBrowser || 'firefox'));
  if (webdriverVersion) {
    gutil.log(`WebDriver version: ${webdriverVersion}`);
  }

  gutil.log('Running command: ' + gutil.colors.cyan(paigeCommand));

  exec(paigeCommand, { stdio: 'inherit' });
}

function genPaigeCommand({ target, address, files, webdriver, mochaOptions, options }) {
  let remoteAddress, paigeOptions, parallelOptions;

  if (target === 'remote') {
    if (!webdriver.url) {
      gutil.log(gutil.colors.red('Required webdriver address missing.'));
      return;
    }

    remoteAddress = webdriver.url;
  }

  files = `'${files}'`;

  const webdriverConfig = [
    webdriver.platform ? `--webdriverPlatform ${webdriver.platform}` : undefined,
    webdriver.browser ? `--webdriverBrowser ${webdriver.browser}` : undefined,
    webdriver.version ? `--webdriverVersion ${webdriver.version}` : undefined
  ].filter(Boolean).join(' ');

  if (options.paigeOptions) {
    paigeOptions = `--additional-config ${options.paigeOptions}`;
  }

  mochaOptions = [
    mochaOptions.bail ? '--bail' : undefined,
    '--slow 30000',
    '--timeout 20000',
    '--ui bdd',
    mochaOptions.grep ? `--grep ${mochaOptions.grep}` : undefined,
    options.suite ? `--grep :${options.suite}:` : undefined
  ].filter(Boolean).join(' ');

  if (options.parallel) {
    parallelOptions = "-p";
  }

  return [
    './node_modules/.bin/paige',
    target,
    address,
    remoteAddress,
    files,
    webdriverConfig,
    paigeOptions,
    mochaOptions,
    parallelOptions,
    '--colors'
  ].filter(Boolean).join(' ');
}
