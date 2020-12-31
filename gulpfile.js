"use strict";

const gulp = require("gulp");
const sass = require("gulp-sass");
const plumber = require("gulp-plumber");
const notify = require("gulp-notify");
const sourcemaps = require("gulp-sourcemaps");
const autoprefixer = require("gulp-autoprefixer");
const postcss = require("gulp-postcss");
const mqpacker = require("css-mqpacker");
const pug = require("gulp-pug");
const rename = require("gulp-rename");
const pugPHPFilter = require("pug-php-filter");
const babel = require("gulp-babel");

//====================
//  タスクの追加
//====================

gulp.task("sass", function () {
  // style.scssファイルを取得
  return (
    gulp
      // Sassのコンパイルを実行
      .src("./src/scss/*.scss")
      //sourcemap 読み込み srcの直後
      .pipe(sourcemaps.init())
      //エラーが出ても落ちないようにして、ターミナルにエラーメッセージを出す
      .pipe(
        plumber({
          errorHandler: notify.onError("Error: <%= error.message %>"),
        })
      )
      //outputStyleでインデントや改行の設定
      .pipe(sass({ outputStyle: "compressed" }))
      //メディアクエリの整理
      .pipe(postcss([mqpacker()]))
      //ベンダープレフレックスをつける
      .pipe(autoprefixer())
      //sourcemap 実行 distの直前
      .pipe(sourcemaps.write("./"))
      // 保存先 直下に保存
      .pipe(gulp.dest("./dist/css"))
  );
});
gulp.task("pug", function () {
  let option = {
    pretty: true,
    filters: {
      php: pugPHPFilter,
    },
  };
  return gulp
    .src("./src/*.pug")
    .pipe(pug(option))
    .pipe(
      rename({
        extname: ".php",
      })
    )
    .pipe(gulp.dest("./dist"));
});
gulp.task("babel", function () {
  return gulp
    .src("./src/js/*.js")
    .pipe(
      babel({
        presets: ["@babel/env"],
      })
    )
    .pipe(gulp.dest("./dist/js"));
});

//====================
//  すべての監視
//====================
gulp.task("watch", () => {
  gulp.watch("./src/scss/*.scss", gulp.series("sass"));
  gulp.watch("./src/*.pug", gulp.series("pug"));
  gulp.watch("./src/js/*.js", gulp.series("babel"));
});

//====================
//  デフォルトとして登録。 コマンド gulpでスタート
//====================
gulp.task("default", gulp.series("watch"));
