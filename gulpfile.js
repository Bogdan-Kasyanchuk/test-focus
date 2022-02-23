import gulp from 'gulp';
import { path } from './gulp/config/path';
import { plugins } from './gulp/config/plugins';
import { copy } from './gulp/tasks/copy';
import { html } from './gulp/tasks/html';
import { scss } from './gulp/tasks/scss';
import { js } from './gulp/tasks/js';
import { images } from './gulp/tasks/images';
import { reset } from './gulp/tasks/reset';
import { server } from './gulp/tasks/server';
import { sprite } from './gulp/tasks/sprite';

export { sprite };

global.app = {
  isBuild: process.argv.includes('--build'),
  isDev: !process.argv.includes('--build'),
  path,
  gulp,
  plugins,
};

function watcher() {
  gulp.watch(path.watch.files, copy);
  gulp.watch(path.watch.html, html);
  gulp.watch(path.watch.scss, scss);
  gulp.watch(path.watch.js, js);
  gulp.watch(path.watch.images, images);
}

const mainTasks = gulp.parallel(copy, html, scss, js, images);

const dev = gulp.series(reset, mainTasks, gulp.parallel(watcher, server));
const build = gulp.series(reset, mainTasks);

export { dev, build };

gulp.task('default', dev);
