/*
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU General Public License
 * as published by the Free Software Foundation; under version 2
 * of the License (non-upgradable).
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.
 *
 * Copyright (c) 2020 (original work) Open Assessment Technologies SA
 **/
define([
    'taoQtiItem/qtiItem/core/Loader',
    'taoQtiItem/test/qtiItem/core/loader/testQtiClass',
    'taoQtiItem/qtiItem/core/Container',
    'taoQtiItem/qtiItem/core/Tooltip',
    'taoQtiItem/qtiItem/core/PortableInfoControl',
    'taoQtiItem/qtiItem/core/interactions/CustomInteraction',
    'taoQtiItem/qtiItem/core/Math',
    'taoQtiItem/qtiItem/core/choices/TextVariableChoice',
    'taoQtiItem/qtiItem/core/choices/GapText',
    'taoQtiItem/qtiItem/core/interactions/ChoiceInteraction',
    'taoQtiItem/qtiItem/core/interactions/MatchInteraction',
    'taoQtiItem/qtiItem/core/interactions/GraphicGapMatchInteraction',
    'taoQtiItem/qtiItem/core/variables/ResponseDeclaration',
    'taoQtiItem/qtiItem/helper/responseRules',
], function (...args) {
    const [
        QtiItemLoader,
        TestQtiClass,
        ContainerQtiClass,
        TooltipQtiClass,
        InfoControlQtiClass,
        CustomInteractionQtiClass,
        MathQtiClass,
        TextVariableChoiceQtiClass,
        GapTextQtiClass,
        ChoiceInteractionQtiClass,
        MatchInteractionQtiClass,
        GraphicGapMatchInteractionQtiClass,
        ResponseDeclarationQtiClass,
        responseRulesHelper,
    ] = args;

    QUnit.module('QTI item loader');

    QUnit.test('loader module', function (assert) {
        assert.equal(typeof QtiItemLoader, 'function', 'The pluginFactory module exposes a function');
        assert.equal(typeof new QtiItemLoader(), 'object', 'The plugin factory produces an instance');
    });

    const pluginApi = [
        {
            name: 'init',
            title: 'init',
        },
        {
            name: 'setClassesLocation',
            title: 'setClassesLocation',
        },
        {
            name: 'getRequiredClasses',
            title: 'getRequiredClasses',
        },
        {
            name: 'loadRequiredClasses',
            title: 'loadRequiredClasses',
        },
        {
            name: 'getLoadedClasses',
            title: 'getLoadedClasses',
        },
        {
            name: 'loadItemData',
            title: 'loadItemData',
        },
        {
            name: 'loadAndBuildElement',
            title: 'loadAndBuildElement',
        },
        {
            name: 'loadElement',
            title: 'loadElement',
        },
        {
            name: 'loadElements',
            title: 'loadElements',
        },
        {
            name: 'buildResponse',
            title: 'buildResponse',
        },
        {
            name: 'buildSimpleFeedbackRule',
            title: 'buildSimpleFeedbackRule',
        },
        {
            name: 'buildOutcome',
            title: 'buildOutcome',
        },
        {
            name: 'buildResponseProcessing',
            title: 'buildResponseProcessing',
        },
        {
            name: 'loadContainer',
            title: 'loadContainer',
        },
        {
            name: 'buildElement',
            title: 'buildElement',
        },
        {
            name: 'loadElementData',
            title: 'loadElementData',
        },
        {
            name: 'loadInteractionData',
            title: 'loadInteractionData',
        },
        {
            name: 'buildInteractionChoices',
            title: 'buildInteractionChoices',
        },
        {
            name: 'loadChoiceData',
            title: 'loadChoiceData',
        },
        {
            name: 'loadObjectData',
            title: 'loadObjectData',
        },
        {
            name: 'loadMathData',
            title: 'loadMathData',
        },
        {
            name: 'loadTooltipData',
            title: 'loadTooltipData',
        },
        {
            name: 'loadPciData',
            title: 'loadPciData',
        },
        {
            name: 'loadPicData',
            title: 'loadPicData',
        },
    ];
    QUnit.cases.init(pluginApi).test('loader API ', function (data, assert) {
        const loader = new QtiItemLoader();

        assert.equal(
            typeof loader[data.name],
            'function',
            `The pluginFactory instances expose a "${data.name}" function`
        );
    });

    QUnit.test('init', function (assert) {
        const item = { foo: 'bar' };
        const loader = new QtiItemLoader(item);
        const { classesLocation, item: loaderItem, qti } = loader;

        assert.equal(
            typeof classesLocation,
            'object',
            'The loader init classesLocation'
        );
        assert.equal(
            typeof qti,
            'object',
            'The loader init qti'
        );
        assert.deepEqual(
            loaderItem,
            item,
            'The loader init item'
        );
    });

    QUnit.test('setClassesLocation', function (assert) {
        const initialClassesLocation = { foo: 'bar' };
        const loader = new QtiItemLoader(null, initialClassesLocation);
        const additionalClassesLocation = { test: 'test' };

        loader.setClassesLocation(additionalClassesLocation);

        const { classesLocation } = loader;
        assert.deepEqual(
            classesLocation,
            {
                foo: 'bar',
                test: 'test',
            },
            'setClassesLocation extends classesLocation'
        );
    });

    QUnit.test('getRequiredClasses', function (assert) {
        const loader = new QtiItemLoader();
        const data = {
            qtiClass: 'test',
            foo: {
                qtiClass: 'test1',
                bar: {
                    qtiClass: 'test2',
                }
            }
        };

        const actual = loader.getRequiredClasses(data);

        assert.deepEqual(
            actual,
            ['test', 'test1', 'test2'],
            'getRequiredClasses returns list of qti classes'
        );
    });

    QUnit.test('loadRequiredClasses', function (assert) {
        const ready = assert.async();
        const initialClassesLocation = { testQtiClass: 'taoQtiItem/test/qtiItem/core/loader/testQtiClass' };
        const loader = new QtiItemLoader(null, initialClassesLocation);
        const data = {
            qtiClass: 'testQtiClass',
        };

        loader.loadRequiredClasses(data, ({ testQtiClass }) => {
            assert.equal(
                typeof testQtiClass,
                'function',
                'loadRequiredClasses load required classes'
            );

            ready();
        });
    });

    QUnit.test('getLoadedClasses', function (assert) {
        const ready = assert.async();
        const initialClassesLocation = { testQtiClass: 'taoQtiItem/test/qtiItem/core/loader/testQtiClass' };
        const loader = new QtiItemLoader(null, initialClassesLocation);
        const data = {
            qtiClass: 'testQtiClass',
        };

        loader.loadRequiredClasses(data, () => {
            const [testQtiClassName] = loader.getLoadedClasses();

            assert.equal(
                testQtiClassName,
                'testQtiClass',
                'getLoadedClasses loaded qti classes'
            );

            ready();
        });
    });

    QUnit.test('loadObjectData', function (assert) {
        const loader = new QtiItemLoader();
        const additionalClassesLocation = { testQtiClass: 'taoQtiItem/test/qtiItem/core/loader/testQtiClass' };
        const element = new TestQtiClass();
        const data = {
            attributes: {
                foo: 'bar',
            },
        };
        const altQtiClass = {
            foo: 'bar',
        };

        loader.setClassesLocation(additionalClassesLocation);
        loader.loadObjectData(element, data);

        assert.deepEqual(
            element.attributes,
            data.attributes,
            'loadObjectData assign attributes to element'
        );

        loader.loadObjectData(element, Object.assign({}, data, { _alt: altQtiClass }));

        assert.deepEqual(
            element._alt,
            altQtiClass,
            'loadObjectData assign _alt to element'
        );
    });

    QUnit.test('loadContainer', function (assert) {
        const ready = assert.async();
        const loader = new QtiItemLoader();
        const additionalClassesLocation = { testQtiClass: 'taoQtiItem/test/qtiItem/core/loader/testQtiClass' };
        const element = new ContainerQtiClass();
        const testElemnt = new TestQtiClass();
        const data = {
            body: 'test',
            elements: {
                testQtiElement: {
                    qtiClass: 'testQtiClass',
                    serial: 'testQtiClass',
                },
            },
        };

        loader.setClassesLocation(additionalClassesLocation);

        assert.throws(
            () => loader.loadContainer(testElemnt),
            new Error('bodyObject must be a QTI Container'),
            'throws error in case if element is not container'
        );

        assert.throws(
            () => loader.loadContainer(element),
            new Error('wrong bodydata format'),
            'throws error in case if there is no body data'
        );

        loader.loadRequiredClasses({ qtiClass: 'testQtiClass' }, () => {
            loader.loadContainer(element, data);

            assert.equal(
                element.elements.testQtiClass.serial,
                'testQtiClass',
                'loadContainer load container elements'
            );

            assert.equal(
                element.elements.testQtiClass.serial,
                'testQtiClass',
                'loadContainer load container body'
            );

            ready();
        });
    });

    QUnit.test('buildElement', function (assert) {
        const ready = assert.async();
        const loader = new QtiItemLoader();
        const additionalClassesLocation = { testQtiClass: 'taoQtiItem/test/qtiItem/core/loader/testQtiClass' };
        const data = {
            qtiClass: 'testQtiClass',
            serial: 'buildElement',
        };

        loader.setClassesLocation(additionalClassesLocation);

        assert.throws(
            () => loader.buildElement(),
            new Error('wrong elementData format'),
            'throws error in case if element data in wron format'
        );

        assert.throws(
            () => loader.buildElement(data),
            new Error('the qti element class does not exist: testQtiClass'),
            'throws error in case if qti class does not exist'
        );

        loader.loadRequiredClasses({ qtiClass: 'testQtiClass' }, () => {
            const element = loader.buildElement(data);

            assert.equal(
                element.serial,
                'buildElement',
                'loadContainer build qti element'
            );

            ready();
        });
    });

    QUnit.test('loadAndBuildElement', function (assert) {
        const ready = assert.async();
        const loader = new QtiItemLoader();
        const additionalClassesLocation = { testQtiClass: 'taoQtiItem/test/qtiItem/core/loader/testQtiClass' };
        const data = {
            qtiClass: 'testQtiClass',
            serial: 'loadAndBuildElement',
        };

        loader.setClassesLocation(additionalClassesLocation);

        loader.loadAndBuildElement(data, (element) => {
            assert.equal(
                element.serial,
                'loadAndBuildElement',
                'loadAndBuildElement load qti class and build qti element'
            );

            ready();
        });
    });

    QUnit.test('loadTooltipData', function (assert) {
        const loader = new QtiItemLoader();
        const element = new TooltipQtiClass();
        const data = {
            content: 'test',
        };

        loader.loadTooltipData(element, data);

        assert.equal(
            element.content(),
            'test',
            'loadAndBuildElement assign content to element'
        );
    });

    QUnit.test('loadPicData', function (assert) {
        const loader = new QtiItemLoader();
        const element = new InfoControlQtiClass();
        const data = {
            entryPoint: 'testEntryPoint',
            libraries: 'testLibraries',
            markup: 'testMarkup',
            properties: {
                prop: 'test',
                propJson: '{ "foo": "bar" }',
            },
            typeIdentifier: 'testTypeIdentifier',
            xmlns: 'testXmlns',
        };

        loader.loadPicData(element, data);

        assert.deepEqual(
            {
                entryPoint: element.entryPoint,
                libraries: element.libraries,
                markup: element.markup,
                xmlns: element.ns.uri,
                typeIdentifier: element.typeIdentifier,
            },
            {
                entryPoint: 'testEntryPoint',
                libraries: 'testLibraries',
                markup: 'testMarkup',
                xmlns: 'testXmlns',
                typeIdentifier: 'testTypeIdentifier',
            },
            'loadPicData assign data to element'
        );

        assert.deepEqual(
            element.properties,
            {
                prop: 'test',
                propJson: {
                    foo: 'bar',
                }
            },
            'loadPicData map properties'
        );
    });

    QUnit.test('loadPciData', function (assert) {
        const loader = new QtiItemLoader();
        const element = new CustomInteractionQtiClass();
        const data = {
            entryPoint: 'testEntryPoint',
            libraries: 'testLibraries',
            markup: 'testMarkup',
            properties: {
                prop: 'test',
                propJson: '{ "foo": "bar" }',
            },
            typeIdentifier: 'testTypeIdentifier',
            xmlns: 'testXmlns',
        };

        loader.loadPciData(element, data);

        assert.deepEqual(
            {
                entryPoint: element.entryPoint,
                libraries: element.libraries,
                markup: element.markup,
                xmlns: element.ns.uri,
                typeIdentifier: element.typeIdentifier,
            },
            {
                entryPoint: 'testEntryPoint',
                libraries: 'testLibraries',
                markup: 'testMarkup',
                xmlns: 'testXmlns',
                typeIdentifier: 'testTypeIdentifier',
            },
            'loadPciData assign data to element'
        );

        assert.deepEqual(
            element.properties,
            {
                prop: 'test',
                propJson: {
                    foo: 'bar',
                }
            },
            'loadPciData map properties'
        );
    });

    QUnit.test('loadMathData', function (assert) {
        const loader = new QtiItemLoader();
        const element = new MathQtiClass();
        const data = {
            mathML: 'testMathML',
            annotations: {
                foo: 'bar',
            },
        };

        loader.loadMathData(element, data);

        assert.equal(
            element.mathML,
            'testMathML',
            'loadMathData assing loadMathData'
        );

        assert.deepEqual(
            element.annotations,
            {
                foo: 'bar',
            },
            'loadMathData assing annotations'
        );
    });

    QUnit.test('loadChoiceData', function (assert) {
        const loader = new QtiItemLoader();
        const textChoiceElement = new TextVariableChoiceQtiClass();
        const gapTextElement = new GapTextQtiClass();
        const data = {
            text: 'testText',
        };

        loader.loadChoiceData(textChoiceElement, data);
        loader.loadChoiceData(gapTextElement, data);

        assert.equal(
            textChoiceElement.text,
            'testText',
            'loadChoiceData assign value to TextVariableChoice element'
        );

        assert.equal(
            gapTextElement.bdy.bdy,
            'testText',
            'loadChoiceData assign bdy to GapText element'
        );
    });

    QUnit.test('buildInteractionChoices', function (assert) {
        const ready = assert.async();
        const loader = new QtiItemLoader();
        const choiceInteractionElement = new ChoiceInteractionQtiClass();
        const matchInteractionElement = new MatchInteractionQtiClass();
        const graphicGapMatchInteractionElement = new GraphicGapMatchInteractionQtiClass();
        const qtiData = {
            qtiClass: 'simpleChoice',
            gapImg: {
                qtiClass: 'gapImg',
            },
        };
        const choiceInteractionData = {
            choices: {
                choiceInteractionChoice: {
                    qtiClass: 'simpleChoice',
                    serial: 'choiceInteractionChoice',
                },
            },
        };
        const matchInteractionData = {
            choices: [
                {
                    matchInteractionChoice0: {
                        qtiClass: 'simpleChoice',
                        serial: 'matchInteractionChoice0',
                    },
                },
                {
                    matchInteractionChoice1: {
                        qtiClass: 'simpleChoice',
                        serial: 'matchInteractionChoice1',
                    },
                }
            ],
        };
        const graphicGapMatchInteractionData = {
            gapImgs: {
                gapImg: {
                    qtiClass: 'gapImg',
                    serial: 'gapImg',
                }
            },
            choices: {
                graphicGapMatchInteractionChoice: {
                    qtiClass: 'simpleChoice',
                    serial: 'graphicGapMatchInteractionChoice',
                },
            },
        };

        loader.loadRequiredClasses(qtiData, () => {
            loader.buildInteractionChoices(choiceInteractionElement, choiceInteractionData);
            loader.buildInteractionChoices(matchInteractionElement, matchInteractionData);
            loader.buildInteractionChoices(graphicGapMatchInteractionElement, graphicGapMatchInteractionData);

            assert.equal(
                choiceInteractionElement.choices.choiceInteractionChoice.serial,
                'choiceInteractionChoice',
                'buildInteractionChoices assign choices to choiceInteraction'
            );

            assert.equal(
                matchInteractionElement.choices[0].matchInteractionChoice0.serial,
                'matchInteractionChoice0',
                'buildInteractionChoices assign choices to matchInteraction'
            );

            assert.equal(
                matchInteractionElement.choices[1].matchInteractionChoice1.serial,
                'matchInteractionChoice1',
                'buildInteractionChoices assign choices to matchInteraction'
            );

            assert.equal(
                graphicGapMatchInteractionElement.choices.graphicGapMatchInteractionChoice.serial,
                'graphicGapMatchInteractionChoice',
                'buildInteractionChoices assign choices to graphicGapMatchInteraction'
            );

            assert.equal(
                graphicGapMatchInteractionElement.gapImgs.gapImg.serial,
                'gapImg',
                'buildInteractionChoices assign choices to graphicGapMatchInteraction'
            );

            ready();
        });
    });

    QUnit.test('loadInteractionData', function (assert) {
        const loader = new QtiItemLoader();
        const element = new CustomInteractionQtiClass();
        const data = {
            entryPoint: 'testEntryPoint',
            libraries: 'testLibraries',
            markup: 'testMarkup',
            properties: {},
            typeIdentifier: 'testTypeIdentifier',
            xmlns: 'testXmlns',
        };

        loader.loadInteractionData(element, data);

        assert.deepEqual(
            {
                entryPoint: element.entryPoint,
                libraries: element.libraries,
                markup: element.markup,
                xmlns: element.ns.uri,
                typeIdentifier: element.typeIdentifier,
            },
            {
                entryPoint: 'testEntryPoint',
                libraries: 'testLibraries',
                markup: 'testMarkup',
                xmlns: 'testXmlns',
                typeIdentifier: 'testTypeIdentifier',
            },
            'loadInteractionData load data for pci interaction'
        );
    });

    QUnit.test('loadElementData', function (assert) {
        const loader = new QtiItemLoader();
        const element = new CustomInteractionQtiClass();
        const data = {
            attributes: {
                foo: 'bar',
            },
        };

        loader.loadElementData(element, data);

        assert.deepEqual(
            element.attributes,
            {
                foo: 'bar',
            },
            'loadElementData assign attributes'
        );
    });

    QUnit.test('loadElement', function (assert) {
        const ready = assert.async();
        const loader = new QtiItemLoader();
        const choiceInteractionElement = new ChoiceInteractionQtiClass();
        const choiceInteractionData = {
            choices: {
                loadElementChoice: {
                    qtiClass: 'simpleChoice',
                    serial: 'loadElementChoice',
                },
            },
        };

        loader.loadElement(choiceInteractionElement, choiceInteractionData, (element) => {
            assert.equal(
                element.choices.loadElementChoice.serial,
                'loadElementChoice',
                'loadElement load choice interaction data'
            );

            ready();
        });
    });

    QUnit.test('buildOutcome', function (assert) {
        const ready = assert.async();
        const initialClassesLocation = { testQtiClass: 'taoQtiItem/test/qtiItem/core/loader/testQtiClass' };
        const loader = new QtiItemLoader(null, initialClassesLocation);
        const qtiData = {
            qtiClass: 'testQtiClass',
        };
        const data = {
            defaultValue: 'testDefaultValue',
            qtiClass: 'testQtiClass',
            serial: 'buildOutcomeElement',
        };

        loader.loadRequiredClasses(qtiData, () => {
            const outcomeElement = loader.buildOutcome(data);

            assert.equal(
                outcomeElement.defaultValue,
                'testDefaultValue',
                'buildOutcome assign default value'
            );

            ready();
        });
    });

    QUnit.test('buildResponseProcessing', function (assert) {
        const ready = assert.async();
        const initialClassesLocation = { testQtiClass: 'taoQtiItem/test/qtiItem/core/loader/testQtiClass' };
        const loader = new QtiItemLoader(null, initialClassesLocation);
        const qtiData = {
            qtiClass: 'testQtiClass',
        };
        const data = {
            qtiClass: 'testQtiClass',
            serial: 'buildResponseProcessingElement',
        };
        const customData = {
            data: 'testData',
            qtiClass: 'testQtiClass',
            serial: 'customBuildResponseProcessingElement',
        };

        loader.loadRequiredClasses(qtiData, () => {
            const responseProcessing = loader.buildResponseProcessing(data);
            const customResponseProcessing = loader.buildResponseProcessing(customData, true);

            assert.equal(
                responseProcessing.processingType,
                'templateDriven',
                'buildResponseProcessing buld response prcessing'
            );

            assert.equal(
                customResponseProcessing.processingType,
                'custom',
                'buildResponseProcessing buld custom response prcessing'
            );

            assert.equal(
                customResponseProcessing.xml,
                'testData',
                'buildResponseProcessing assign xml to custom response prcessing'
            );

            ready();
        });
    });

    QUnit.test('buildSimpleFeedbackRule', function (assert) {
        const ready = assert.async();
        const initialClassesLocation = {
            _simpleFeedbackRule: 'taoQtiItem/qtiItem/core/response/SimpleFeedbackRule'
        };
        const loader = new QtiItemLoader(null, initialClassesLocation);
        const responseDeclaration = new ResponseDeclarationQtiClass();
        const qtiData = {
            qtiClass: '_simpleFeedbackRule',
        };
        const data = {
            qtiClass: '_simpleFeedbackRule',
            serial: 'buildSimpleFeedbackRule',
            feedbackOutcome: 'testFeedbackOutcome',
            feedbackThen: 'testFeedbackThen',
            feedbackElse: 'testFeedbackElse',
            condition: 'correct',
        };
        loader.item = {
            outcomes: {
                testFeedbackOutcome: 'testFeedbackOutcome',
            },
            modalFeedbacks: {
                testFeedbackThen: {
                    data: () => assert.ok(
                        true,
                        'buildSimpleFeedbackRule set data to feedback then'
                    ),
                },
                testFeedbackElse: {
                    data: () => assert.ok(
                        true,
                        'buildSimpleFeedbackRule set data to feedback else'
                    ),
                },
            },
        };

        loader.loadRequiredClasses(qtiData, () => {
            const element = loader.buildSimpleFeedbackRule(data, responseDeclaration);

            assert.equal(
                element.condition,
                'correct',
                'buildSimpleFeedbackRule assign condition to feedback rule'
            );
            assert.equal(
                element.feedbackOutcome,
                'testFeedbackOutcome',
                'buildSimpleFeedbackRule assign feedback outcome to feedback rule'
            );

            ready();
        });
    });

    QUnit.test('buildResponse', function (assert) {
        const ready = assert.async();
        const initialClassesLocation = { testQtiClass: 'taoQtiItem/test/qtiItem/core/loader/testQtiClass' };
        const loader = new QtiItemLoader(null, initialClassesLocation);
        const qtiData = {
            qtiClass: 'testQtiClass',
        };
        const data = {
            correctResponses: 'testCorrectResponse',
            defaultValue: 'testDefaultValue',
            identifier: 'testIdentifier',
            mapping: { foo: 'bar' },
            mappingAttributes: 'testMappingAttributes',
            qtiClass: 'testQtiClass',
            serial: 'buildResponse',
        };

        loader.loadRequiredClasses(qtiData, () => {
            const element = loader.buildResponse(data);

            assert.equal(
                element.template,
                'no_response_processing',
                'buildResponse assign template to response'
            );

            assert.equal(
                element.defaultValue,
                'testDefaultValue',
                'buildResponse assign default value to response'
            );

            assert.equal(
                element.correctResponse,
                'testCorrectResponse',
                'buildResponse assign correct response to response'
            );

            assert.deepEqual(
                element.mapEntries,
                { foo: 'bar' },
                'buildResponse assign map entries to response'
            );

            assert.equal(
                element.mappingAttributes,
                'testMappingAttributes',
                'buildResponse assign mapping attributes to response'
            );

            ready();
        });
    });

    QUnit.test('loadElements', function (assert) {
        const ready = assert.async();
        const initialClassesLocation = { testQtiClass: 'taoQtiItem/test/qtiItem/core/loader/testQtiClass' };
        const loader = new QtiItemLoader(null, initialClassesLocation);
        const testElement = new TestQtiClass('loadElements');
        const data = {
            testElement: {
                attributes: 'test attributes',
                qtiClass: 'testQtiClass',
                serial: 'loadElements',
            }
        };
        const composingElements = {
            loadElements: testElement,
        };
        loader.item = {
            getComposingElements: () => composingElements,
        };

        loader.loadElements(data, () => {
            assert.equal(
                testElement.attributes,
                'test attributes',
                'loadElements load elements data'
            );

            loader.item = null;

            assert.throws(
                () => loader.loadElements(),
                new Error('QtiLoader : cannot load elements in empty item'),
                'throws error in case if item is not initialized'
            );

            ready();
        });
    });

    QUnit.test('loadItemData', function (assert) {
        const ready = assert.async();
        const loader = new QtiItemLoader();
        const customData = {
            qtiClass: 'customInteraction',
            serial: 'customLoadItemData',
        };
        const data = {
            apipAccessibility: 'testApipAccessibility',
            body: {
                body: 'testBody',
                elements: {},
            },
            feedbacks: {
                testFeedback: {
                    qtiClass: 'modalFeedback',
                    serial: 'loadItemDataTestFeedback',
                },
            },
            namespaces: 'testNamespace',
            outcomes: {
                testOutcome: {
                    identifier: 'testoutcome',
                    qtiClass: 'outcomeDeclaration',
                    serial: 'loadItemDataTestOutcome',
                },
            },
            qtiClass: 'assessmentItem',
            schemaLocations: 'testSchemaLocations',
            serial: 'loadItemData',
            stylesheets: {
                testStyleSheets: {
                    qtiClass: 'stylesheet',
                    serial: 'loadItemDataTestStyleSheet',
                },
            },
            responseProcessing: {
                qtiClass: 'responseProcessing',
                responseRules: [
                    responseRulesHelper.responseRules.MATCH_CORRECT('testresponse', 'testoutcome'),
                ],
                serial: 'loadItemDataResponseProcessing',
            },
            responses: {
                loadItemDataResponse: {
                    identifier: 'testresponse',
                    qtiClass: 'responseDeclaration',
                    serial: 'loadItemDataResponse',
                }
            }
        };

        loader.loadItemData(customData, (emptyItem) => {
            assert.equal(
                emptyItem,
                null,
                'loadItemData does not initialize item in case of wrong qti class'
            );

            loader.loadItemData(data, (item) => {
                assert.equal(
                    item.serial,
                    'loadItemData',
                    'loadItemData load item'
                );

                assert.equal(
                    item.bdy.bdy,
                    'testBody',
                    'loadItemData load container'
                );

                assert.equal(
                    item.outcomes.loadItemDataTestOutcome.serial,
                    'loadItemDataTestOutcome',
                    'loadItemData load outcomes'
                );

                assert.equal(
                    item.modalFeedbacks.loadItemDataTestFeedback.serial,
                    'loadItemDataTestFeedback',
                    'loadItemData load feedbacks'
                );

                assert.equal(
                    item.stylesheets.loadItemDataTestStyleSheet.serial,
                    'loadItemDataTestStyleSheet',
                    'loadItemData load style sheets'
                );

                assert.equal(
                    item.responses.loadItemDataResponse.serial,
                    'loadItemDataResponse',
                    'loadItemData load responses'
                );

                assert.equal(
                    item.responseProcessing.serial,
                    'loadItemDataResponseProcessing',
                    'loadItemData load response processing'
                );

                assert.equal(
                    item.responseProcessing.processingType,
                    'templateDriven',
                    'loadItemData recognize response processing type'
                );

                assert.equal(
                    item.namespaces,
                    'testNamespace',
                    'loadItemData assign namespace'
                );

                assert.equal(
                    item.schemaLocations,
                    'testSchemaLocations',
                    'loadItemData assign schemaLocations'
                );

                assert.equal(
                    item.apipAccessibility,
                    'testApipAccessibility',
                    'loadItemData assign apipAccessibility'
                );

                ready();
            });
        });
    });

    QUnit.test('loadItemData::customResponseProcessing', function (assert) {
        const ready = assert.async();
        const loader = new QtiItemLoader();
        const data = {
            body: {
                body: 'testBody',
                elements: {},
            },
            qtiClass: 'assessmentItem',
            serial: 'loadItemDataCustomResponseProcessing',
            responseProcessing: {
                qtiClass: 'responseProcessing',
                responseRules: [
                    responseRulesHelper.responseRules.MATCH_CORRECT('testresponse', 'testoutcome'),
                    responseRulesHelper.responseRules.MATCH_CORRECT('testresponse1', 'testoutcome1'),
                ],
                serial: 'loadItemDataCustomResponseProcessingResponseProcessing',
            },
            responses: {
                loadItemDataResponse: {
                    identifier: 'testresponse',
                    qtiClass: 'responseDeclaration',
                    serial: 'loadItemDataCustomResponseProcessingResponse',
                }
            }
        };

        loader.loadItemData(data, (item) => {
            assert.equal(
                item.responseProcessing.processingType,
                'custom',
                'loadItemData recognize response processing type'
            );

            ready();
        });
    });
});
