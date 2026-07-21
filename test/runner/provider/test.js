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
 * Copyright (c) 2014 (original work) Open Assessment Technlogies SA (under the project TAO-PRODUCT);
 *
 */

/**
 * @author Bertrand Chevrier <bertrand@taotesting.com>
 */
define([
    'jquery',
    'lodash',
    'taoItems/runner/api/itemRunner',
    'taoQtiItem/runner/provider/qti',
    'taoQtiItem/runner/provider/manager/userModules',
    'taoQtiItem/qtiItem/core/Element',
    'taoQtiItem/qtiItem/core/Loader',
    'taoQtiItem/qtiItem/helper/modalFeedback',
    'json!taoQtiItem/test/samples/json/space-shuttle.json'
], function ($, _, itemRunner, qtiRuntimeProvider, userModules, Element, QtiLoader, modalFeedbackHelper, itemData) {
    'use strict';

    var runner;
    var containerId = 'item-container';

    function createProvider(overrides) {
        return _.assign(
            Object.create(qtiRuntimeProvider),
            {
                assetManager: {},
                options: {
                    view: 'default'
                },
                trigger: function () {}
            },
            overrides
        );
    }

    function mockUserAgent(userAgent) {
        var hasOwnUserAgent = Object.prototype.hasOwnProperty.call(window.navigator, 'userAgent');
        var originalOwnDescriptor = hasOwnUserAgent
            ? Object.getOwnPropertyDescriptor(window.navigator, 'userAgent')
            : null;

        Object.defineProperty(window.navigator, 'userAgent', {
            configurable: true,
            get: function () {
                return userAgent;
            }
        });

        return function restoreUserAgent() {
            if (originalOwnDescriptor) {
                Object.defineProperty(window.navigator, 'userAgent', originalOwnDescriptor);
            } else {
                delete window.navigator.userAgent;
            }
        };
    }

    QUnit.module('Provider API');

    QUnit.test('module', function (assert) {
        assert.ok(typeof qtiRuntimeProvider !== 'undefined', 'The module exports something');
        assert.ok(typeof qtiRuntimeProvider === 'object', 'The module exports an object');
        assert.ok(
            typeof qtiRuntimeProvider.init === 'function' || typeof qtiRuntimeProvider.render === 'function',
            'The provider expose an init or a render method'
        );
    });

    QUnit.module('Register the provider', {
        afterEach: function (assert) {
            itemRunner.providers = null;
        }
    });

    QUnit.test('register the qti provider', function (assert) {
        assert.expect(4);

        assert.ok(typeof itemRunner.providers === 'undefined', 'the runner has no providers');

        itemRunner.register('qti', qtiRuntimeProvider);

        assert.ok(typeof itemRunner.providers === 'object', 'the runner has now providers');
        assert.ok(typeof itemRunner.providers.qti === 'object', 'the runner has now the qti providers');
        assert.equal(itemRunner.providers.qti, qtiRuntimeProvider, 'the runner has now the qti providers');
    });

    QUnit.module('Provider init', {
        afterEach: function (assert) {
            itemRunner.providers = null;
        }
    });

    QUnit.test('Item data loading', function (assert) {
        var ready = assert.async();
        assert.expect(2);

        itemRunner.register('qti', qtiRuntimeProvider);

        itemRunner('qti', itemData)
            .on('init', function () {
                assert.ok(typeof this._item === 'object', 'The item data is loaded and mapped to an object');
                assert.ok(typeof this._item.bdy === 'object', 'The item contains a body object');

                ready();
            })
            .init();
    });

    QUnit.test('Loading wrong data', function (assert) {
        var ready = assert.async();
        assert.expect(2);

        itemRunner.register('qti', qtiRuntimeProvider);

        itemRunner('qti', { foo: true })
            .on('error', function (message) {
                assert.ok(true, 'The provider triggers an error event');
                assert.ok(typeof message === 'string', 'The error is a string');

                ready();
            })
            .init();
    });

    QUnit.module('Provider render', {
        afterEach: function (assert) {
            //Reset the provides
            runner.clear();
            itemRunner.providers = null;
        }
    });

    QUnit.test('Item rendering', function (assert) {
        var ready = assert.async();
        var container = document.getElementById(containerId);

        assert.expect(3);

        assert.ok(container instanceof HTMLElement, 'the item container exists');
        assert.equal(container.children.length, 0, 'the container has no children');

        itemRunner.register('qti', qtiRuntimeProvider);

        runner = itemRunner('qti', itemData)
            .on('render', function () {
                assert.equal(container.children.length, 1, 'the container has children');

                ready();
            })
            .init()
            .render(container);
    });

    QUnit.test('Issue in rendering', function (assert) {
        var ready = assert.async();
        var count = 0;
        var container = document.getElementById(containerId);

        assert.expect(4);

        itemRunner.register('qti', qtiRuntimeProvider);

        runner = itemRunner('qti', itemData)
            .on('init', function () {
                this._item.renderer = null;
                this.render(container);
            })
            .on('error', function (message) {
                assert.ok(true, 'The provider triggers an error event');
                assert.ok(typeof message === 'string', 'The error is a string');
                if (count > 0) {
                    ready();
                }
                count++;
            })
            .init();
    });

    QUnit.module('Provider clear', {
        afterEach: function (assert) {
            itemRunner.providers = null;
        }
    });

    QUnit.test('Clear a rendered item', function (assert) {
        var ready = assert.async();
        var container = document.getElementById(containerId);

        assert.expect(6);

        assert.ok(container instanceof HTMLElement, 'the item container exists');
        assert.equal(container.children.length, 0, 'the container has no children');

        itemRunner.register('qti', qtiRuntimeProvider);

        itemRunner('qti', itemData)
            .on('render', function () {
                assert.equal(typeof this._item, 'object', 'the item instance is attached to the runner');
                assert.equal(container.children.length, 1, 'the container has children');

                this.clear();
            })
            .on('clear', function () {
                assert.equal(container.children.length, 0, 'the container children are removed');
                assert.equal(this._item, null, 'the item instance is also cleared');

                ready();
            })
            .init()
            .render(container);
    });

    QUnit.test('Clear a rendered item asynchronosuly', function (assert) {
        var ready = assert.async();
        var container = document.getElementById(containerId);

        assert.expect(6);

        assert.ok(container instanceof HTMLElement, 'the item container exists');
        assert.equal(container.children.length, 0, 'the container has no children');

        itemRunner.register('qti', qtiRuntimeProvider);

        itemRunner('qti', itemData)
            .on('render', function () {
                assert.equal(typeof this._item, 'object', 'the item instance is attached to the runner');
                assert.equal(container.children.length, 1, 'the container has children');

                // Mock the getInteractions() method to return interaction with async clear step
                this._item.getInteractions = function () {
                    return [
                        {
                            clear: function () {
                                return new Promise(function (resolve) {
                                    setTimeout(resolve, 10);
                                });
                            }
                        }
                    ];
                };

                this.clear();
            })
            .on('clear', function () {
                assert.equal(container.children.length, 0, 'the container children are removed');
                assert.equal(this._item, null, 'the item instance is also cleared');

                ready();
            })
            .init()
            .render(container);
    });

    QUnit.test('Item rendering: writing-mode-vertical-rl', function (assert) {
        var ready = assert.async();
        var container = document.getElementById(containerId);

        const itemDataVertical = _.cloneDeep(itemData);
        itemDataVertical.attributes.class = 'writing-mode-vertical-rl';

        assert.expect(2);
        itemRunner.register('qti', qtiRuntimeProvider);

        runner = itemRunner('qti', itemDataVertical)
            .on('render', function () {
                assert.true(document.body.classList.contains('item-writing-mode-vertical-rl'), 'writing-mode class added to body');
                this.clear();
            })
            .on('clear', function () {
                assert.false(document.body.classList.contains('item-writing-mode-vertical-rl'), 'writing-mode class removed from body');
                ready();
            })
            .init()
            .render(container);
    });

    QUnit.module('Provider state', {
        afterEach: function (assert) {
            //Reset the provides
            runner.clear();
            itemRunner.providers = null;
        }
    });

    QUnit.test('default state structure', function (assert) {
        var ready = assert.async();
        var container = document.getElementById(containerId);

        assert.expect(4);

        assert.ok(container instanceof HTMLElement, 'the item container exists');

        itemRunner.register('qti', qtiRuntimeProvider);

        runner = itemRunner('qti', itemData)
            .on('render', function () {
                var state = this.getState();

                assert.ok(typeof state === 'object', 'the state is an object');
                assert.ok(typeof state.RESPONSE === 'object', 'the state contains the interaction response identifier');
                assert.ok(typeof state.RESPONSE.response === 'object', 'the state contains the interaction response');

                ready();
            })
            .init()
            .render(container);
    });

    QUnit.test('get state after changes', function (assert) {
        var ready = assert.async();
        var container = document.getElementById(containerId);

        assert.expect(12);

        assert.ok(container instanceof HTMLElement, 'the item container exists');

        itemRunner.register('qti', qtiRuntimeProvider);

        runner = itemRunner('qti', itemData)
            .on('error', function (e) {
                assert.ok(false, 'Unexpected error : ' + e.message);
            })
            .on('render', function () {
                //Default state
                var state = this.getState();

                assert.ok(typeof state === 'object', 'the state is an object');
                assert.ok(typeof state.RESPONSE === 'object', 'the state contains the interaction response identifier');
                assert.equal(state.RESPONSE.response.base, null, 'the default state contains a null base');

                //Change something
                $('[data-identifier="Discovery"]', $(container)).click();

                state = this.getState();

                assert.ok(typeof state === 'object', 'the state is an object');
                assert.ok(typeof state.RESPONSE === 'object', 'the state contains the interaction response identifier');
                assert.ok(typeof state.RESPONSE.response.base === 'object', 'the contains a base object');
                assert.equal(state.RESPONSE.response.base.identifier, 'Discovery', 'the contains the selected choice');

                //Change something else
                $('[data-identifier="Atlantis"]', $(container)).click();

                state = this.getState();

                assert.ok(typeof state === 'object', 'the state is an object');
                assert.ok(typeof state.RESPONSE === 'object', 'the state contains the interaction response identifier');
                assert.ok(typeof state.RESPONSE.response.base === 'object', 'the contains a base object');
                assert.equal(state.RESPONSE.response.base.identifier, 'Atlantis', 'the contains the selected choice');

                ready();
            })
            .init()
            .render(container);
    });

    QUnit.test('set state', function (assert) {
        var ready = assert.async();
        var container = document.getElementById(containerId);

        assert.expect(3);

        assert.ok(container instanceof HTMLElement, 'the item container exists');

        itemRunner.register('qti', qtiRuntimeProvider);

        runner = itemRunner('qti', itemData)
            .on('render', function () {
                assert.ok(
                    !$('[data-identifier="Atlantis"] input', $(container)).prop('checked'),
                    'The choice is not checked'
                );

                this.setState({ RESPONSE: { response: { base: { identifier: 'Atlantis' } } } });

                assert.ok(
                    $('[data-identifier="Atlantis"] input', $(container)).prop('checked'),
                    'The choice is checked'
                );

                ready();
            })
            .init()
            .render(container);
    });

    QUnit.test('set multiple  states', function (assert) {
        var ready = assert.async();
        var container = document.getElementById(containerId);

        assert.expect(8);

        assert.ok(container instanceof HTMLElement, 'the item container exists');

        itemRunner.register('qti', qtiRuntimeProvider);

        runner = itemRunner('qti', itemData)
            .on('render', function () {
                assert.ok(
                    !$('[data-identifier="Atlantis"] input', $(container)).prop('checked'),
                    'The choice is not checked'
                );

                this.setState({ RESPONSE: { response: { base: { identifier: 'Atlantis' } } } });

                assert.ok(
                    $('[data-identifier="Atlantis"] input', $(container)).prop('checked'),
                    'The choice is checked'
                );

                //Change something
                $('[data-identifier="Discovery"]', $(container)).click();

                assert.ok(
                    !$('[data-identifier="Atlantis"] input', $(container)).prop('checked'),
                    'The choice is not checked'
                );
                assert.ok(
                    $('[data-identifier="Discovery"] input', $(container)).prop('checked'),
                    'The choice is checked'
                );

                this.setState({ RESPONSE: { response: { base: { identifier: 'Challenger' } } } });

                assert.ok(
                    !$('[data-identifier="Atlantis"] input', $(container)).prop('checked'),
                    'The choice is not checked'
                );
                assert.ok(
                    !$('[data-identifier="Discovery"] input', $(container)).prop('checked'),
                    'The choice is not checked'
                );
                assert.ok(
                    $('[data-identifier="Challenger"] input', $(container)).prop('checked'),
                    'The choice is checked'
                );

                ready();
            })
            .init()
            .render(container);
    });

    QUnit.test('listen state changes', function (assert) {
        var ready = assert.async();
        var container = document.getElementById(containerId);

        assert.expect(10);

        assert.ok(container instanceof HTMLElement, 'the item container exists');

        itemRunner.register('qti', qtiRuntimeProvider);

        runner = itemRunner('qti', itemData)
            .on('statechange', function (state) {
                assert.ok(
                    $('[data-identifier="Atlantis"] input', $(container)).prop('checked'),
                    'The choice is checked'
                );

                assert.ok(typeof state === 'object', 'the state is an object');
                assert.ok(typeof state.RESPONSE === 'object', 'the state contains the interaction response identifier');
                assert.ok(typeof state.RESPONSE.response.base === 'object', 'the contains a base object');
                assert.equal(state.RESPONSE.response.base.identifier, 'Atlantis', 'the contains the selected choice');

                ready();
            })
            .on('render', function () {
                var state = this.getState();

                assert.ok(typeof state === 'object', 'the state is an object');
                assert.ok(typeof state.RESPONSE === 'object', 'the state contains the interaction response identifier');
                assert.equal(state.RESPONSE.response.base, null, 'the default state contains a null base');

                assert.ok(
                    !$('[data-identifier="Atlantis"] input', $(container)).prop('checked'),
                    'The choice is not checked'
                );

                $('[data-identifier="Atlantis"]', $(container)).click();
            })
            .init()
            .render(container);
    });

    QUnit.module('Provider responses', {
        afterEach: function (assert) {
            runner.clear();
            itemRunner.providers = null;
        }
    });

    QUnit.test('no responses set', function (assert) {
        var ready = assert.async();
        var container = document.getElementById(containerId);

        assert.expect(4);

        assert.ok(container instanceof HTMLElement, 'the item container exists');

        itemRunner.register('qti', qtiRuntimeProvider);

        runner = itemRunner('qti', itemData)
            .on('render', function () {
                var responses = this.getResponses();

                assert.ok(typeof responses === 'object', 'the response is an object');
                assert.ok(
                    typeof responses.RESPONSE === 'object',
                    'the response contains the interaction response identifier'
                );
                assert.equal(responses.RESPONSE.base, null, 'the response contains a null base property');

                ready();
            })
            .init()
            .render(container);
    });

    QUnit.test('get responses after changes', function (assert) {
        var ready = assert.async();
        var container = document.getElementById(containerId);

        assert.expect(7);

        assert.ok(container instanceof HTMLElement, 'the item container exists');

        itemRunner.register('qti', qtiRuntimeProvider);

        runner = itemRunner('qti', itemData)
            .on('render', function () {
                var responses = this.getResponses();

                assert.ok(typeof responses === 'object', 'the response is an object');
                assert.ok(
                    typeof responses.RESPONSE === 'object',
                    'the response contains the interaction response identifier'
                );
                assert.equal(responses.RESPONSE.base, null, 'the response contains a null base property');

                //The user set response
                $('[data-identifier="Atlantis"]', $(container)).click();

                responses = this.getResponses();

                assert.ok(typeof responses === 'object', 'the response is an object');
                assert.ok(
                    typeof responses.RESPONSE === 'object',
                    'the response contains the interaction response identifier'
                );
                assert.equal(responses.RESPONSE.base.identifier, 'Atlantis', 'the response contains the set value');

                ready();
            })
            .init()
            .render(container);
    });

    QUnit.module('Provider PIC', {
        afterEach: function (assert) {
            if (runner) {
                runner.clear();
                runner = null;
            }
            itemRunner.providers = null;
        }
    });

    QUnit.test('render configures separators, browser flags and portable element providers', function (assert) {
        var ready = assert.async();
        var container = document.getElementById(containerId);
        assert.timeout(5000);
        var triggerCalls = [];
        var themeChanges = [];
        var observedBodies = [];
        var itemCleared = false;
        var rendererUnloaded = false;
        var restoreUserAgent = mockUserAgent('Mozilla/5.0 (Macintosh) Safari/605.1.15');
        var originalUserModulesLoad = userModules.load;
        var originalResizeObserver = window.ResizeObserver;

        function restore() {
            restoreUserAgent();
            userModules.load = originalUserModulesLoad;
            window.ResizeObserver = originalResizeObserver;
        }

        userModules.load = function () {
            return Promise.resolve();
        };
        window.ResizeObserver = function () {
            this.observe = function (element) {
                observedBodies.push(element);
            };
            this.disconnect = function () {
                observedBodies.push('disconnect');
            };
        };

        var provider = createProvider({
            _renderer: {
                getThemeLoader: function () {
                    return {
                        change: function (themeName) {
                            themeChanges.push(themeName);
                        }
                    };
                },
                unload: function () {
                    rendererUnloaded = true;
                }
            },
            getState: function () {
                return { mockState: true };
            },
            getResponses: function () {
                return { mockResponse: true };
            },
            trigger: function (name, payload) {
                triggerCalls.push({ name: name, payload: payload });
            }
        });

        provider._item = {
            bdy: {
                attr: function (name) {
                    return name === 'dir' ? 'rtl' : undefined;
                }
            },
            render: function () {
                return (
                    '<div class="qti-item" lang="en">' +
                    '<div class="qti-itemBody separator-between-columns writing-mode-vertical-rl">' +
                    '<div class="grid-row">' +
                    '<div class="col-6"></div>' +
                    '<div class="col-6"></div>' +
                    '</div>' +
                    '</div>' +
                    '</div>'
                );
            },
            postRender: function () {
                var row = container.querySelector('.grid-row');
                var columns = row.children;

                row.getBoundingClientRect = function () {
                    return {
                        left: 0,
                        right: 300,
                        top: 0
                    };
                };
                columns[0].getBoundingClientRect = function () {
                    return {
                        left: 0,
                        right: 100,
                        top: 0
                    };
                };
                columns[1].getBoundingClientRect = function () {
                    return {
                        left: 0,
                        right: 100,
                        top: 100
                    };
                };

                return [];
            },
            getInteractions: function () {
                return [];
            },
            getElements: function () {
                return [];
            },
            getComposingElements: function () {
                return {};
            },
            clear: function () {
                itemCleared = true;
            }
        };

        provider.render(
            container,
            function () {
                try {
                    var itemBody = container.querySelector('.qti-itemBody');
                    var row = container.querySelector('.grid-row');
                    var columns = row.children;

                    assert.equal(itemBody.getAttribute('dir'), 'rtl', 'body direction comes from the item body');
                    assert.equal(
                        itemBody.getAttribute('data-useragent-browser'),
                        'safari',
                        'Safari flag is added to the item body'
                    );
                    assert.ok(
                        document.body.classList.contains('item-writing-mode-vertical-rl'),
                        'vertical writing mode is reflected on the document body'
                    );
                    assert.equal(
                        columns[1].style.getPropertyValue('--separator-row-offset-start'),
                        '0px',
                        'separator start offset is set from the column position'
                    );
                    assert.equal(
                        columns[1].style.getPropertyValue('--separator-row-offset-end'),
                        '200px',
                        'separator end offset is set from the column position'
                    );
                    assert.ok(
                        row.classList.contains('separator-between-columns-stacked'),
                        'stacked separator class is applied when columns wrap'
                    );
                    assert.equal(observedBodies.length, 1, 'separator layout starts observing matching item bodies');

                    $(container).trigger('responseChange');
                    $(container).trigger('endattempt', 'RESPONSE_1');
                    $(container).trigger('themechange', 'contrast');

                    assert.deepEqual(
                        _.map(triggerCalls, 'name'),
                        ['listpic', 'statechange', 'responsechange', 'endattempt'],
                        'rendered item emits PIC listing and forwards response events'
                    );
                    assert.deepEqual(themeChanges, ['contrast'], 'theme changes are forwarded to the renderer');

                    provider.clear(container, function () {
                        try {
                            assert.ok(itemCleared, 'item clear hook is called');
                            assert.ok(rendererUnloaded, 'renderer unload hook is called');
                            assert.ok(observedBodies.includes('disconnect'), 'separator layout observer is disconnected');
                            assert.ok(
                                !document.body.classList.contains('item-writing-mode-vertical-rl'),
                                'vertical writing mode class is removed on clear'
                            );
                            assert.equal(provider._item, null, 'provider item reference is cleared');
                        } catch (error) {
                            assert.ok(false, error.message);
                        }

                        restore();
                        ready();
                    });
                } catch (error) {
                    restore();
                    assert.ok(false, error.message);
                    ready();
                }
            }
        );
    });

    QUnit.test('render derives direction from language and keeps explicit direction', function (assert) {
        var ready = assert.async();
        var container = document.getElementById(containerId);
        assert.timeout(5000);
        var originalUserModulesLoad = userModules.load;

        function createItem(markup) {
            return {
                bdy: {
                    attr: function () {
                        return undefined;
                    }
                },
                render: function () {
                    return markup;
                },
                postRender: function () {
                    return [];
                },
                getInteractions: function () {
                    return [];
                },
                getElements: function () {
                    return [];
                },
                getComposingElements: function () {
                    return {};
                },
                clear: function () {}
            };
        }

        userModules.load = function () {
            return Promise.resolve();
        };

        var provider = createProvider({
            _item: createItem('<div class="qti-item" lang="en"><div class="qti-itemBody"></div></div>')
        });

        provider.render(container, function () {
            assert.equal(
                container.querySelector('.qti-itemBody').getAttribute('dir'),
                'ltr',
                'body direction falls back to the item language when none is provided'
            );

            provider.clear(container, function () {
                provider._item = createItem('<div class="qti-item" lang="en"><div class="qti-itemBody" dir="rtl"></div></div>');

                provider.render(container, function () {
                    assert.equal(
                        container.querySelector('.qti-itemBody').getAttribute('dir'),
                        'rtl',
                        'body direction is preserved when the item already sets it'
                    );

                    provider.clear(container, function () {
                        userModules.load = originalUserModulesLoad;
                        ready();
                    });
                });
            });
        });
    });

    QUnit.module('Provider helper methods');

    QUnit.test('getState and setState include PIC info controls', function (assert) {
        var interactionState;
        var picState;
        var originalIsA = Element.isA;
        var interaction = {
            attr: function (name) {
                return name === 'responseIdentifier' ? 'RESPONSE' : undefined;
            },
            getState: function () {
                return { response: { base: null } };
            },
            setState: function (state) {
                interactionState = state;
            }
        };
        var infoControl = {
            attr: function (name) {
                return name === 'id' ? 'PIC_1' : undefined;
            },
            getState: function () {
                return { open: true };
            },
            setState: function (state) {
                picState = state;
            }
        };
        var nonInfoControl = {
            attr: function () {
                return 'IGNORED';
            },
            setState: function () {
                assert.ok(false, 'non info-control elements should not receive PIC state');
            }
        };
        var provider = createProvider({
            _item: {
                getInteractions: function () {
                    return [interaction];
                },
                getElements: function () {
                    return [infoControl, nonInfoControl];
                }
            }
        });

        Element.isA = function (element, qtiClass) {
            return qtiClass === 'infoControl' && element === infoControl;
        };

        assert.deepEqual(
            provider.getState(),
            {
                RESPONSE: { response: { base: null } },
                pic: {
                    PIC_1: { open: true }
                }
            },
            'state contains both interaction and PIC state'
        );

        provider.setState({
            RESPONSE: { response: { base: { identifier: 'Atlantis' } } },
            pic: {
                PIC_1: { open: false }
            }
        });

        assert.deepEqual(
            interactionState,
            { response: { base: { identifier: 'Atlantis' } } },
            'interaction state is restored from the saved state'
        );
        assert.deepEqual(picState, { open: false }, 'PIC state is restored for matching info controls');

        Element.isA = originalIsA;
    });

    QUnit.test('renderFeedbacks loads feedbacks with the current renderer', function (assert) {
        var ready = assert.async();
        assert.timeout(5000);
        var feedbacks = [{ identifier: 'feedback-1' }];
        var itemSession = { FEEDBACK: true };
        var renderingQueue = [{ feedback: 'render-me' }];
        var originalLoadElements = QtiLoader.prototype.loadElements;
        var originalGetFeedbacks = modalFeedbackHelper.getFeedbacks;
        var provider = createProvider({
            _item: {
                getRenderer: function () {
                    return {
                        load: function (callback, loadedClasses) {
                            assert.deepEqual(loadedClasses, ['modalFeedback'], 'loader classes are forwarded to the renderer');
                            callback();
                        }
                    };
                }
            }
        });

        QtiLoader.prototype.loadElements = function (receivedFeedbacks, callback) {
            assert.strictEqual(receivedFeedbacks, feedbacks, 'feedback definitions are passed to the loader');
            callback.call(
                {
                    getLoadedClasses: function () {
                        return ['modalFeedback'];
                    }
                },
                { loadedFeedbacks: true }
            );
        };
        modalFeedbackHelper.getFeedbacks = function (item, receivedSession) {
            assert.deepEqual(item, { loadedFeedbacks: true }, 'loaded feedback item is forwarded to the helper');
            assert.strictEqual(receivedSession, itemSession, 'item session is forwarded to the helper');
            return renderingQueue;
        };

        provider.renderFeedbacks(feedbacks, itemSession, function (queue) {
            assert.strictEqual(queue, renderingQueue, 'renderFeedbacks returns the queue produced by the helper');

            QtiLoader.prototype.loadElements = originalLoadElements;
            modalFeedbackHelper.getFeedbacks = originalGetFeedbacks;
            ready();
        });
    });
});
