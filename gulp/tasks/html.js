const imgPATH = {
    input: './src/static/*.html',
    output: './build/'
}

module.exports = function () {
    $.gulp.task('html', () => {
        return $.gulp.src(imgPATH.input)
            .pipe($.gulp.dest(imgPATH.output))
            .pipe($.bs.reload({
                stream: true
            }))
    })
}
