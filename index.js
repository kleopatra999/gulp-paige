'use strict';

var spawn = require('child_process').spawn,
    readline = require('readline'),
    gutil = require('gulp-util');

module.exports = function(config) {
  runPaige(config);
};

function runPaige(config) {
  var address = config.address,
      files = config.files,
      webdriverAddress,
      webdriverBrowser,
      webdriverPlatform,
      webdriverVersion,
      paigeCommand,
      runPaigeCommand,
      readlinePaige;

  if (!address) {
    gutil.log(gutil.colors.red('Required application address missing.'));
    return;
  }

  if (!files) {
    gutil.log(gutil.colors.red('Required test files missing.'));
    return;
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
  console.log('         |\\');
  console.log('         | \\');
  console.log('         |  \\（ヽ,,');
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

  paigeCommand = genPaigeCommand(config);

  runPaigeCommand = spawn(paigeCommand.command, paigeCommand.args);

  readlinePaige = readline.createInterface({
    input: runPaigeCommand.stdout,
    terminal : false
  });

  readlinePaige.on('line', function(line) {
    console.log(line);
  });

  runPaigeCommand.on('close', function (code) {
    if (code !== 0) {
      gutil.log(gutil.colors.red('Paige exited with code ' + code));
    }
    readlinePaige.close();
  });
}

function genPaigeCommand(options) {
  var command = 'local',
      hostAddr = options.address,
      dir = options.files,
      suite = options.suite,
      mochaOpts,
      paigeOpts,
      parallelOpts,
      paigeCommand;

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

  paigeCommand = {
    command: './node_modules/.bin/paige',
    args: [
      command,
      hostAddr,
      dir,
      paigeOpts || '',
      mochaOpts || '',
      parallelOpts || '',
      '--colors'
    ]
  };

  gutil.log("Running command: " + gutil.colors.cyan(paigeCommand.command + ' ' + (paigeCommand.args.join(' '))));

  return paigeCommand;
}
