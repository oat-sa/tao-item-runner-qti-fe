define(['taoQtiItem/scoring/processor/expressions/engine'], function (expressionEngineFactory) {
    QUnit.module('API');

    QUnit.test('factory', function (assert) {
        const ready = assert.async();
        assert.expect(1);

        assert.ok(typeof expressionEngineFactory === 'function', 'the engine expose a factory');

        ready();
    });

    QUnit.test('engine', function (assert) {
        const ready = assert.async();
        assert.expect(2);

        const engine = expressionEngineFactory();

        assert.ok(typeof engine === 'object', 'the engine is an object');
        assert.ok(typeof engine.execute === 'function', 'the engine exposes a execute function');

        ready();
    });

    QUnit.module('Parse 1 level tree');

    QUnit.test('2 operands sum expression', function (assert) {
        const ready = assert.async();
        assert.expect(1);

        const expression = {
            qtiClass: 'sum',
            expressions: [
                {
                    qtiClass: 'baseValue',
                    attributes: {
                        baseType: 'integer'
                    },
                    value: '3'
                },
                {
                    qtiClass: 'baseValue',
                    attributes: {
                        baseType: 'integer'
                    },
                    value: '7'
                }
            ]
        };

        const expectedResult = {
            cardinality: 'single',
            baseType: 'integer',
            value: 10
        };

        const engine = expressionEngineFactory();

        assert.deepEqual(engine.execute(expression), expectedResult, 'the engine compute the right result');

        ready();
    });

    QUnit.module('Parse 2 levels tree');

    QUnit.test('2 operands sum expression', function (assert) {
        const ready = assert.async();
        assert.expect(1);

        const expression = {
            qtiClass: 'subtract',
            expressions: [
                {
                    qtiClass: 'sum',
                    expressions: [
                        {
                            qtiClass: 'baseValue',
                            attributes: {
                                baseType: 'integer'
                            },
                            value: '3'
                        },
                        {
                            qtiClass: 'baseValue',
                            attributes: {
                                baseType: 'integer'
                            },
                            value: '7'
                        },
                        {
                            qtiClass: 'baseValue',
                            attributes: {
                                baseType: 'integer'
                            },
                            value: '5'
                        }
                    ]
                },
                {
                    qtiClass: 'product',
                    expressions: [
                        {
                            qtiClass: 'baseValue',
                            attributes: {
                                baseType: 'integer'
                            },
                            value: '2'
                        },
                        {
                            qtiClass: 'baseValue',
                            attributes: {
                                baseType: 'integer'
                            },
                            value: '5'
                        }
                    ]
                }
            ]
        };

        const expectedResult = {
            cardinality: 'single',
            baseType: 'integer',
            value: 5
        };
        const engine = expressionEngineFactory();
        assert.deepEqual(engine.execute(expression), expectedResult, 'the engine compute the right result');

        ready();
    });
});
