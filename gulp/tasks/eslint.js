module.exports = function () {
    $.gulp.task('eslint', function () {
        return $.gulp.src('src/static/js/main.js')
            .pipe($.gp.eslint())
            .pipe($.gp.eslint.format())
            .pipe($.gp.eslint.failAfterError())
    })
}
