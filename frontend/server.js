(function () {

    "use strict";

    // start mock server
    var mockserver = require('mockserver-grunt');
    var MOCK_SERVER_PORT = require('./build/testConfig.js').MOCK_SERVER_PORT;
    mockserver.start_mockserver({
        serverPort: MOCK_SERVER_PORT,
        verbose: true
    });
    var proxy = require('http-proxy').createProxyServer();

    // start http server & proxy
    var https = require('https');
    var http = require('http');
    var url = require('url');
    var path = require('path');
    var fs = require('fs');
    var HTTP_PORT = 1234;
    var HTTP_CANNED_DATA_PORT = 8080;

    var mimeTypes = {
        "html": "text/html",
        "jpeg": "image/jpeg",
        "jpg": "image/jpeg",
        "png": "image/png",
        "js": "text/javascript",
        "json": "text/javascript",
        "pdf": "application/pdf",
        "css": "text/css",
        "woff": "application/font-woff"
    };
    var canned_data = require('./canned_data/canned_data');

    var sendJSONResponse = function (res, data, statusCode) {
        if (!statusCode) {
            statusCode = 200;
        }

        res.writeHead(statusCode, {'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-cache, no-store'});
        res.write(JSON.stringify(data));
        res.end();
    };

    function postRequest(request, response, callback) {
        var queryData = "";

        request.on('data', function (data) {
            queryData += data;
            if (queryData.length > 1e6) {
                queryData = "";
            }
        });

        request.on('end', function () {
            var parsedQueryData;

            //duck-typing
            try {
                parsedQueryData = JSON.parse(queryData);
            } catch (e) {
                parsedQueryData = queryData;
            }

            callback(parsedQueryData);
        });
    }

    var routing = function (isCannedData) {
        var directories = [
            process.cwd()
        ];

        return function (req, res) {
            var uri = url.parse(req.url).pathname,
                filename = "";

            if (uri === '/' && req.method == 'GET') {
                uri = "/index.html";
            } else if (uri === '/stop') {
                mockserver.stop_mockserver();
                res.statusCode = 202;
                res.end();
                process.exit(0);
            }

            for (var directoryIndex = 0; directoryIndex < directories.length; directoryIndex++) {
                filename = path.join(directories[directoryIndex], unescape(uri));
                if (fs.existsSync(filename) && fs.lstatSync(filename).isFile()) {
                    break;
                }
                else {
                    filename = "";
                }
            }

            if (filename) {
                var mimeType = mimeTypes[path.extname(filename).split(".")[1]];
                if (mimeType === 'application/pdf') {
                    res.writeHead(200, {'Content-Type': 'application/octet-stream'});
                }
                else {
                    res.writeHead(200, {'Content-Type': (mimeType || 'text/plain') + '; charset=utf-8'});
                }

                var fileStream = fs.createReadStream(filename);
                fileStream.pipe(res);
            } else if (isCannedData && uri === '/api/pipeline') {
                postRequest(req, res, function () {
                    sendJSONResponse(res, canned_data.pipeline.list);
                })
            } else if (isCannedData && uri.indexOf('/api/pipeline') == 0) {
                postRequest(req, res, function () {
                    sendJSONResponse(res, canned_data.pipeline.view);
                })
            } else if (isCannedData && uri === '/api/build') {
                postRequest(req, res, function () {
                    sendJSONResponse(res, canned_data.build.list);
                })
            } else if (isCannedData && uri.indexOf('/api/build') == 0) {
                postRequest(req, res, function () {
                    if (uri === '/api/build/8f0666b2-df97-42f5-a13e-9deac7dd590e') {
                        sendJSONResponse(res, canned_data.build.view);
                    } else if (uri === '/api/build/1e214c23-168a-4c87-b960-45eb9e93d526') {
                        sendJSONResponse(res, canned_data.build.edit);
                    } else {
                        res.writeHead(404, {'Content-Type': 'application/json'});
                    }
                })
            } else {
                console.log('node sending following request to MockServer: ' + JSON.stringify({
                    method: req.method,
                    url: req.url
                }));
                proxy.web(req, res, {
                    target: 'http://127.0.0.1:' + MOCK_SERVER_PORT
                });
            }
        }
    };

    http.createServer(routing(false)).listen(HTTP_PORT);
    console.log("build-manager with mocked responses started on HTTP_PORT: " + HTTP_PORT + " (and mockserver on: " + MOCK_SERVER_PORT + ")");

    http.createServer(routing(true)).listen(HTTP_CANNED_DATA_PORT);
    console.log("build-manager with canned responses listening on port: " + HTTP_CANNED_DATA_PORT);

    process.on('uncaughtException', function (err) {
        console.log('uncaught exception - stopping node server');
        mockserver.stop_mockserver();
        throw err;
    });

    process.on('exit', function () {
        console.log('exit - stopping node server');
        mockserver.stop_mockserver();
    });

    process.on('SIGINT', function () {
        console.log('SIGINT - stopping node server');
        mockserver.stop_mockserver();
        process.exit(0);
    });

    process.on('SIGTERM', function () {
        console.log('SIGTERM - stopping node server');
        mockserver.stop_mockserver();
        process.exit(0);
    });

})();