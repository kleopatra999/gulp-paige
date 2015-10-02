# gulp-paige
Run Paige with gulp!

```
var paige = require('gulp-paige');

// ---Paige Tests---
gulp.task('paige', function() {
  paige({
    address: 'http://example.com',
    files: 'test/spec/**/*.js'
  });
});
```

## Configuration options:

#### address (required)
Type: `string`

URL of the site being tested

#### files (required)
Type: `string`

Location of the test files. Can be a file or a glob pattern (`test/spec/**/*.js`)

#### target
Type: `string`  
Default: `'local'`

Webdriver location. Options are `local` or `remote`.  
*Note:* Must be given a webdriver url in `webdriver.url` if this option is set to `remote`.

#### webdriver
Type: `object`

Object containing webdriver options, which include:

##### browser
Type: `string`  
Default: `'firefox'`

Desired browser driver to run tests.  
*Note:* Drivers other than firefox must be downloaded and installed individually.

##### url
Type: `string`

Remote webdriver's URL. Only used if `target` is set to `remote`.

#### mochaOptions
Type: `object`

Object containing mocha options, which include:

##### bail
Type: `boolean`  
Default: `false`

If `true`, stops test after first failure

##### grep
Type: `string`

Only run tests with descriptions that match the pattern given  
Example: Passing `'Does this thing'` will only run tests that have "Does this thing" in their description

#### options
Type: `object`

Object containing additional configuration options, which include:

##### parallel
Type: `boolean`  
Default: `false`

Boolean representing whether tests should be run in parallel or not

##### paigeOptions
Type: `string`

String containing additional Paige CLI options
