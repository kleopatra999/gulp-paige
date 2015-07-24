# gulp-paige
Run Paige with gulp!

## Required parameters:
**address:** address to be tested

**files:** location of test spec files

```
var paige = require('gulp-paige');

// ---Paige Tests---
gulp.task('paige', function() {
  paige({
    address: 'example.com',
    files: 'test/spec/**/*.js'
  });
});
```
