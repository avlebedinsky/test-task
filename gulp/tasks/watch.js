module.exports = function () {
    $.gulp.task('watch', function () {
        $.gulp.watch('src/static/*.html', $.gulp.series('html'))
        $.gulp.watch('src/static/sass/**/*.scss', $.gulp.series('stylelint', 'sass'))
        $.gulp.watch('src/static/js/**/*.js', $.gulp.series('eslint', 'scripts'))
        $.gulp.watch('src/static/img/**/*.*', $.gulp.series('img'))
    })
}
