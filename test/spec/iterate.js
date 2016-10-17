'use strict';

var assert = require('chai').assert;
var Nemo = require('nemo');
var iterate = require('../../iterate');
var path = require('path');

function assertGreeting(profiles, greeting, profile, fixture, index) {
    assert.equal(profiles[index], profile);

    switch (profile) {
    case 'DE':
        assert.equal('Guten Morgen', greeting);
        break;

    case 'ES':
        assert.equal('Buenos Dias', greeting);
        break;

    case 'ID':
        assert.equal('Selamat Pagi', greeting);
        break;
    }
}

describe('@iterate', function () {
    var nemo;

    before(function (done) {
        nemo = Nemo(done);
    });

    describe('@iterate-fixture:', function () {
        iterate('greeting', ['DE', 'ID'], function (profile, fixIterate) {
            it('should pass fixture to iteratee callback', function () {
                assert.isDefined(fixIterate);
                if (profile === 'DE') {
                    assert.equal(fixIterate.greeting, 'Guten Morgen');
                } else if (profile === 'ID') {
                    assert.equal(fixIterate.greeting, 'Selamat Pagi');
                }
            });
        });
    });

    describe('@iterate-profiles Profile list:', function () {
        describe('Profile list from iterate options', function () {
            iterate('greeting', ['DE', 'ID'], function (profile, fixIterate, index, profiles) {
                it('should pass profile, fixture, index  and profiles to iterate callback',
                    function () {
                        assert.isDefined(fixIterate);
                        assertGreeting(['DE', 'ID'], fixIterate.greeting, profile,
                            fixIterate, index);
                        assert.deepEqual(profiles, ['DE', 'ID']);
                    }
                );

                it('should pass a new fixture to "it" statement: ' + profile,
                    function (done, fixture) {
                        assert.isDefined(fixture);
                        assert.notEqual(fixture, fixIterate);
                        assertGreeting(['DE', 'ID'], fixture.greeting, profile, fixture, index);
                        done();
                    }
                );

                it('should allow "it" statement with just done argument: ' + profile,
                    function (done) {
                        assert.isFunction(done);
                        done();
                    }
                );
            });
        });

        describe('Profile list from FIXO_ITERATE_PROFILES env variable', function () {
            process.env.FIXO_ITERATE_PROFILES = 'ES, ID';

            iterate('greeting', ['DE', 'ID'], function (profile, fixture, index) {
                it('should iterate and load fixture for profile: ' + profile,
                    function () {
                        assertGreeting(['ES', 'ID'], fixture.greeting, profile, fixture, index);
                    }
                );
            });

            process.env.FIXO_ITERATE_PROFILES = '';
        });

        describe('Profile list from iterate config in the fixture file', function () {
            iterate('greeting', function (profile, fixture, index) {
                it('should iterate and load fixture for profile: ' + profile,
                    function () {
                        assertGreeting(['DE', 'ES'], fixture.greeting, profile, fixture, index);
                    }
                );
            });
        });

        describe('Profile list from only first fixture', function () {
            iterate(['greeting', 'profile'], function (profile, fixtures, index) {
                it('should iterate and load fixture for profile: ' + profile,
                    function () {
                        var fixGreeting = fixtures[0];
                        var fixProfile = fixtures[1];

                        assert.equal(fixtures.length, 2);
                        assertGreeting(['DE', 'ES'],
                            fixGreeting.greeting, profile, fixGreeting, index);
                        assert.equal(fixProfile.name, 'Walter Mitty');
                    }
                );
            });
        });
    });

    describe('@iterate-list', function () {
        describe('Profile list from from iterate config in fixture file',
            function () {
                var iterateProfiles = [];

                iterate('greeting', function (profile) {
                    iterateProfiles.push(profile);
                });

                it('should load profiles', function () {
                    assert.deepEqual(iterateProfiles, ['DE', 'ES']);
                });
            }
        );

        describe('Profile list with custom key passed to iterate function', function () {
            var iterateProfiles = [];

            iterate('greeting', undefined, {
                list: 'large'
            }, function (profile) {
                iterateProfiles.push(profile);
            });

            it('should load profiles', function () {
                assert.deepEqual(iterateProfiles, ['DE', 'ES', 'ID']);
            });
        });

        describe('Profile list with custom key set by FIXO_ITERATE_LIST env variable',
            function () {
                process.env.FIXO_ITERATE_LIST = 'large';

                var iterateProfiles = [];

                iterate('greeting', function (profile) {
                    iterateProfiles.push(profile);
                });

                it('should load profiles', function () {
                    assert.deepEqual(iterateProfiles, ['DE', 'ES', 'ID']);
                });

                process.env.FIXO_ITERATE_LIST = '';
            }
        );

        describe('Iterate profile list argument should take precedence over FIXO_ITERATE_LIST',
            function () {
                process.env.FIXO_ITERATE_LIST = 'large';

                var iterateProfiles = [];

                iterate('greeting', ['DE'], function (profile) {
                    iterateProfiles.push(profile);
                });

                it('should load profiles', function () {
                    assert.deepEqual(iterateProfiles, ['DE']);
                });

                process.env.FIXO_ITERATE_LIST = '';
            }
        );

        describe('Undefined key passed through iterate function should fallback to the default key',
            function () {
                var iterateCount = 0;
                var iterateProfiles = [];

                iterate('greeting', undefined, {
                    list: 'unknown'
                }, function (profile) {
                    iterateCount++;
                    iterateProfiles.push(profile);
                });

                it('should load default profiles', function () {
                    assert.equal(iterateCount, 2);
                    assert.deepEqual(iterateProfiles, ['DE', 'ES']);
                });
            }
        );

        describe('Undefined key from env variable should fallback to the default key',
            function () {
                process.env.FIXO_ITERATE_LIST = 'unknown';

                var iterateCount = 0;
                var iterateProfiles = [];

                iterate('greeting', function (profile) {
                    iterateCount++;
                    iterateProfiles.push(profile);
                });

                it('should load default profiles', function () {
                    assert.equal(iterateCount, 2);
                    assert.deepEqual(iterateProfiles, ['DE', 'ES']);
                });

                process.env.FIXO_ITERATE_LIST = '';
            }
        );

        describe('Default iterate list key should load from nemo config', function () {
            var iterateCount = 0;
            var iterateProfiles = [];

            process.env.nemoBaseDir = path.join(__dirname, '..', 'config', 'profiles-key');

            iterate('greeting', function (profile) {
                iterateCount++;
                iterateProfiles.push(profile);
            });

            it('should load default profiles', function () {
                assert.equal(iterateCount, 1);
                assert.deepEqual(iterateProfiles, ['DE']);
            });

            process.env.nemoBaseDir = path.join(__dirname, '..');
        });
    });

    describe('@iterate-filename', function () {
        iterate(__filename, function (profile, fixture, index) {
            it('should load fixture matching the spec filename, profile: ' + profile,
                function (done, fixture) {
                    assertGreeting(['DE', 'ES'], fixture.greeting, profile, fixture, index);
                    done();
                }
            );

            it('should run test case without the done callback, profile:' + profile,
                function () {
                    assertGreeting(['DE', 'ES'], fixture.greeting, profile, fixture, index);
                }
            );
        });
    });

    after(function (done) {
        if (nemo.driver) {
            nemo.driver.quit().then(done);
        }
    });
});

