define([
    'taoQtiItem/qtiCommonRenderer/helpers/patternMask'
], function(patternMaskHelper) {
    'use strict';

    QUnit.module('API');

    QUnit.test('structure', function(assert) {
        assert.ok(typeof patternMaskHelper === 'object', 'the helper exposes an object');
        assert.ok(typeof patternMaskHelper.parsePattern === 'function', 'has parsePattern method');
        assert.ok(typeof patternMaskHelper.createValidator === 'function', 'has createValidator method');
        assert.ok(typeof patternMaskHelper.createMaxWordPattern === 'function', 'has createMaxWordPattern method');
    });

    QUnit.module('parsePattern');

    QUnit.test('parses character patterns', function(assert) {
        assert.equal(patternMaskHelper.parsePattern('^[\\s\\S]{0,10}$', 'chars'), '10', 'extracts character limit');
        assert.equal(patternMaskHelper.parsePattern('^[\\s\\S]{0,5}$', 'chars'), '5', 'extracts different character limit');
        assert.equal(patternMaskHelper.parsePattern('invalid', 'chars'), null, 'returns null for invalid pattern');
        assert.equal(patternMaskHelper.parsePattern(null, 'chars'), null, 'returns null for null pattern');
    });

    QUnit.test('parses word patterns', function(assert) {
        const wordPattern = '^(?:(?:[^\\s\\:\\!\\?\\;\\…\\€]+)[\\s\\:\\!\\?\\;\\…\\€]*){0,5}$';
        assert.equal(patternMaskHelper.parsePattern(wordPattern, 'words'), '5', 'extracts word limit');
        assert.equal(patternMaskHelper.parsePattern('invalid', 'words'), null, 'returns null for invalid pattern');
    });

    QUnit.module('createValidator');

    QUnit.test('creates character validator', function(assert) {
        const validator = patternMaskHelper.createValidator('^[\\s\\S]{0,10}$');

        assert.equal(validator.type, 'character', 'creates character validator');
        assert.equal(validator.getLimit(), 10, 'has correct limit');
        assert.ok(validator.isValid('hello'), 'validates short text');
        assert.ok(validator.isValid('1234567890'), 'validates text at limit');
        assert.notOk(validator.isValid('12345678901'), 'rejects text over limit');
        assert.equal(validator.getCount('hello'), 5, 'counts characters correctly');
    });

    QUnit.test('creates word validator', function(assert) {
        const wordPattern = '^(?:(?:[^\\s\\:\\!\\?\\;\\…\\€]+)[\\s\\:\\!\\?\\;\\…\\€]*){0,3}$';
        const validator = patternMaskHelper.createValidator(wordPattern);

        assert.equal(validator.type, 'word', 'creates word validator');
        assert.equal(validator.getLimit(), 3, 'has correct limit');
        assert.ok(validator.isValid('one two'), 'validates text under limit');
        assert.ok(validator.isValid('one two three'), 'validates text at limit');
        assert.notOk(validator.isValid('one two three four'), 'rejects text over limit');
        assert.equal(validator.getCount('one two three'), 3, 'counts words correctly');
    });

    QUnit.module('Newline handling');

    QUnit.test('character validator ignores newlines', function(assert) {
        const validator = patternMaskHelper.createValidator('^[\\s\\S]{0,10}$');

        assert.equal(validator.getCount('hello\nworld'), 10, 'counts characters without newlines');
        assert.equal(validator.getCount('12345\n6789'), 9, 'newlines are not counted');
        assert.ok(validator.isValid('12345\n6789'), 'validates text with newlines correctly');
        assert.ok(validator.isValid('1234567890\n\n\n'), 'validates text with trailing newlines');
    });

    QUnit.test('word validator input blocking', function(assert) {
        const wordPattern = '^(?:(?:[^\\s\\:\\!\\?\\;\\…\\€]+)[\\s\\:\\!\\?\\;\\…\\€]*){0,2}$';
        const validator = patternMaskHelper.createValidator(wordPattern);

        // Test blocking behavior
        assert.notOk(validator.shouldBlockInput('word1', 65, false), 'allows typing when under limit'); // 'A' key
        assert.notOk(validator.shouldBlockInput('word1 word2', 65, false), 'allows typing at limit');
        assert.ok(validator.shouldBlockInput('word1 word2 ', 65, false), 'blocks typing after space at limit');
        assert.notOk(validator.shouldBlockInput('word1 word2\n', 65, false), 'allows typing after newline at limit');

        // Test Enter key blocking
        assert.ok(validator.shouldBlockInput('word1 word2', 13, true), 'blocks Enter when at word limit');

        // Test space/tab allowance
        assert.notOk(validator.shouldBlockInput('word1 word2', 32, false), 'allows space key');
        assert.notOk(validator.shouldBlockInput('word1 word2', 9, false), 'allows tab key');
    });

    QUnit.module('Edge cases');

    QUnit.test('handles null and empty inputs', function(assert) {
        const validator = patternMaskHelper.createValidator('^[\\s\\S]{0,10}$');

        assert.ok(validator.isValid(''), 'validates empty string');
        assert.ok(validator.isValid(null), 'handles null input');
        assert.equal(validator.getCount(''), 0, 'counts empty string as 0');
        assert.equal(validator.getCount(null), 0, 'counts null as 0');
    });

    QUnit.test('creates null validator for invalid patterns', function(assert) {
        const validator = patternMaskHelper.createValidator('');

        assert.equal(validator.type, 'none', 'creates null validator');
        assert.equal(validator.getLimit(), null, 'has no limit');
        assert.ok(validator.isValid('anything'), 'always validates');
        assert.equal(validator.getCount('anything'), 0, 'always returns 0 count');
        assert.notOk(validator.shouldBlockInput('anything', 65, false), 'never blocks input');
    });
});
