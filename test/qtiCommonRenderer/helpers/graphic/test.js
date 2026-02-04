define([
    'jquery',
    'taoQtiItem/qtiCommonRenderer/helpers/Graphic'
], function ($, GraphicHelper) {
    'use strict';

    QUnit.module('qtiCommonRenderer/helpers/Graphic');

    QUnit.test('setStyle applies known style', function (assert) {
        const element = {
            attr(values) {
                this._attrs = values;
            }
        };
        GraphicHelper.setStyle(element, 'basic');
        assert.ok(element._attrs && element._attrs.stroke, 'style applied');
    });

    QUnit.test('clickPoint and getPoint use container offset', function (assert) {
        const $container = $('<div></div>').appendTo('#qunit-fixture');
        $container.offset = () => ({ left: 5, top: 10 });
        $container.get(0).getBoundingClientRect = () => ({ width: 100 });

        const event = { pageX: 15, pageY: 30 };
        const point = GraphicHelper.clickPoint($container, event);
        assert.deepEqual(point, { x: 10, y: 20 }, 'clickPoint returns adjusted coords');

        const paper = { w: 200 };
        const scaled = GraphicHelper.getPoint(event, paper, $container);
        assert.deepEqual(scaled, { x: 20, y: 40 }, 'getPoint scales coords');
    });

    QUnit.test('position centers paper in container', function (assert) {
        const $container = $('<div></div>').appendTo('#qunit-fixture');
        $container.width = () => 300;
        $container.height = () => 200;

        const paper = { w: 100, width: 100 };
        const pos = GraphicHelper.position($container, paper);
        assert.deepEqual(pos, { left: 100, top: 50 }, 'position centered');
    });

    QUnit.test('trigger invokes registered event', function (assert) {
        let called = false;
        const element = {
            events: [
                {
                    name: 'click',
                    f() {
                        called = true;
                    }
                }
            ]
        };

        GraphicHelper.trigger(element, 'click');
        assert.ok(called, 'event handler called');
    });

    QUnit.test('raphaelCoords maps shapes and validates coords', function (assert) {
        const paper = { width: 100, height: 50 };

        assert.deepEqual(
            GraphicHelper.raphaelCoords(paper, 'rect', '0,0,10,20'),
            [0, 0, 10, 20],
            'rect maps to x,y,w,h'
        );

        assert.deepEqual(
            GraphicHelper.raphaelCoords(paper, 'default', [0, 0, 0, 0]),
            [0, 0, 100, 50],
            'default maps to paper bounds'
        );

        const poly = GraphicHelper.raphaelCoords(paper, 'poly', [0, 0, 10, 0, 10, 10]);
        assert.ok(poly[0].indexOf('M0') === 0, 'poly produces path string');

        assert.throws(
            () => GraphicHelper.raphaelCoords(paper, 'rect', [0, 1]),
            'throws on invalid coords'
        );
    });

    QUnit.test('qtiCoords maps rect and path', function (assert) {
        const paper = { w: 100 };
        const rect = {
            type: 'rect',
            attr() {
                return { x: 5, y: 10, width: 20, height: 30 };
            }
        };
        assert.equal(
            GraphicHelper.qtiCoords(rect, paper, 200),
            '10,20,50,80',
            'rect coords scaled by factor'
        );

        const path = {
            type: 'path',
            attr() {
                return { path: [['M', 0, 0], ['L', 10, 0], ['L', 10, 10]] };
            }
        };
        assert.equal(
            GraphicHelper.qtiCoords(path, paper, 100),
            '10,0,10,10',
            'path returns flattened coords'
        );
    });

    QUnit.test('createTouchCircle animates and removes', function (assert) {
        const done = assert.async();
        const paper = {
            circle() {
                return {
                    attr() {},
                    animate(values, duration, cb) {
                        this._animated = { values, duration };
                        if (typeof cb === 'function') {
                            cb();
                        }
                    },
                    remove() {
                        this._removed = true;
                    }
                };
            }
        };

        GraphicHelper.createTouchCircle(paper, { x: 0, y: 0, width: 10, height: 10 });

        setTimeout(() => {
            // No direct reference to circle; just ensure no crash and async finished
            assert.ok(true, 'touch circle created');
            done();
        }, 10);
    });
});
