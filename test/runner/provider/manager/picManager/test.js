define([
    'jquery',
    'taoQtiItem/runner/provider/manager/picManager',
    'taoQtiItem/qtiItem/core/Element'
], function ($, picManagerFactory, Element) {
    'use strict';

    QUnit.module('runner/provider/manager/picManager', {
        beforeEach() {
            $('#qunit-fixture').empty();
        }
    });

    QUnit.test('manager enable/disable/show/hide', function (assert) {
        const pic = new Element('infoControl', 'p1');
        pic.serial = 'p1';
        pic.typeIdentifier = 'type1';

        $('<div data-serial="p1"><div class="tool"><button class="sts-button"></button></div></div>')
            .appendTo('#qunit-fixture');

        const manager = picManagerFactory.manager(pic, new Element('assessmentItem', 'item1'));

        manager.disable();
        assert.ok($('.sts-button').hasClass('disabled'), 'disabled class added');

        manager.enable();
        assert.notOk($('.sts-button').hasClass('disabled'), 'disabled class removed');

        manager.hide();
        assert.equal($('.tool').css('display'), 'none', 'tool hidden');

        manager.show();
        assert.notEqual($('.tool').css('display'), 'none', 'tool shown');
    });

    QUnit.test('collection executes actions on pics', function (assert) {
        const item = new Element('assessmentItem', 'item1');
        item.getElements = () => [
            new Element('infoControl', 'pic1'),
            new Element('infoControl', 'pic2')
        ];

        const collection = picManagerFactory.collection(item);
        const list = collection.getList(true);
        assert.equal(list.length, 2, 'collects two pic managers');

        let count = 0;
        list[0].enable = () => { count += 1; };
        list[1].enable = () => { count += 1; };
        collection.enableAll();
        assert.equal(count, 2, 'enableAll triggers for each');
    });
});
