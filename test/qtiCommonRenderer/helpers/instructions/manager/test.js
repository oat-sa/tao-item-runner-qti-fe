define([
    'jquery',
    'taoQtiItem/qtiCommonRenderer/helpers/instructions/instructionManager',
    'taoQtiItem/qtiCommonRenderer/helpers/container'
], function ($, instructionManager, containerHelper) {
    'use strict';

    QUnit.module('qtiCommonRenderer/helpers/instructions/instructionManager', {
        beforeEach() {
            $('#qunit-fixture').empty();
            containerHelper.clear();
        }
    });

    function buildElement(serial) {
        return {
            getSerial: () => serial
        };
    }

    QUnit.test('appendInstruction creates DOM and validates', function (assert) {
        const element = buildElement('inst-1');
        const $container = $('<div></div>')
            .attr('data-serial', 'inst-1')
            .append('<div class="instruction-container"></div>')
            .appendTo('#qunit-fixture');

        containerHelper.setContext($('#qunit-fixture'));

        let validated = false;
        instructionManager.appendInstruction(element, 'Hello', function () {
            validated = true;
        });

        assert.equal($container.find('.item-instruction').length, 1, 'instruction added to DOM');

        instructionManager.validateInstructions(element, { foo: 'bar' });
        assert.ok(validated, 'validate callback executed');
    });

    QUnit.test('resetInstructions restores default state', function (assert) {
        const element = buildElement('inst-2');
        const $container = $('<div></div>')
            .attr('data-serial', 'inst-2')
            .append('<div class="instruction-container"></div>')
            .appendTo('#qunit-fixture');

        containerHelper.setContext($('#qunit-fixture'));

        const instruction = instructionManager.appendInstruction(element, 'Hello', function () {});
        instruction.setLevel('success');
        assert.ok($container.find('.feedback-success').length, 'success class applied');

        instructionManager.resetInstructions(element);
        assert.ok($container.find('.feedback-info').length, 'reset back to info');
    });

    QUnit.test('appendNotification adds and removes notification', function (assert) {
        const done = assert.async();
        const element = buildElement('inst-3');
        const $container = $('<div></div>')
            .attr('data-serial', 'inst-3')
            .append('<div class="notification-container"></div>')
            .appendTo('#qunit-fixture');

        containerHelper.setContext($('#qunit-fixture'));

        instructionManager.appendNotification(element, 'Warn', 'warning');
        const $notif = $container.find('.item-notification');
        assert.equal($notif.length, 1, 'notification added');

        $notif.find('.close-trigger').trigger('click');
        setTimeout(() => {
            assert.ok(true, 'close handler executed');
            done();
        }, 10);
    });

    QUnit.test('minMaxChoiceInstructions handles max equals min', function (assert) {
        const element = buildElement('inst-4');
        const $container = $('<div></div>')
            .attr('data-serial', 'inst-4')
            .append('<div class="instruction-container"></div>')
            .appendTo('#qunit-fixture');

        containerHelper.setContext($('#qunit-fixture'));

        let responseCount = 2;
        const interaction = Object.assign({}, element, {
            getChoices: () => [1, 2, 3]
        });
        const onError = () => {
            responseCount = 0;
        };

        instructionManager.minMaxChoiceInstructions(interaction, {
            min: 2,
            max: 2,
            getResponse: () => new Array(responseCount),
            onError
        });

        instructionManager.validateInstructions(interaction, {});
        assert.ok($container.find('.item-instruction').length, 'instruction exists');
    });

    QUnit.test('minMaxChoiceInstructions handles max only', function (assert) {
        const element = buildElement('inst-5');
        const $container = $('<div></div>')
            .attr('data-serial', 'inst-5')
            .append('<div class="instruction-container"></div>')
            .appendTo('#qunit-fixture');

        containerHelper.setContext($('#qunit-fixture'));

        const interaction = Object.assign({}, element, {
            getChoices: () => [1, 2, 3]
        });

        instructionManager.minMaxChoiceInstructions(interaction, {
            min: 0,
            max: 1,
            getResponse: () => [1]
        });

        instructionManager.validateInstructions(interaction, {});
        assert.ok($container.find('.item-instruction').length, 'max instruction exists');
    });

    QUnit.test('minMaxChoiceInstructions handles min only', function (assert) {
        const element = buildElement('inst-6');
        const $container = $('<div></div>')
            .attr('data-serial', 'inst-6')
            .append('<div class="instruction-container"></div>')
            .appendTo('#qunit-fixture');

        containerHelper.setContext($('#qunit-fixture'));

        const interaction = Object.assign({}, element, {
            getChoices: () => [1, 2, 3, 4]
        });

        instructionManager.minMaxChoiceInstructions(interaction, {
            min: 2,
            max: 0,
            getResponse: () => [1]
        });

        instructionManager.validateInstructions(interaction, {});
        assert.ok($container.find('.item-instruction').length, 'min instruction exists');
    });

    QUnit.test('removeNotifications clears notification elements', function (assert) {
        const element = buildElement('inst-7');
        const $container = $('<div></div>')
            .attr('data-serial', 'inst-7')
            .append('<div class="notification-container"><div class="item-notification"></div></div>')
            .appendTo('#qunit-fixture');

        containerHelper.setContext($('#qunit-fixture'));

        instructionManager.removeNotifications(element);
        assert.equal($container.find('.item-notification').length, 0, 'notifications removed');
    });
});
