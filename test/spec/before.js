'use strict';

var path = require('path');

before(function () {
    process.env.nemoBaseDir = path.resolve(__dirname, '..');
});
