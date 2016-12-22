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

    it('should load object with a callback', function (done) {
        nemo.fixo.load('profile', function (err, profile) {
            if (err) {
                return done(err);
            }
            assert.equal(profile.name, 'Walter Mitty');
            done();
        });
    });

    it('should load object with a promise', function (done) {
        nemo.fixo.load('profile').then(function (profile) {
            assert.equal(profile.name, 'Walter Mitty');
        }).then(done, done);
    });

    after(function (done) {
        if (nemo.driver) {
            nemo.driver.quit().then(done);
        }
    });
});

