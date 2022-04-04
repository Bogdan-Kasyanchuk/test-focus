import dartSass from 'sass';
import gulpSass from 'gulp-sass';
import autoprefixer from 'gulp-autoprefixer';
import cleanCss from 'gulp-clean-css';
import rename from 'gulp-rename';

const sass = gulpSass(dartSass);

export const scss = () => {
  return app.gulp
    .src(app.path.src.scss, { sourcemaps: app.isDev })
    .pipe(app.plugins.replace(/@img\//g, '../img/'))
    .pipe(sass({ outputStyle: 'expanded' }))
    .pipe(
      app.plugins.if(
        app.isBuild,
        autoprefixer({
          grid: true,
        }),
      ),
    )
    .pipe(app.plugins.if(app.isBuild, cleanCss()))
    .pipe(rename({ extname: '.min.css' }))
    .pipe(app.gulp.dest(app.path.build.css, { sourcemaps: app.isDev }))
    .pipe(app.plugins.browsersync.stream());
};
