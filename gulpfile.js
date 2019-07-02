const http = require('http');
const gulp = require('gulp');
const st = require('st');

/*
  gulp.task('server', function () {
  console.log();
  console.log('### Starting local server');

  var WebServer = require('./test/webserver.js').WebServer;
  var server = new WebServer();
  server.port = 8888;
  server.start();
  });
*/

gulp.task('server', done => {
  const port = '8088';
  const statics =     st({path: './', cache:false});
  const server = http.createServer(
    statics
  );
  server.on('listening', () => console.log('server: listening:', server.address()));
  server.listen(port, done);
});
