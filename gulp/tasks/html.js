import fileInclude from 'gulp-file-include'
import typograf from 'gulp-typograf'
import webpHtmlNosvg from 'gulp-webp-html-nosvg'
import versionNumber from 'gulp-version-number'
import htmlMin from 'gulp-htmlmin'

export const html = () => {
  return app.gulp
    .src(app.path.src.html)
    .pipe(fileInclude())
    .pipe(
      typograf({
        locale: ['ru', 'en-US'],
      }),
    )
    .pipe(app.plugins.replace(/@img\//g, 'img/'))
    .pipe(app.plugins.if(app.isBuild, webpHtmlNosvg()))
    .pipe(
      app.plugins.if(
        app.isBuild,
        versionNumber({
          value: '%DT%',
          append: {
            key: '_v',
            cover: 0,
            to: ['css', 'js'],
          },
          outpute: {
            file: 'gulp/version.json',
          },
        }),
      ),
    )
    .pipe(app.plugins.if(app.isBuild, htmlMin({ collapseWhitespace: true })))
    .pipe(app.gulp.dest(app.path.build.html))
    .pipe(app.plugins.browsersync.stream())
}
