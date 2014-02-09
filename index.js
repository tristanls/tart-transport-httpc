/*

index.js - "tart-transport-httpc": Tart HTTPC transport

The MIT License (MIT)

Copyright (c) 2014 Tristan Slominski

Permission is hereby granted, free of charge, to any person
obtaining a copy of this software and associated documentation
files (the "Software"), to deal in the Software without
restriction, including without limitation the rights to use,
copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the
Software is furnished to do so, subject to the following
conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
OTHER DEALINGS IN THE SOFTWARE.

*/
"use strict";

var https = require('https');
var url = require('url');

module.exports = function transport(options) {
    return function sendBeh(message) {
        if (!message.address) {
            if (message.fail) {
                message.fail(new Error("Missing address"));
            }
            return;
        }

        var reqOptions = {
            headers: {
                'x-ansible': message.address
            },
            hostname: options.hostname,
            port: options.port,
            path: '/',
            method: 'POST'
        };

        var req = https.request(reqOptions);
        req.on('response', function (res) {
            // drain all data
            res.on('data', function () {});

            if (res.statusCode == 201) {
                message.ok && message.ok();
                return;
            }

            message.fail && message.fail(new Error(res.statusCode));
        });

        req.on('error', function (error) {
            message.fail && message.fail(error);
        });

        req.end(message.content);
    };
};