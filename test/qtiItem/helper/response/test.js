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
 * Copyright (c) 2017 (original work) Open Assessment Technologies SA;
 */
define([
    'taoQtiItem/qtiItem/helper/response',
], function (responseHelper) {
    'use strict';

    const responseIdentifier = 'testResponseIdentifier';
    const outcomeIdentifier = 'testOutcomeIdentifier';

    const responseRule = {
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
    };

    QUnit.test('isUsingTemplate', function (assert) {
        assert.equal(
            responseHelper.isUsingTemplate(),
            false,
            'return false if not template passed'
        );

        assert.equal(
            responseHelper.isUsingTemplate(
                {
                    template: 'MATCH_CORRECT',
                },
                'MATCH_CORRECT'
            ),
            true,
            'check template name'
        );

        assert.equal(
            responseHelper.isUsingTemplate(
                {
                    template: 'http://www.imsglobal.org/question/qti_v2p1/rptemplates/match_correct',
                },
                'MATCH_CORRECT'
            ),
            true,
            'check template url'
        );
    });

    QUnit.test('isValidTemplateName', function (assert) {
        assert.equal(
            responseHelper.isValidTemplateName('wrong'),
            false,
            'return false if can not recognize template'
        );

        assert.equal(
            responseHelper.isValidTemplateName('MATCH_CORRECT'),
            true,
            'return true for known template'
        );
    });

    QUnit.test('getTemplateUriFromName', function (assert) {
        assert.equal(
            responseHelper.getTemplateUriFromName('wrong'),
            '',
            'return empty string if can not recognize template'
        );

        assert.equal(
            responseHelper.getTemplateUriFromName('MATCH_CORRECT'),
            'http://www.imsglobal.org/question/qti_v2p1/rptemplates/match_correct',
            'return template url for known template'
        );
    });

    QUnit.test('getTemplateNameFromUri', function (assert) {
        assert.equal(
            responseHelper.getTemplateNameFromUri('wrong'),
            '',
            'return empty string if can not recognize template'
        );

        assert.equal(
            responseHelper.getTemplateNameFromUri('http://www.imsglobal.org/question/qti_v2p1/rptemplates/match_correct'),
            'MATCH_CORRECT',
            'return template url for known template'
        );
    });

    QUnit.test('getTemplateNameFromResponseRules', function (assert) {
        assert.ok(
            typeof responseHelper.getTemplateNameFromResponseRules({}, {}) === 'undefined',
            'return undefined if can not recognize template'
        );

        assert.ok(
            responseHelper.getTemplateNameFromResponseRules(responseIdentifier, responseRule),
            'return template name for known template'
        );
    });
});
