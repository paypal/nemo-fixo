'use strict';

var assert = require('chai').assert;
var Nemo = require('nemo');

describe('@basic: Init and set options', function () {
    var nemo;

    before(function (done) {
        nemo = Nemo(done);
    });

    it('should instantiate and configure fixo instance', function (done) {
        var options = nemo.fixo.getOptions();
        assert.isDefined(nemo.fixo);
        assert.equal(options.defaultProfile, 'ES');
        done();
    });

    it('should load fixture with a callback', function (done) {
        nemo.fixo.load('greeting', function (err, greeting) {
            if (err) {
                return done(err);
            }
            assert.isDefined(greeting);
            assert.equal(greeting.morning, 'Buenos Dias');
            done();
        });
    });

    it('should load fixture with a promise', function () {
        return nemo.fixo.load('greeting').then(function (greeting) {
            assert.isDefined(greeting);
            assert.equal(greeting.morning, 'Buenos Dias');
        });
    });

    it('should load multiple fixtures', function () {
        return nemo.fixo.load(['greeting', 'profile']).then(function (fixtures) {
            assert.equal(2, fixtures.length);
            assert.equal(fixtures[0].morning, 'Buenos Dias');
            assert.equal(fixtures[1].name, 'Walter Mitty');
        });
    });

    it('should load fixture for another country', function () {
        return nemo.fixo.load('greeting', 'DE').then(function (greeting) {
            assert.equal(greeting.morning, 'Guten Morgen');
        });
    });

    after(function (done) {
        if (nemo.driver) {
            nemo.driver.quit().then(done);
        }
    });
});

