define(['jquery', 'taoQtiItem/reviewRenderer/helpers/pci'], function ($, pci) {
    'use strict';

    QUnit.test('isInteractionDisabled', function (assert) {
        const isInteractionDisabledForTextReader = pci.isInteractionDisabled('textReaderInteraction');
        const isInteractionDisabledForAudioPci = pci.isInteractionDisabled('audioRecordingInteraction');

        assert.ok(isInteractionDisabledForTextReader === false, 'interaction in text Reader PCI is allowed');
        assert.ok(isInteractionDisabledForAudioPci === true, 'interaction in Audio recording PCI is not allowed');
    });
});
