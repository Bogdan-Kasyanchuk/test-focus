import svgmin from 'gulp-svgmin'
import svgSprite from 'gulp-svg-sprite'

export const sprite = () => {
  return app.gulp
    .src(`${app.path.src.svgicons}`)
    .pipe(
      svgmin({
        js2svg: {
          pretty: true,
        },
      }),
    )
    .pipe(
      svgSprite({
        mode: {
          stack: {
            sprite: '../icons/icons.svg',
            example: false,
          },
        },
      }),
    )
    .pipe(app.gulp.dest(`${app.path.build.images}`))
}
