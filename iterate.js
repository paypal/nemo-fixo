/* eslint no-native-reassign: "off" */

'use strict';

var path = require('path');
var Fixo = require('fixo');
var debug = require('debug')('nemo-fixo:iterate');
var util = require('./lib/util');

var FIXTURE_ITERATE_KEY = 'iterate';
var DEFAULT_ITERATE_LIST = 'all';

/**
 * Iterate and load fixtures for different profiles. Example:
 *   iterate('fixture-name', ['US', 'GB', 'CA'], function (profile, index, profiles) {
 *      it('should ... for profile - ' + profile, function (fixture) {
 *          ...
 *      });
 *   });
 *
 * Profile list to iterate are determined by the library based on the following precedence:
 * 1) FIXO_ITERATE_PROFILES environment variable value
 * 2) Profile list passed when calling the iterate method
 * 3) Profile list specified in the test fixure object, under `iterate` profile with
 *    `profiles` key. The key name could be overridden by:
 *     - passing `list` option when calling `iterate` method
 *     - setting the environment variable FIXO_ITERATE_LIST
 *
 * @param fixtureName {string} Fixture name.
 * @param profiles {array} List of profiles.
 * @param options {(object)} Available options:
 *                         - list:  Profiles key to override
 * @param callback {function} Callback function with arguments, i.e profile,
 *                     index and profiles.
 */
function iterate() {
    var callback = Array.prototype.slice.call(arguments, -1)[0];
    if (typeof callback !== 'function') {
        throw new TypeError('Callback function is missing');
    }

    var args = Array.prototype.slice.call(arguments, 0, arguments.length - 1);
    var fixtureName = args[0];
    var profiles = args[1];
    var options = args[2];

    debug('fixtureName:', fixtureName, ', profiles:', profiles);

    if (profiles && !Array.isArray(profiles)) {
        throw new TypeError('Profile list must be an array');
    }

    if (options && typeof options !== 'object') {
        throw new TypeError('Options must be an object');
    }

    // Load nemo config and fixo options
    var nemoConfig = util.loadNemoConfigSync();
    var fixoOptions = util.getFixoOptions(nemoConfig);
    var fixo = new Fixo(fixoOptions);

    fixoOptions = fixo.getOptions();

    // Load iterate config
    fixtureName = util.parseMatchingFixtureName(fixtureName, fixoOptions.specDir);
    var iterateConfig = loadIterateConfigSync(fixo, fixtureName);
    var iterateProfiles = getProfiles(profiles, options, iterateConfig, fixoOptions);
    var mochaIt = it;

    iterateProfiles.forEach(function (profile, index) {
        try {
            it = overrideMochaIt(mochaIt, fixtureName, profile, fixo);
            it.only = overrideMochaIt(mochaIt, fixtureName, profile, fixo, true);
            var fixture;
            if (callback.length > 1) {
                fixture = fixo.loadSync(fixtureName, profile);
            }
            callback(profile, fixture, index, iterateProfiles);
        } finally {
            it = mochaIt;
        }
    });
}

function getProfiles(argProfiles, options, iterateConfig, fixoOptions) {
    var profiles = argProfiles;
    debug('getProfiles() - iterate profiles:', argProfiles);

    // Get profiles from environment variables
    if (process.env.FIXO_ITERATE_PROFILES) {
        profiles = process.env.FIXO_ITERATE_PROFILES.split(',').map(function (profile) {
            return profile.trim();
        });
    }

    // Get profiles from iterate config
    if (!profiles) {
        options = options || {};

        var defaultProfiles = iterateConfig[fixoOptions.defaultIterateList ||
            DEFAULT_ITERATE_LIST];
        debug('getProfiles() - defaultProfiles:', defaultProfiles,
            ', defaultIterateList:', fixoOptions.defaultIterateList);

        if (defaultProfiles) {
            profiles = defaultProfiles;
        }

        var requestedProfilesKey = process.env.FIXO_ITERATE_LIST || options.list;
        if (requestedProfilesKey) {
            var requestedProfiles = iterateConfig[requestedProfilesKey];
            debug('getProfiles() - requestedProfiles:', requestedProfiles);

            if (requestedProfiles) {
                profiles = requestedProfiles;
            }
        }
    }

    profiles = profiles || [];
    debug('getProfiles() - profiles:', profiles);

    return profiles;
}


function overrideMochaIt(mochaIt, fixtureName, profile, fixo, isOnly) {
    return function (title, itCallback) {
        var itOverride = itCallback;

        if (itCallback && itCallback.length > 1) {
            itOverride = function (done) {
                fixo.load(fixtureName, profile).then(function (fixture) {
                    return itCallback.call(this, done, fixture);
                }.bind(this));
            };
        }

        if (isOnly) {
            mochaIt = mochaIt.only;
        }

        mochaIt(title, itOverride);
    };
}

function loadIterateConfigSync(fixo, fixtureName) {
    debug('loadIterateConfigSync() - fixtureName:', fixtureName);

    try {
        var iterateConfig = fixo.loadSync(fixtureName, FIXTURE_ITERATE_KEY);
        debug('loadIterateConfigSync() - iterate config', iterateConfig);

        return iterateConfig || {};
    } catch (e) {
        throw new Error('Failed to load iterate config for fixture: ' + path.basename(fixtureName) +
            ', error: ' + e.message);
    }
}

module.exports = iterate;

