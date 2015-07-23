'use strict';

var exec = require('child_process').exec,
    gutil = require('gulp-util');

var paigeBin = './node_modules/.bin/paige';

module.exports = function(options) {
  var genPaigeCommand,
      runPaige;

  genPaigeCommand = function(options) {
    var command = options.command || 'local',
        hostAddr = options.address,
        dir = options.files,
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
      // suite !== "undefined" ? "--grep :" + suite + ":" : void 0
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
  };

  runPaige = function() {
    var command,
        runPaigeCommand;

    command = genPaigeCommand(options);

    runPaigeCommand = exec(command,
      function(err, stdout, stderr) {
        gutil.log(stdout);
        gutil.log(gutil.colors.red(stderr));
        if (err !== null) {
          gutil.log(gutil.colors.red(err));
        }
    });
  };
  runPaige();
};


