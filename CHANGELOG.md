## v0.5.0 (14 Sep 2016)
* Change testDir option to specDir
* Change baseDir option to srcDir
* Remove autoload feature, add load function

## v0.4.0 (22 Apr 2016)
* Rename FIXO_PROFILES env variable to FIXO_ITERATE_PROFILES
* Rename FIXO_PROFILES_KEY env variable to FIXO_ITERATE_LIST
* Change defaultProfilesKey option to defaultIterateList
* Change default iterate list from 'profiles' to 'all'
* Fix iterate profile list not loaded with custom key

## v0.3.6 (22 Apr 2016)
* Fallback to default profiles key if requested key is not defined

## v0.3.5 (20 Apr 2016)
* Fix repository spelling error in package.json

## v0.3.4 (19 Apr 2016)
* Rename FIXO_ITERATE_PROFILES env variable to FIXO_PROFILES
* Rename FIXO_ITERATE_PROFILES_KEY env variable to FIXO_PROFILES_KEY

## v0.3.3 (16 Apr 2016)
* Add resolver support for iterate config values

## v0.3.2 (13 Apr 2016)
* Bump up fixo version

## v0.3.1 (12 Apr 2016)
* Fix fixture not passed to iteratee if arguments length is 2

## v0.3.0 (11 Apr 2016)
* Enable iterate method to load fixture synchronously
* Pass fixture to it statement after done
* Change autoload multiple fixtures reference to nemo.fixo.fixture

## v0.2.2 (7 Apr 2016)
* Move load fixture with \_\_filename feature to fixo

## v0.2.1 (4 Apr 2016)
* Bump up fixo version

## v0.2.0 (4 Apr 2016)
* Change iterate function from async to sync

## v0.1.5 (31 Mar 2016)
* Throw error if fixture can not be loaded
* Add iterate function

## v0.1.4 (24 Mar 2016)
* Fix fixture autoload to match spec directory structures

## v0.1.3 (23 Mar 2016)
* Bump up required fixo minor version

## v0.1.1 (18 Mar 2016)
* Fix after setup callback passing an additional argument
* Fix after setup callback passing an additional argument

## v0.1.0 (10 Mar 2016)
* First release
