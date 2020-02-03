const { src, dest, watch, series, parallel, lastRun } = require("gulp");

const sourcemaps = require("gulp-sourcemaps");
const sass = require("gulp-sass");
const postcss = require("gulp-postcss");
const autoprefixer = require("autoprefixer");
const cssnano = require("cssnano");
const browserSync = require("browser-sync").create();
const uglify = require("gulp-uglify");

//Compile, prefix and minifify scss
function scssTask() {
  return src("src/scss/app/*.scss", { since: lastRun(scssTask) }, { sourcemaps: true })
    .pipe(sourcemaps.init())
    .pipe(sass())
    .pipe(postcss([autoprefixer(), cssnano]))
    .pipe(sourcemaps.write("."))
    .pipe(dest("dist/css/"))
    .pipe(browserSync.stream());
}

function scssBsTask() {
  return src("src/vendor/bootstrap/*.scss", { since: lastRun(scssBsTask) }, { sourcemaps: true })
    .pipe(sourcemaps.init())
    .pipe(sass())
    .pipe(postcss([autoprefixer(), cssnano]))
    .pipe(sourcemaps.write("."))
    .pipe(dest("dist/bootstrap/"))
    .pipe(browserSync.stream());
}

// compile uglify and replace js
function jsTask() {
  return src("src/js/app/*.js", { since: lastRun(jsTask) })
    .pipe(uglify())
    .pipe(dest("dist/js/"))
    .pipe(browserSync.stream());
}

function jsBsTask() {
  return src("src/vendor/bootstrap/*.js", { since: lastRun(jsBsTask) })
    .pipe(uglify())
    .pipe(dest("dist/bootstrap/js/"))
    .pipe(browserSync.stream());
}

// replace html
function htmlTask() {
  return src("*.html").pipe(dest("dist/"));
}

function watchTask() {
  browserSync.init({
    server: {
      baseDir: "dist/"
    }
  });
  watch(
    ["src/scss/app/*.scss", "*.html", "src/js/app/*.js"],
    series(parallel(scssTask, jsTask), htmlTask)
  ).on("change", browserSync.reload);
}

function watchTaskFull() {
  browserSync.init({
    server: {
      baseDir: "dist/"
    }
  });
  watch(
    ["*.scss", "*.html", "*.js"],
    series(parallel(scssTask,scssBsTask, jsTask), htmlTask)
  ).on("change", browserSync.reload);
}

exports.default = watchTask;
exports.boostrap = watchTaskFull;
