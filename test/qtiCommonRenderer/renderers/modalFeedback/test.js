define([
    'jquery',
    'taoQtiItem/qtiCommonRenderer/renderers/ModalFeedback',
    'taoQtiItem/qtiCommonRenderer/helpers/container'
], function ($, modalFeedbackRenderer, containerHelper) {
    'use strict';

    QUnit.module('qtiCommonRenderer/renderers/ModalFeedback', {
        beforeEach() {
            $('#qunit-fixture').empty();
            containerHelper.clear();
        }
    });

    QUnit.test('getData adds feedbackStyle', function (assert) {
        const data = modalFeedbackRenderer.getData({}, {});
        assert.equal(data.feedbackStyle, 'mock-style', 'adds feedback style from helper');
    });

    QUnit.test('render sets item body height and calls callback on close', function (assert) {
        const ready = assert.async();
        const $root = $('<div data-serial="root-1"><div class="qti-itemBody" style="height:10px"></div></div>')
            .appendTo('#qunit-fixture');
        const $modal = $('<div data-serial="modal-1" style="top:5px"></div>').appendTo('#qunit-fixture');
        $modal.height(30);

        const modalFeedback = {
            getSerial: () => 'modal-1',
            getRootElement: () => ({
                getSerial: () => 'root-1'
            })
        };

        containerHelper.setContext($('#qunit-fixture'));

        modalFeedbackRenderer.render(modalFeedback, {
            callback() {
                assert.ok(true, 'callback called on close');
                ready();
            }
        });

        const itemBodyHeight = $root.find('.qti-itemBody').height();
        assert.equal(itemBodyHeight, 35, 'item body height adjusted to modal height');

        $modal.trigger('closed.modal');
    });
});
