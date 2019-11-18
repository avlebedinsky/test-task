const imgPATH = {
    input: ['./src/static/img/**/*.{png,jpg,gif,svg}', '!./src/static/img/svg/*'],
    output: './build/static/img/'
}

module.exports = function () {
    $.gulp.task('img', () => {
        return $.gulp.src(imgPATH.input)
            .pipe($.gulp.dest(imgPATH.output))
    })
}
