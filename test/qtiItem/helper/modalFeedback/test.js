define([
    'jquery',
    'taoQtiItem/qtiItem/helper/modalFeedback',
    'taoQtiItem/qtiItem/helper/container'
], function ($, modalFeedback, containerHelper) {
    'use strict';

    QUnit.module('qtiItem/helper/modalFeedback', {
        beforeEach() {
            $('#qunit-fixture').empty();
        }
    });

    function buildFeedback(id, outcomeIdentifier, title, body, relatedOutcome) {
        return {
            id: () => id,
            body: () => body,
            attr(name) {
                if (name === 'outcomeIdentifier') return outcomeIdentifier;
                if (name === 'title') return title;
                return null;
            },
            getSerial: () => id,
            metaData: {},
            renderer: {},
            getContainer: () => $('<div></div>'),
            data: () => null,
            getRootElement: () => null,
            getContainerContext: () => null,
            getResponseDeclaration: () => null,
            _relatedOutcome: relatedOutcome
        };
    }

    QUnit.test('getFeedbacks returns unique messages by group', function (assert) {
        const $item = $('<div></div>')
            .addClass('qti-item')
            .append('<div class="qti-itemBody"></div>')
            .appendTo('#qunit-fixture');

        $item.find('.qti-itemBody')
            .append('<div class="qti-interaction" data-serial="i1"></div>')
            .append('<div class="qti-interaction" data-serial="i2"></div>');

        const interaction1 = {
            is: cls => cls === 'interaction',
            getContainer: () => $item.find('[data-serial="i1"]'),
            attr: name => (name === 'responseIdentifier' ? 'RESP1' : null)
        };
        const interaction2 = {
            is: cls => cls === 'interaction',
            getContainer: () => $item.find('[data-serial="i2"]'),
            attr: name => (name === 'responseIdentifier' ? 'RESP2' : null)
        };

        const item = {
            getContainer: () => $item,
            getComposingElements: () => [interaction1, interaction2],
            modalFeedbacks: [
                buildFeedback('f1', 'OUT', 'Title', 'Body', 'RESP1'),
                buildFeedback('f1', 'OUT', 'Title', 'Body', 'RESP1')
            ]
        };

        containerHelper.getEncodedData = () => 'RESP1';

        const itemSession = { OUT: { base: { string: 'f1' } } };
        const queue = modalFeedback.getFeedbacks(item, itemSession);

        assert.equal(queue.length, 1, 'deduplicates identical feedbacks');
        assert.equal(queue[0].$container[0], $item.find('[data-serial="i1"]')[0], 'uses interaction container');
    });

    QUnit.test('getFeedbacks handles inline interactions and message groups', function (assert) {
        const $item = $('<div></div>').addClass('qti-item').append('<div class="qti-itemBody"></div>');
        const $body = $item.find('.qti-itemBody');
        const $col = $('<div class="col-6"></div>').appendTo($body);
        $('<div class="qti-interaction" data-serial="i-inline"></div>').appendTo($col);
        $item.appendTo('#qunit-fixture');

        const interaction = {
            is: cls => cls === 'interaction' || cls === 'inlineInteraction',
            getContainer: () => $item.find('[data-serial="i-inline"]'),
            attr: name => (name === 'responseIdentifier' ? 'RESP_INLINE' : null)
        };

        const item = {
            getContainer: () => $item,
            getComposingElements: () => [interaction],
            modalFeedbacks: [buildFeedback('f2', 'OUT2', 'Title2', 'Body2', 'RESP_INLINE')]
        };

        const itemSession = { OUT2: { base: { string: 'f2' } } };
        const queue = modalFeedback.getFeedbacks(item, itemSession);

        assert.equal(queue.length, 1, 'inline feedback queued');
        assert.ok($col.attr('data-messageGroupId'), 'message group id set');
    });

    QUnit.test('getFeedbacks returns empty when outcome missing', function (assert) {
        const $item = $('<div></div>').addClass('qti-item').append('<div class="qti-itemBody"></div>');
        const interaction = {
            is: cls => cls === 'interaction',
            getContainer: () => $('<div class="qti-interaction"></div>'),
            attr: name => (name === 'responseIdentifier' ? 'RESP1' : null)
        };
        const item = {
            getContainer: () => $item,
            getComposingElements: () => [interaction],
            modalFeedbacks: [buildFeedback('f3', 'OUT3', 'Title3', 'Body3', 'RESP1')]
        };

        const queue = modalFeedback.getFeedbacks(item, {});
        assert.equal(queue.length, 0, 'no outcome means no feedbacks');
    });
});
