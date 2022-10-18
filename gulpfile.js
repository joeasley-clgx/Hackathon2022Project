const gulp = require('gulp');

function cssTask(cb) {
    // place code for your default task here
    gulp.src('node_modules/bootstrap/dist/css/bootstrap.css')
    .pipe(gulp.dest('public/css'));

    gulp.src('node_modules/@corelogic/clui/dist/css/corelogic-ui.css')
    .pipe(gulp.dest('public/css'));

    cb();
}

function jsTask(cb) {
    // place code for your default task here
    gulp.src('node_modules/jquery/dist/jquery.js')
    .pipe(gulp.dest('public/scripts'));

    gulp.src('node_modules/bootstrap/dist/js/bootstrap.bundle.js')
    .pipe(gulp.dest('public/scripts'));

    gulp.src('node_modules/bootstrap-daterangepicker/daterangepicker.js')
    .pipe(gulp.dest('public/scripts'));

    gulp.src('node_modules/bootstrap-daterangepicker/moment.min.js')
    .pipe(gulp.dest('public/scripts'));

    gulp.src('node_modules/@corelogic/clui/dist/js/corelogic-ui.js')
    .pipe(gulp.dest('public/scripts'));

    cb();
}

exports.default = gulp.series(cssTask, jsTask)