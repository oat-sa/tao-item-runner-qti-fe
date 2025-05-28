define(['taoQtiItem/qtiCommonRenderer/helpers/userAgent'], function (userAgentHelper) {
    'use strict';

    const agents = {
        safari18Mac:
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 14_7_4) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.3 Safari/605.1.15',
        safari18IPad:
            'Mozilla/5.0 (iPad; CPU OS 17_7_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.3 Mobile/15E148 Safari/604.1',
        chrome133Windows:
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36',
        firefox135Windows: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:135.0) Gecko/20100101 Firefox/135.0'
    };

    const mockAgent = val => {
        Object.defineProperty(window.navigator, 'userAgent', { configurable: true, get: () => val });
    };

    QUnit.module('taoQtiItem/qtiCommonRenderer/helpers/userAgent');

    QUnit.test('isSafari', function (assert) {
        const isSafari = userAgentHelper.isSafari;

        mockAgent(agents.safari18Mac);
        assert.true(isSafari());

        mockAgent(agents.safari18IPad);
        assert.true(isSafari());

        mockAgent(agents.chrome133Windows);
        assert.false(isSafari());

        mockAgent(agents.firefox135Windows);
        assert.false(isSafari());
    });
});
