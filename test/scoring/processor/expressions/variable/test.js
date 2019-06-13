define([

    'lodash',
    'taoQtiItem/scoring/processor/expressions/preprocessor',
    'taoQtiItem/scoring/processor/expressions/variable',
    'taoQtiItem/scoring/processor/errorHandler'
], function(_, preProcessorFactory, variableProcessor, errorHandler) {
    'use strict';

    QUnit.module('API');

    QUnit.test('structure', function(assert) {
        assert.ok(_.isPlainObject(variableProcessor), 'the processor expose an object');
        assert.ok(_.isFunction(variableProcessor.process), 'the processor has a process function');
    });

    QUnit.module('Process');

    QUnit.test('Get the variable', function(assert) {
        var state = {
            RESPONSE: {
                cardinality: 'single',
                baseType: 'identifier',
                value: 'choice-2'
            }
        };
        variableProcessor.expression = {
            attributes: {identifier: 'RESPONSE'}
        };
        variableProcessor.state = state;
        variableProcessor.preProcessor = preProcessorFactory(state);

        var expectedResult = {
            cardinality: 'single',
            baseType: 'identifier',
            value: 'choice-2'
        };
        assert.deepEqual(variableProcessor.process(), expectedResult, 'returns the variable response');
    });

    QUnit.test('Get the variable value even null', function(assert) {
        var state = {
        };
        variableProcessor.expression = {
            attributes: {identifier: 'RESPONSE'}
        };
        variableProcessor.state = state;
        variableProcessor.preProcessor = preProcessorFactory(state);

        assert.equal(variableProcessor.process(), null, 'returns null');
    });

    QUnit.test('Get the variable value even with a null value', function(assert) {
        var state = {
            RESPONSE: {
                cardinality: 'single',
                baseType: 'identifier',
                value: null
            }
        };
        variableProcessor.expression = {
            attributes: {identifier: 'RESPONSE'}
        };
        variableProcessor.state = state;
        variableProcessor.preProcessor = preProcessorFactory(state);

        var expectedResult = {
            cardinality: 'single',
            baseType: 'identifier',
            value: null
        };
        assert.deepEqual(variableProcessor.process(), expectedResult, 'returns null');
    });

    QUnit.test('Get null if no variable is found', function(assert) {
        assert.expect(1);
        variableProcessor.expression = {
            attributes: {identifier: 'RESPONSE'}
        };
        variableProcessor.state = {
            RESPONSE_1: {
                cardinality: 'single',
                baseType: 'identifier',
                value: 'choice-2'
            }
        };

        assert.deepEqual(variableProcessor.process(), null, 'returns null');
    });
});
