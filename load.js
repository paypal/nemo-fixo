'use strict';

var Fixo = require('fixo');
var debug = require('debug')('nemo-fixo:load');
var util = require('./lib/util');

module.exports = function (fixtureName, profile) {
    debug('fixtureName:', fixtureName, ', profile:', profile);

    if (!fixtureName) {
        throw new TypeError('Fixture name is required');
    }

    // Load nemo config and fixo options
    var nemoConfig = util.loadNemoConfigSync();
    var fixoOptions = util.getFixoOptions(nemoConfig);
    var fixo = new Fixo(fixoOptions);
    fixoOptions = fixo.getOptions();

    // Parse matching fixture name
    fixtureName = util.parseMatchingFixtureName(fixtureName, fixoOptions.specDir);

    return fixo.loadSync(fixtureName, profile);
};
