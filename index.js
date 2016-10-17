'use strict';

var Fixo = require('fixo');

/**
 * Setup nemo-fixo plugin.
 *
 * @param {object} options Fixo options passed through nemo config.json
 * @param {object} nemo Nemo instance
 * @param {function} callback
 */
function setupPlugin(options, nemo, callback) {
    options = options || {};
    nemo.fixo = Fixo(options);
    callback();
}

module.exports = {
    setup: setupPlugin
};
