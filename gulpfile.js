var gulp = require('gulp');

var sass = require('gulp-sass');
var uncss = require('gulp-uncss');
var browserSync = require('browser-sync').create();
var useref = require('gulp-useref');
var sourcemaps = require('gulp-sourcemaps');
var autoprefixer = require('gulp-autoprefixer');

// Other requires...
var uglify = require('gulp-uglify');
var gulpIf = require('gulp-if');
var cssnano = require('gulp-cssnano');
var imagemin = require('gulp-imagemin');
var cache = require('gulp-cache');
var runSequence = require('run-sequence');
var del = require('del');
var jsonminify = require('gulp-jsonminify');

// Development Tasks
gulp.task('watch', ['browserSync', 'sass'], function(){
	gulp.watch('app/scss/**/*.scss', ['sass']);
	// Reloads the browser whenever HTML of JS files change
	gulp.watch('app/*.html', browserSync.reload);
	gulp.watch('app/js/**/*.js', browserSync.reload);
});

gulp.task('browserSync', function(){
	browserSync.init({
		server: {
			baseDir: 'app'
		}
	})
});

gulp.task('sass', function(){
	//return gulp.src('app/scss/style.scss')
	return gulp.src('app/scss/**/*.scss')
		.pipe(sourcemaps.init())
		.pipe(sass().on('error', sass.logError))
		.pipe(sourcemaps.write('.'))
		.pipe(gulp.dest('app/css'))
		.pipe(browserSync.reload({
			stream: true
		}))
});

//

// Optimisation Tasks
gulp.task('images', function(){
	return gulp.src('app/images/**/*.+(png|jpg|gif|svg)')
		// Caching images that have run through imagemin
		.pipe(cache(imagemin({
			interlaced: true
		})))
		.pipe(gulp.dest('public/images'))
});
gulp.task('fonts', function(){
	return gulp.src('app/fonts/**/*')
		.pipe(gulp.dest('public/fonts'))
});
gulp.task('useref', function(){
	return gulp.src('app/*.html')
		.pipe(useref())
		// Minifies only if it's a JS file
		.pipe(gulpIf('*.js', uglify()))
		.pipe(gulp.dest('public'))
		// Remove unused CSS
		/*.pipe(uncss({
			html: ['index.html']
		}))*/
		// Minifies only if it's a CSS file
		.pipe(gulpIf('*.css', cssnano()))
		.pipe(gulp.dest('public'))
});
gulp.task('jsonminify', function(){
	return gulp.src('app/api/*.json')
		.pipe(jsonminify())
		.pipe(gulp.dest('public/api'))		
});
gulp.task('clean:public', function(){
	return del.sync('public');
});

gulp.task('movemanifest', function(){
	return gulp.src('app/manifest.json')
		.pipe(jsonminify())
		.pipe(gulp.dest('public'))
});
gulp.task('moveserviceworker', function(){
	return gulp.src('app/service-worker.js')
		.pipe(gulp.dest('public'))
})
gulp.task('movereset', function(){
	return gulp.src('app/reset/*')
		.pipe(gulp.dest('public/reset'))
});
//

// Tie everything together into one glorious whole
/*gulp.task('task-name', function(callback) {
  runSequence('task-one', 'task-two', 'task-three', callback);
});*/
gulp.task('build', function(){
	runSequence(
		'clean:public',
		['sass','images','fonts','jsonminify','useref', 'movemanifest', 'moveserviceworker', 'movereset'])
});

gulp.task('default', function(){
	runSequence(['sass','browserSync','watch'])
});