import autoprefixer from 'autoprefixer';
import browsersync from 'browser-sync';
import cssnano from 'cssnano';
import del from 'del';
import gulp from 'gulp';
import cache from 'gulp-cache';
import gulpIf from 'gulp-if';
import imagemin from 'gulp-imagemin';
import postcss from 'gulp-postcss';
import sass from 'gulp-sass';
import terser from 'gulp-terser';
import useref from 'gulp-useref';

const paths = {
	html    : {
		src  : 'app/*.html',
		dest : 'dist'
	},
	sass    : {
		src  : 'app/scss/**/*.scss',
		// main : 'app/scss/*.scss',
		dest : 'app/css'
	},
	styles  : {
		src  : 'app/css/**/*.css',
		dest : 'dist/css'
	},
	scripts : {
		src  : 'app/js/**/*.js',
		dest : 'dist/js'
	},
	images  : {
		src  : 'app/images/**/*.+(png|jpg|gif|svg)',
		dest : 'dist/images'
	},
	fonts   : {
		src  : 'app/fonts/**/*',
		dest : 'dist/fonts'
	}
};

//=== Browser Sync ===//

export async function browserSync() {
	browsersync.init({
		server : {
			baseDir : 'app'
		},
		port   : 3000
	});
}

// browserSync reload
export async function reload() {
	browsersync.reload();
}

//--------------------//

// Clear everything in the distribution folder
export const clean = () => {
	return del([ 'dist/*' ]);
};

// sass compilation
export function compSass() {
	//prettier-ignore
	return gulp
        .src(paths.sass.src)
        .pipe(sass())
        .pipe(gulp.dest(paths.sass.dest))
        .pipe(browsersync.stream());
}

// concat styles & scripts
function buildUseref() {
	const plugins = [ autoprefixer(), cssnano() ];
	return (
		gulp
			.src(paths.html.src)
			.pipe(useref())
			// Minifies only if it's a js file
			.pipe(gulpIf('*.js', terser()))
			// Minifies only if it's a css file
			.pipe(gulpIf('*.css', postcss(plugins)))
			.pipe(gulp.dest('dist'))
	);
}
export { buildUseref as useref };

// minify images
export async function images() {
	//prettier-ignore
	return (
		gulp
			.src(paths.images.src)
			// caching images that ran through imagemin
			.pipe(cache(
				imagemin( {interlaced: true} )
			))
			.pipe(gulp.dest(paths.images.dest))
	);
}

// fonts
export function fonts() {
	return gulp.src(paths.fonts.src).pipe(gulp.dest(paths.fonts.dest));
}

//=== Watch for changes ===//

async function watchFiles(callback) {
	compSass();
	browserSync();
	gulp.watch(paths.sass.src, gulp.series(compSass, reload));
	gulp.watch(paths.scripts.src, reload);
	gulp.watch(paths.html.src).on('change', reload);
	callback();
}
export { watchFiles as watch };

//-------------------------//

export const build = async () => {
	console.log('Building Files...');

	await gulp.series(clean, gulp.parallel(gulp.series(compSass, buildUseref), images, fonts))();
};
