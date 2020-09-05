export const responseRules = {
    MATCH_CORRECT: (responseIdentifier, outcomeIdentifier) => ({
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
    }),
    MAP_RESPONSE: (responseIdentifier, outcomeIdentifier) => ({
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
    }),
    MAP_RESPONSE_POINT: (responseIdentifier, outcomeIdentifier) => ({
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
    }),
};
