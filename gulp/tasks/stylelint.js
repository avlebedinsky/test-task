module.exports = function () {
    $.gulp.task('stylelint', function () {
        return $.gulp.src('src/static/sass/main.scss')
            .pipe($.gp.stylelint({
                reporters: [
                    { formatter: 'string', console: true }
                ]
            }))
    })
}
