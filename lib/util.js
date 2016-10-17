'use strict';

var path = require('path');
var debug = require('debug')('nemo-fixo:util');
var shush = require('shush');
var Util = {};

var DEFAULT_NEMO_BASE_DIR = 'test';
var DEFAULT_NEMO_CONFIG_DIR = 'config';
var DEFAULT_NEMO_CONFIG_FILE = 'config.json';

/**
 * Parse fixture name from a fully resolved file path, returning relative path from
 * the base directory onwards, or just the base filename if the base directory is
 * not passed.
 *
 * @param {string} fileName Fully resolved file path.
 * @param {string} specDir Relative directory from project root where the file is located.
 * @return {string} Fixture name matching the test file name and the
 *                  directory structure after the base directory.
 */
Util.parseMatchingFixtureName = function (fileName, specDir) {
    debug('parseMatchingFixtureName() - fileName:', fileName, ', specDir:', specDir);

    if (!fileName || typeof fileName !== 'string') {
        return fileName;
    }

    if (fileName !== path.resolve(fileName)) {
        return fileName;
    }

    var fixtureName;
    var fixtureDir;

    if (specDir) {
        // Placing windows separator at the end of regex causing regex error
        var endSeparator = path.sep.replace('\\', '\\\\');
        var specDirRegex = new RegExp('^' + path.resolve(specDir) + endSeparator);

        debug('parseMatchingFixtureName() - specDirRegex:', specDirRegex);

        if (fileName.match(specDirRegex)) {
            fixtureName = fileName.replace(specDirRegex, '');
            fixtureDir = path.dirname(fixtureName);
            fixtureName = path.join(fixtureDir,
                path.basename(fixtureName, path.extname(fixtureName)));

            debug('parseMatchingFixtureName() - fileName matched regex, ' +
                'updated fixtureName:', fixtureName);

            return fixtureName;
        }
    }

    fixtureName = path.basename(fileName, path.extname(fileName));
    debug('parseMatchingFixtureName() - fixtureName:', fixtureName);

    return fixtureName;
};

Util.loadNemoConfigSync = function () {
    var baseDir = process.env.nemoBaseDir || DEFAULT_NEMO_BASE_DIR;
    var configFile = path.resolve(baseDir, DEFAULT_NEMO_CONFIG_DIR, DEFAULT_NEMO_CONFIG_FILE);
    debug('loadNemoConfigSync() - baseDir:', baseDir, 'configFile:', configFile);

    var nemoConfig = shush(configFile);
    debug('loadNemoConfigSync() - nemoConfig:', nemoConfig);

    return nemoConfig;
};

Util.getFixoOptions = function (config) {
    var fixoPlugin = config && config.plugins && config.plugins.fixo;
    var options = fixoPlugin && fixoPlugin.arguments[0];

    debug('getFixoOptions() - ', options);
    return options || {};
};

module.exports = Util;
