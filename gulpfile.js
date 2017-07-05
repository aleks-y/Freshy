"use strict";

const gulp = require("gulp");
const plumber = require("gulp-plumber");
const postcss = require("gulp-postcss");
const precss = require("precss");
const autoprefixer = require("autoprefixer");
const server = require("browser-sync").create();
const del = require("del");
const sourcemaps = require("gulp-sourcemaps");
const gulpIf = require("gulp-if");
const normalize = require("postcss-normalize");
const csso = require("gulp-csso");

const isDevelopment = !process.env.NODE_ENV || process.env.NODE_ENV == "development";

gulp.task("style", function() {
  gulp.src("postcss/style.css")
    .pipe(plumber())
    .pipe(gulpIf(isDevelopment, sourcemaps.init()))
    .pipe(postcss([
      normalize({
        forceImport: true
      }),
      precss(),
      autoprefixer({browsers: [
        "last 2 versions"
      ]})
    ]))
    .pipe(gulpIf(!isDevelopment, csso()))
    .pipe(gulpIf(isDevelopment, sourcemaps.write()))
    .pipe(gulp.dest("css"))
    .pipe(server.stream());
});

gulp.task("serve", function() {
  server.init({
    server: ".",
    notify: false,
    open: true,
    cors: true,
    ui: false
  });
});

gulp.task("watch", function() {
  gulp.watch("postcss/**/*.css", ["style"]);
  gulp.watch("*.html").on("change", server.reload);
});

gulp.task("default", ["style", "serve", "watch"]);
