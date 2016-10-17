'use strict';

var assert = require('chai').assert;
var path = require('path');

describe('@util', function () {
    describe('parseMatchingFixtureName', function () {
        var util;
        var fileName;
        var fixtureName;

        before(function () {
            util = require('../../../lib/util');
        });

        it('should return just the basename',
            function () {
                fileName = path.resolve('test/test-spec.js');
                fixtureName = util.parseMatchingFixtureName(fileName);
                assert.equal('test-spec', fixtureName);
            }
        );

        it('should not parse relative path and array', function () {
            fileName = 'test/test-spec.js';
            fixtureName = util.parseMatchingFixtureName(fileName);
            assert.equal(fixtureName, 'test/test-spec.js');

            fileName = ['test/test-spec.js'];
            fixtureName = util.parseMatchingFixtureName(fileName);
            assert.deepEqual(fixtureName, ['test/test-spec.js']);
        });

        it('should return fixture name matching the filename and the directory structure',
            function () {
                // Resolved filename - nested
                fileName = path.resolve('test/nested/test-spec.js');
                fixtureName = util.parseMatchingFixtureName(fileName, 'test');
                assert.equal(fixtureName, 'nested/test-spec');

                // Resolved filename - not nested
                fileName = path.resolve('test/test-spec.js');
                fixtureName = util.parseMatchingFixtureName(fileName, 'test');
                assert.equal(fixtureName, 'test-spec');
            }
        );

        it('should return basename if the test directory does not match ' +
            'the base directory of the file path',
            function () {
                fileName = path.resolve('test/test-spec.js');
                fixtureName = util.parseMatchingFixtureName(fileName, 'xyz');
                assert.equal('test-spec', fixtureName);
            }
        );
    });
});
