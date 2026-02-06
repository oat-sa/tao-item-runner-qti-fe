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
        assert.equal(
            validator.limitPastedContent('123456789', 'a\nb'),
            'a',
            'limits pasted content with newlines'
        );
        assert.ok(validator.shouldBlockInput('1234567890', 65, false), 'blocks typing at limit');
        assert.ok(validator.shouldBlockInput('1234567890', 66, false), 'blocks typing when over limit');
        assert.notOk(validator.shouldBlockInput('1234567890', 13, true), 'allows enter key at limit');
        assert.notOk(validator.shouldBlockInput('1234567890', 37, false), 'allows navigation key at limit');
        assert.equal(validator.limitPastedContent('1234567890', 'x'), '', 'blocks pasted content when no room');
        assert.equal(validator.limitPastedContent('', 'abc'), 'abc', 'keeps pasted content under limit');
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
        assert.equal(
            validator.limitPastedContent('one two', 'three four'),
            'three',
            'limits pasted content by words'
        );
        assert.equal(validator.limitPastedContent('one two three', 'four'), '', 'blocks pasted content when at limit');
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

    QUnit.test('creates custom validator and regex handling', function(assert) {
        const validator = patternMaskHelper.createValidator('^[0-9]{2}$');

        assert.equal(validator.type, 'custom', 'creates custom validator');
        assert.ok(validator.isValid('12'), 'validates matching text');
        assert.notOk(validator.isValid('123'), 'rejects non-matching text');
        assert.equal(validator.limitPastedContent('1', '2'), '2', 'accepts pasted content if valid');
        assert.equal(validator.limitPastedContent('1', 'a'), '', 'rejects pasted content if invalid');
        assert.ok(validator.isValid('12'), 'custom validator matches full string');
        assert.notOk(validator.isValid('1a'), 'custom validator rejects invalid string');
    });

    QUnit.test('custom validator tolerates invalid regex', function(assert) {
        const validator = patternMaskHelper.createValidator('[');

        assert.equal(validator.type, 'custom', 'creates custom validator even for invalid pattern');
        assert.ok(validator.isValid('anything'), 'invalid regex allows any text');
        assert.equal(validator.limitPastedContent('a', 'b'), '', 'invalid regex rejects pasted content');
    });

    QUnit.test('custom validator allows any input when pattern empty', function (assert) {
        const validator = patternMaskHelper.createValidator('');

        assert.equal(validator.type, 'none', 'creates null validator');
        assert.ok(validator.isValid('abc'), 'accepts any text');
        assert.equal(validator.limitPastedContent('a', 'b'), 'b', 'returns pasted content');
    });

    QUnit.test('countWords handles multiple delimiters', function (assert) {
        const validator = patternMaskHelper.createValidator('^(?:(?:[^\\s\\:\\!\\?\\;\\…\\€]+)[\\s\\:\\!\\?\\;\\…\\€]*){0,4}$');
        assert.equal(validator.getCount('one,two;three'), 3, 'counts words across delimiters');
        assert.equal(validator.getCount('   '), 0, 'empty string yields zero');
    });

    QUnit.module('Utility helpers');

    QUnit.test('createMaxCharPattern and isMaxEntryRestriction', function(assert) {
        const charPattern = patternMaskHelper.createMaxCharPattern(7);
        const wordPattern = patternMaskHelper.createMaxWordPattern(3);

        assert.equal(charPattern, '^[\\s\\S]{0,7}$', 'creates max char pattern');
        assert.ok(patternMaskHelper.isMaxEntryRestriction(wordPattern), 'detects word-based restriction');
        assert.notOk(patternMaskHelper.isMaxEntryRestriction(charPattern), 'ignores char-based restriction');
    });
});
