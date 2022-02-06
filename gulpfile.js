const gulp = require("gulp");
const browserSync = require("browser-sync").create();
const sass = require("gulp-sass")(require("sass"));
const babel = require("gulp-babel");
const uglify = require("gulp-uglify");
const concat = require("gulp-concat");
const cssnano = require("gulp-cssnano");
const rename = require("gulp-rename");
const autoprefixer = require("gulp-autoprefixer");
const imagemin = require("gulp-imagemin");
const del = require("del");
const header = require("gulp-header");
const cleanCSS = require("gulp-clean-css");
const pkg = require("./package.json");
var sourcemaps = require("gulp-sourcemaps");

//const notify = require('gulp-notify');

// Set the banner content
const banner = [
  "/*!\n",
  " * <%= pkg.title %> v<%= pkg.version %> (<%= pkg.homepage %>)\n",
  " * Copyright " + new Date().getFullYear(),
  " <%= pkg.author %>\n",
  " * Licensed under <%= pkg.license %>\n",
  " */\n",
  "",
].join("");


// Compile sass into CSS & auto-inject into browsers
gulp.task('sass', function() {
	return (
    gulp
      .src(["src/scss/main.scss"])
      .pipe(sourcemaps.init())
      .pipe(
        sass({
          errLogToConsole: true,
          outputStyle: "compressed",
        }).on("error", sass.logError)
      )
      .pipe(header(banner, { pkg: pkg }))
      .pipe(
        autoprefixer({
          Browserslist: ["last 25 versions"],
        })
      )
      // .pipe(gulp.dest("./docs/css"))
      //   .pipe(cleanCSS({ compatibility: "ie8" }))
    //   .pipe(sourcemaps.write("."))
      .pipe(rename({ suffix: ".min" }))
    //   .pipe(gulp.dest("src/css"))
      .pipe(cssnano())
      .pipe(gulp.dest("./docs/css"))
      //        .pipe(notify({ message: 'Styles task complete'}))
      .pipe(browserSync.stream())
  );
	});

// Generate assest collateral.  Optimizing images
gulp.task("collateral", function () {
  return gulp
    .src(["src/assets/*.png"])
    .pipe(
      imagemin([
        imagemin.gifsicle({ interlaced: true }),
        imagemin.jpegtran({ progressive: true }),
        imagemin.optipng({ optimizationLevel: 5 }),
        imagemin.svgo({
          plugins: [{ removeViewBox: true }, { cleanupIDs: false }],
        }),
      ])
    )
    .pipe(gulp.dest("docs/assets"))
    .pipe(browserSync.stream());
});

// Copy over central files
gulp.task('html', function() {
    // return gulp.src(['src/index.html', 'src/privacy.html', 'src/faq.html', 'src/terms.html'])
    return gulp.src(['src/index.html'])
        .pipe(gulp.dest("docs/"))
        .pipe(browserSync.stream());
});

// Copy over favicon
gulp.task("favicon", function () {
  return gulp
    .src(["src/favicon.ico"])
    .pipe(gulp.dest("docs/"))
    .pipe(browserSync.stream());
});

// Optimize any SVG's
gulp.task("svg", function () {
  return gulp
    .src(["src/assets/*.svg"])
    .pipe(gulp.dest("docs/assets"))
    .pipe(browserSync.stream());
});

//Setup transpile of ES6 --> ES5
gulp.task('js', function () {
    return gulp.src(['src/js/index.js'])
        .pipe(babel({
			presets: ['env']
        }))
        .pipe(uglify())
            .pipe(header(banner, { pkg: pkg }))
        .pipe(concat('app.min.js'))
        .pipe(gulp.dest("./docs/js"))
//        .pipe(gulp.dest("src/js"))
        .pipe(browserSync.stream());
});

gulp.task("clean", function () {
  return del([
    "./docs/assets",
    "./docs/css",
    "./docs/js",
    "./docs/index.html",
    "./docs/favicon.ico",
  ]);
});

gulp.task("build", gulp.series("clean", "html", "favicon", "sass", "js", "svg", "collateral"));

//Static Server + watching scss/html files
gulp.task("serve", gulp.series(("html", "collateral", "svg", "favicon", "sass", "js"), function () {
  browserSync.init({
    //		Will not attempt to determine your network status, assumes you're OFFLINE
    online: false,
    server: "./docs",
  });

  gulp.watch(["src/scss/*.scss"], gulp.parallel("sass"));
  gulp.watch(["src/js/*.js"], gulp.parallel("js"));
  gulp.watch(["src/assets/*.png"], gulp.parallel("collateral"));
  gulp.watch(["src/assets/*.svg"], gulp.parallel("svg"));
  gulp.watch(["src/*.html"], gulp.parallel("html"));
  gulp.watch(["src/favicon.ico"], gulp.parallel("favicon"));
}));

gulp.task("default", gulp.parallel("serve"));