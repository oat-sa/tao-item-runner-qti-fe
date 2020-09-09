/**
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
 * Copyright (c) 2020 (original work) Open Assessment Technologies SA;
 */
define([
    'taoQtiItem/qtiItem/helper/responseRules',
], function (responseRulesHelper) {
    'use strict';

    const responseIdentifier = 'testResponseIdentifier';
    const outcomeIdentifier = 'testOutcomeIdentifier';

    const responseRules = {
        MATCH_CORRECT: {
            qtiClass: 'responseCondition',
            responseIf: {
                qtiClass: 'responseIf',
                expression: {
                    qtiClass: 'match',
                    expressions: [
                        {
                            qtiClass: 'variable',
                            attributes: {
                                identifier: responseIdentifier,
                            },
                        },
                        {
                            qtiClass: 'correct',
                            attributes: {
                                identifier: responseIdentifier,
                            },
                        },
                    ],
                },
                responseRules: [
                    {
                        qtiClass: 'setOutcomeValue',
                        attributes: {
                            identifier: outcomeIdentifier,
                        },
                        expression: {
                            qtiClass: 'sum',
                            expressions: [
                                {
                                    qtiClass: 'variable',
                                    attributes: {
                                        identifier: outcomeIdentifier,
                                    },
                                },
                                {
                                    qtiClass: 'baseValue',
                                    attributes: {
                                        baseType: 'integer'
                                    },
                                    value: '1',
                                },
                            ],
                        },
                    },
                ],
            },
        },
        MAP_RESPONSE: {
            qtiClass: 'responseCondition',
            responseIf: {
                qtiClass: 'responseIf',
                expression: {
                    qtiClass: 'not',
                    expressions: [
                        {
                            qtiClass: 'isNull',
                            expressions: [{
                                qtiClass: 'variable',
                                attributes: {
                                    identifier: responseIdentifier,
                                },
                            }],
                        },
                    ],
                },
                responseRules: [
                    {
                        qtiClass: 'setOutcomeValue',
                        attributes: {
                            identifier: outcomeIdentifier,
                        },
                        expression: {
                            qtiClass: 'sum',
                            expressions: [
                                {
                                    qtiClass: 'variable',
                                    attributes: {
                                        identifier: outcomeIdentifier,
                                    }
                                },
                                {
                                    qtiClass: 'mapResponse',
                                    attributes: {
                                        identifier: responseIdentifier,
                                    },
                                },
                            ],
                        },
                    },
                ],
            },
        },
        MAP_RESPONSE_POINT: {
            qtiClass: 'responseCondition',
            responseIf: {
                qtiClass: 'responseIf',
                expression: {
                    qtiClass: 'not',
                    expressions: [
                        {
                            qtiClass: 'isNull',
                            expressions: [{
                                qtiClass: 'variable',
                                attributes: {
                                    identifier: responseIdentifier,
                                },
                            }],
                        },
                    ],
                },
                responseRules: [
                    {
                        qtiClass: 'setOutcomeValue',
                        attributes: {
                            identifier: outcomeIdentifier,
                        },
                        expression: {
                            qtiClass: 'sum',
                            expressions: [
                                {
                                    qtiClass: 'variable',
                                    attributes: {
                                        identifier: outcomeIdentifier,
                                    }
                                },
                                {
                                    qtiClass: 'mapResponsePoint',
                                    attributes: {
                                        identifier: responseIdentifier,
                                    },
                                },
                            ],
                        },
                    },
                ],
            },
        },
    };

    QUnit.test('MATCH_CORRECT', function (assert) {
        const actual = responseRulesHelper.responseRules.MATCH_CORRECT(responseIdentifier, outcomeIdentifier);

        assert.deepEqual(
            actual,
            responseRules.MATCH_CORRECT,
            'build MATCH_CORRECT response rule'
        );
    });

    QUnit.test('MAP_RESPONSE', function (assert) {
        const actual = responseRulesHelper.responseRules.MAP_RESPONSE(responseIdentifier, outcomeIdentifier);

        assert.deepEqual(
            actual,
            responseRules.MAP_RESPONSE,
            'build MAP_RESPONSE response rule'
        );
    });

    QUnit.test('MAP_RESPONSE_POINT', function (assert) {
        const actual = responseRulesHelper.responseRules.MAP_RESPONSE_POINT(responseIdentifier, outcomeIdentifier);

        assert.deepEqual(
            actual,
            responseRules.MAP_RESPONSE_POINT,
            'build MAP_RESPONSE_POINT response rule'
        );
    });
});
