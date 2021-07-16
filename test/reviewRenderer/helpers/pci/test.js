define(['jquery', 'taoQtiItem/reviewRenderer/helpers/pci'], function ($, pci) {
    'use strict';

    QUnit.test('isInteractionDisabled', function (assert) {
        const isInteractionDisabledForTextReader = pci.isInteractionDisabledForPci('textReaderInteraction');
        const isInteractionDisabledForMathPci = pci.isInteractionDisabledForPci('mathEntryInteraction');

        assert.ok(isInteractionDisabledForTextReader === false, 'interaction in text Reader PCI is allowed');
        assert.ok(isInteractionDisabledForMathPci === true, 'interaction in Math entry PCI is not allowed');
    });
});
