define([
    'jquery',
    'taoQtiItem/qtiCommonRenderer/renderers/Table',
    'taoQtiItem/qtiCommonRenderer/helpers/container',
    'ui/resizeObserver'
], function ($, tableRenderer, containerHelper) {
    'use strict';

    const tableHtml = '<tbody><tr><td>Cell</td></tr></tbody>';
    const tableWithCaptionHtml = '<caption>Test Caption</caption><tbody><tr><td>Cell</td></tr></tbody>';
    const verticalWritingContainerHtml = '<div class="writing-mode-vertical-rl"></div>';

    QUnit.module('qtiCommonRenderer/renderers/Table', {
        beforeEach() {
            $('#qunit-fixture').empty();
            containerHelper.clear();
        }
    });

    QUnit.test('render with vertical writing mode: wraps caption content', function (assert) {
        const $fixture = $(verticalWritingContainerHtml).appendTo('#qunit-fixture');
        const tableData = { serial: 'table-1', body: tableWithCaptionHtml };
        const tableModel = { getSerial: () => 'table-1' };
        containerHelper.setContext($fixture);
        $(tableRenderer.template(tableData)).appendTo($fixture);

        tableRenderer.render(tableModel, {});
        const $caption = $fixture.find('table > caption');
        assert.equal(
            $caption.get(0).outerHTML,
            '<caption class="no-block-size"><span>Test Caption</span></caption>',
            'caption content is wrapped in span'
        );
        tableRenderer.destroy(tableModel);
    });

    QUnit.test('render with vertical writing mode: renders ok if no caption', function (assert) {
        const $fixture = $(verticalWritingContainerHtml).appendTo('#qunit-fixture');
        const tableData = { serial: 'table-1', body: tableHtml };
        const tableModel = { getSerial: () => 'table-1' };
        containerHelper.setContext($fixture);
        $(tableRenderer.template(tableData)).appendTo($fixture);

        tableRenderer.render(tableModel, {});
        const $table = $fixture.find('table');
        assert.equal($table.length, 1, 'renders if no caption');
    });

    QUnit.test('render without vertical writing mode: does not modify caption', function (assert) {
        const $fixture = $('#qunit-fixture');
        const tableData = { serial: 'table-1', body: tableWithCaptionHtml };
        const tableModel = { getSerial: () => 'table-1' };
        containerHelper.setContext($fixture);
        $(tableRenderer.template(tableData)).appendTo($fixture);

        tableRenderer.render(tableModel, {});
        const $caption = $fixture.find('table > caption');
        assert.equal($caption.get(0).outerHTML, '<caption>Test Caption</caption>', 'caption content is not wrapped');
    });
});
