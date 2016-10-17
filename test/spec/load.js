'use strict';

var assert = require('chai').assert;
var Nemo = require('nemo');
var load = require('../../load');

describe('@load', function () {
    var nemo;

    before(function (done) {
        nemo = Nemo(done);
    });

    var fixture = load('greeting');

    it('should load fixture from default profile', function () {
        assert.isDefined(fixture);
        assert.equal(fixture.greeting, 'Buenos Dias');
    });

    it('should load multiple fixtures', function () {
        var fixtures = load(['greeting', 'profile']);
        assert.equal(2, fixtures.length);
        assert.equal(fixtures[0].greeting, 'Buenos Dias');
        assert.equal(fixtures[1].name, 'Walter Mitty');
    });

    it('should load a different fixture instance for each call',
        function (done) {
            var newFixture = load('greeting');
            assert.isDefined(newFixture);
            assert.equal(newFixture.greeting, 'Buenos Dias');
            assert.equal(newFixture.greeting, fixture.greeting);
            assert.notStrictEqual(newFixture, fixture);
            done();
        }
    );

    it('should load fixture from another profile',
        function (done) {
            var newFixture = load('greeting', 'DE');
            assert.isDefined(newFixture);
            assert.equal(newFixture.greeting, 'Guten Morgen');
            done();
        }
    );

    it('should load fixture matching the spec name', function () {
        var fixture = load(__filename);
        assert.isDefined(fixture);
        assert.isDefined(fixture.name, 'load fixture');
    });

    after(function (done) {
        if (nemo.driver) {
            nemo.driver.quit().then(done);
        }
    });
});
