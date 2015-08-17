import gulp from 'gulp';
import webpack from 'webpack';
import WebpackDevServer from 'webpack-dev-server';
import nodemon from 'nodemon';
import path from 'path';
import { Schema } from './src/server/data/schema';
import { introspectionQuery } from 'graphql/utilities';
import { graphql } from 'graphql';
import fs from 'fs';

import configs from './webpack.config';
const [ frontendConfig, backendConfig ] = configs;

let compiler;

// trigger a manual recompilation of webpack(frontendConfig);
function recompile() {
  if (!compiler)
    return null;
  return new Promise((resolve, reject) => {
    compiler.run((err, stats) => {
      if (err)
        reject(err);
      console.log('[webpackDevServer]: recompiled');
      resolve();
    });
  });
}

// run the webpack dev server
//  must generate the schema.json first as compiler relies on it for babel-relay-plugin
gulp.task('webpack', ['generate-schema'], () => {
  compiler = webpack(frontendConfig);
  let server = new WebpackDevServer(compiler, {
    contentBase: path.join(__dirname, 'build', 'public'),
    hot: true,
    noInfo: true,
    stats: { colors: true },
    historyApiFallback: true,
    proxy: {
      '/graphql': 'http://localhost:8080'
    }
  });
  server.listen(3000, 'localhost', (err, result) => {
    if (err)
      return console.error(err);
    console.log('[webpackDevServer]: listening on localhost:3000');
  });
});

// restart the backend server whenever a required file from backend is updated
gulp.task('backend-watch', () => {
  return new Promise((resolve, reject) => {
    let compiled = false;
    webpack(backendConfig).watch(100, (err, stats) => {
      if (err)
        return reject(err);
      // trigger task completion after first compile
      if (!compiled) {
        compiled = true;
        resolve();
      } else {
        nodemon.restart();
      }
    });
  });
});

// Regenerate the graphql schema and recompile the frontend code that relies on schema.json
gulp.task('generate-schema', () => {
  return graphql(Schema, introspectionQuery)
    .then(result => {
      if (result.errors)
        return console.error('[schema]: ERROR --', JSON.stringify(result.errors, null, 2));
      fs.writeFileSync(
        path.join(__dirname, './src/server/data/schema.json'),
        JSON.stringify(result, null, 2)
      );
      return compiler ? recompile() : null;
    });
});

// recompile the schema whenever .js files in data are updated
gulp.task('watch-schema', () => {
  gulp.watch(path.join(__dirname, './src/server/data', '**/*.js'), ['generate-schema']);
});

gulp.task('server', ['backend-watch', 'watch-schema'], () => {
  nodemon({
    execMap: {
      js: 'node'
    },
    script: path.join(__dirname, 'build', 'server.js'),
    // do not watch any directory/files to refresh
    // all refreshes should be manual
    watch: ['foo/'],
    ext: 'noop',
    ignore: ['*']
  }).on('restart', () => {
    console.log('[nodemon]: restart');
  });
});

gulp.task('default', ['webpack', 'server']);