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
        assert.equal(fixture.morning, 'Buenos Dias');
    });

    it('should load multiple fixtures', function () {
        var fixtures = load(['greeting', 'profile']);
        assert.equal(2, fixtures.length);
        assert.equal(fixtures[0].morning, 'Buenos Dias');
        assert.equal(fixtures[1].name, 'Walter Mitty');
    });

    it('should load a different fixture instance for each call',
        function (done) {
            var newFixture = load('greeting');
            assert.isDefined(newFixture);
            assert.equal(newFixture.morning, 'Buenos Dias');
            assert.equal(newFixture.morning, fixture.morning);
            assert.notStrictEqual(newFixture, fixture);
            done();
        }
    );

    it('should load fixture from another profile',
        function (done) {
            var newFixture = load('greeting', 'DE');
            assert.isDefined(newFixture);
            assert.equal(newFixture.morning, 'Guten Morgen');
            done();
        }
    );

    it('should load fixture matching the spec name', function () {
        var fixture = load(__filename);
        assert.isDefined(fixture);
        assert.isDefined(fixture.name, 'fixture_from_load_json');
    });

    after(function (done) {
        if (nemo.driver) {
            nemo.driver.quit().then(done);
        }
    });
});
