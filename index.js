'use strict';

var exec = require('child_process').exec,
    gutil = require('gulp-util');

var paigeBin = './node_modules/.bin/paige';

module.exports = function(config) {
  runPaige(config);
};

function runPaige(config) {
  var command,
      runPaigeCommand,
      address,
      files,
      suite,
      target,
      webdriverAddress,
      webdriverBrowser,
      webdriverPlatform,
      webdriverVersion;

  address = config.address;
  if (!address) {
    gutil.log(gutil.colors.red('Required application address missing.'));
  }

  webdriverAddress = config.webdriverUrl || 'local';
  webdriverPlatform = config.webdriverPlatform || 'local';
  webdriverBrowser = config.webdriverBrowser || 'firefox';
  webdriverVersion = config.webdriverVersion || '';

  gutil.log("Application URI: " + address);
  gutil.log("WebDriver target: " + webdriverAddress);
  gutil.log("WebDriver platform: " + webdriverPlatform);
  gutil.log("WebDriver browser: " + webdriverBrowser);
  gutil.log("WebDriver version: " + webdriverVersion);
  gutil.log('');
  console.log('');
  console.log('        |\\');
  console.log('        | \\');
  console.log('        |  \\ （ヽ,,');
  console.log('　＿,,,,,|,))))ヽ,i彡');
  console.log('（・ |　　　●    彡ﾐ');
  console.log(' ＞イ|　　　　　  彡ﾐ');
  console.log('　￣￣￣ヽ_　   彡彡ﾐ');
  console.log('　　 　　／　　   彡ﾐ');
  console.log('　　    ∠ ＿＿   彡ﾐ');
  console.log('');

  if (config.grep && (config.suite != null)) {
    gutil.log(gutil.colors.red('Cannot grep and run a suite at the same time.'));
  }

  command = genPaigeCommand(config);

  runPaigeCommand = exec(command,
    function(err, stdout, stderr) {
      gutil.log(stdout);
      gutil.log(gutil.colors.red(stderr));
      if (err !== null) {
        gutil.log(gutil.colors.red(err));
      }
  });
}

function genPaigeCommand(options) {
  var command = options.command || 'local',
      hostAddr = options.address,
      dir = options.files,
      suite = options.suite,
      mochaOpts,
      paigeOpts,
      parallelOpts,
      remoteConfigs,
      webdriverAddr,
      paigeCommand;

  hostAddr = "" + (!/[a-z](?:[a-z0-9+\-.])*:\/\//i.test(hostAddr) ? 'http://' : void 0) + hostAddr;
  dir = "'" + dir + "'";

  if (command === 'remote') {
    webdriverAddr = options.webdriverUrl;

    if (!webdriverAddr) {
      gutil.log(gutil.colors.red("Required webdriver address missing."));
    }

    webdriverAddr = "" + (!/[a-z](?:[a-z0-9+\-.])*:\/\//i.test(webdriverAddr) ? 'http://' : void 0) + webdriverAddr;
  }

  remoteConfigs = [
    options.webdriverPlatform ? "--webdriverPlatform " + options.webdriverPlatform : void 0,
    options.webdriverBrowser ? "--webdriverBrowser " + options.webdriverBrowser : void 0,
    options.webdriverVersion ? "--webdriverVersion " + options.webdriverVersion : void 0
  ].join(' ');

  mochaOpts = [
    options.bail ? "--bail" : void 0,
    "--slow 30000",
    "--timeout 20000",
    "--ui bdd",
    options.grep ? "--grep " + options.grep : void 0,
    options.suite ? "--grep :" + suite + ":" : void 0
  ].join(' ');

  if (options.additionalConfigs) {
    paigeOpts = "--additional-config " + options.additionalConfigs;
  }

  if (options.parallel) {
    parallelOpts = "-p";
  }

  paigeCommand = [
    paigeBin,
    command,
    hostAddr,
    webdriverAddr,
    dir,
    paigeOpts || '',
    remoteConfigs || '',
    mochaOpts || '',
    parallelOpts || '',
    '--colors'
  ];

  gutil.log("Running command: " + (paigeCommand.join(' ')));

  return paigeCommand.join(' ');
}
