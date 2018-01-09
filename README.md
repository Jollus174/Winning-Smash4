# Winning at Smash4
A PWA for effective kill confirms in Super Smash Bros. for Wii U.

This is currently under production and not ready for release.

# Installation
To install, make sure Gulp is first installed `npm install gulp -g`

Then create a Gulp project under **_path/to/app_** 'npm init'
Leave all values as default for now.

Then install Gulp to the project `npm install gulp --save-dev`

## Download dependencies

`npm install gulp-sass browser-sync gulp-useref gulp-if gulp-cache gulp-uglify gulp-sourcemaps --save-dev`

`npm install gulp-cssnano gulp-uncss gulp-imagemin gulp-cache del run-sequence gulp-jsonminify gulp-autoprefixer --save-dev`

To make edits and automatically compile SASS commands, use `gulp`

To create a build, use `gulp build`