'use strict'

global.$ = {
    gulp: require('gulp'),
    gp: require('gulp-load-plugins')(),
    bs: require('browser-sync').create(),

    path: {
        tasks: require('./gulp/config/tasks.js')
    }
}

$.path.tasks.forEach(function (tasksPath) {
    require(tasksPath)()
})

$.gulp.task('default', $.gulp.series(
    $.gulp.parallel('html', 'stylelint', 'sass', 'eslint', 'scripts', 'img'),
    $.gulp.parallel('watch', 'serve')
))
