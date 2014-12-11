module.exports = function (grunt) {

    'use strict';

    var http = require('http');
    var Q = require('q');

    function sendRequest(host, port, path, jsonBody) {
        var deferred = Q.defer();

        var body = (typeof jsonBody === "string" ? jsonBody : JSON.stringify(jsonBody || ""));
        var options = {
            method: 'PUT',
            host: host,
            path: path,
            port: port
        };

        var callback = function (response) {
            var body = '';

            if (response.statusCode === 400 || response.statusCode === 404) {
                deferred.reject(response.statusCode);
            }

            response.on('data', function (chunk) {
                body += chunk;
            });

            response.on('end', function () {
                deferred.resolve({
                    statusCode: response.statusCode,
                    body: body
                });
            });
        };

        try {
            var req = http.request(options, callback);
            req.write(body);
            req.end();
        } catch (e) {
            grunt.verbose.writeln("Failed to connect to endpoint at " + host + ":" + port + path);
        }

        req.on('error', function(){
            deferred.resolve({
                statusCode: 404
            });
        });

        return deferred.promise;
    }

    grunt.registerMultiTask('start_node_and_run_tasks', 'Start Node & Run Tasks', function () {

        grunt.verbose.writeln('Running: start_node_and_run_tasks');

        var done = this.async();
        var options = this.options();

        function doWork() {
            var spawn = require('child_process').spawn;
            var nodeProcess = spawn('node', ['server.js']);
            var MAX_ERROR_MESSAGE_LENGTH = 1024;
            var stderrBuf = '';

            grunt.verbose.writeln('Node server running on pid:' + nodeProcess.pid);

            nodeProcess.stdout.on('data', function (data) {
                grunt.verbose.writeln('server.js: ' + data);
            });
            nodeProcess.stderr.on('data', function (data) {
                console.error(data);
                if (data.length === undefined) {
                    data = '' + data;
                }
                if (stderrBuf.length + data.length < MAX_ERROR_MESSAGE_LENGTH) {
                    stderrBuf += data;
                }
            });

            grunt.registerTask('stopNode', 'Stop Node server', function () {
                var done = this.async();
                sendRequest("localhost", 1234, "/stop").then(function () {
                    done(true);
                }, function () {
                    grunt.log.warn('failed to stop node server.js');
                    done(false);
                });
            });

            options.tasks.push('stopNode');
            grunt.verbose.writeln("running: " + options.tasks);
            grunt.task.run(options.tasks);
            grunt.verbose.writeln("finished: " + options.tasks);

            done(true);
        }

        try {
            sendRequest("localhost", 1234, "/stop")
                .then(function () {
                    grunt.verbose.writeln('stoppped node server.js');
                }, function () {
                    grunt.verbose.writeln('failed to stop node server.js probably because its not running');
                })
                .then(function () {
                    doWork();
                });
        } catch (e) {
            doWork();
        }
    });
};