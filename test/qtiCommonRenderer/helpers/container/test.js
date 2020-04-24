define(['jquery', 'taoQtiItem/qtiItem/core/Element', 'taoQtiItem/qtiCommonRenderer/helpers/container'], function (
    $,
    Element,
    containerHelper
) {
    'use strict';

    const $container = $('#item-container');
    const CustomElementClass = Element.extend({
        qtiClass: 'choice',
        serial: 'choice'
    });

    const choiceElement = new CustomElementClass();

    QUnit.module('taoQtiItem/qtiCommonRenderer/helpers/container', {
        after() {
            containerHelper.clear();
        }
    });

    QUnit.test('Module', function (assert) {
        assert.ok(typeof containerHelper === 'object', 'The module expose an Object');
    });

    QUnit.test('Context', function (assert) {
        containerHelper.setContext($container);
        const currentContext = containerHelper.getContext();
        assert.ok(currentContext === $container, 'Context getter and setter are working');
    });

    QUnit.test('Elements', function (assert) {
        const selector = containerHelper.get(
            {
                getSerial: () => 'test'
            },
            $container
        );

        assert.equal(selector.data('serial'), 'test', 'Element is found by given context');
        const choice = containerHelper.get(choiceElement, $container);
        assert.ok(choice.selector.includes(choiceElement.getSerial()), 'Element choice is found by given context');

        const choiceWithoutContext = containerHelper.get(choiceElement);
        assert.ok(
            choiceWithoutContext.selector.includes(choiceElement.getSerial()),
            'Element choice is found without context'
        );
    });
});
