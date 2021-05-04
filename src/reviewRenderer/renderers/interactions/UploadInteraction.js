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
 * Copyright (c) 2020 (original work) Open Assessment Technologies SA (under the project TAO-PRODUCT);
 *
 */

/**
 * @author Ansul Sharma <ansultaotesting.com>
 */
import template from 'taoQtiItem/reviewRenderer/tpl/interactions/uploadInteraction';
import uploadInteraction from 'taoQtiItem/qtiCommonRenderer/renderers/interactions/UploadInteraction';
import containerHelper from 'taoQtiItem/qtiCommonRenderer/helpers/container';
import __ from 'i18n';
import 'ui/previewer';
/**
 * Set the response to the rendered interaction.
 *
 * The response format follows the IMS PCI recommendation :
 * http://www.imsglobal.org/assessment/pciv1p0cf/imsPCIv1p0cf.html#_Toc353965343
 *
 * Available base types are defined in the QTI v2.1 information model:
 * http://www.imsglobal.org/question/qtiv2p1/imsqti_infov2p1.html#element10321
 *
 * @param {object} interaction
 * @param {object} response
 */
var setResponse = function setResponse(interaction, response) {
    var filename,
        downloadUrl,
        mime,
        downloadLink = document.createElement("a"),
        $previewArea,
        $container = containerHelper.get(interaction);

    if (response.base !== null) {
        filename =
            typeof response.base.file.name !== 'undefined' ? response.base.file.name : 'previously-uploaded-file';
        mime = response.base.file.mime;
        downloadUrl = typeof response.base.file.data !== 'undefined' ? 'data:' + mime + ';base64,' + response.base.file.data : '';

        $container
            .find('.file-name')
            .empty()
            .text(filename);

        $container
            .find('.btn-download')
            .click(function (e) {
                e.preventDefault();
                downloadLink.href = downloadUrl;
                downloadLink.download = filename;
                downloadLink.click();
            });

        $previewArea = $container.find('.file-upload-preview');
        $previewArea.previewer({
            url: downloadUrl,
            name: filename,
            mime: mime
        });
    }
    interaction.data('_response', response);
};

/**
 * Init rendering, called after template injected into the DOM
 * All options are listed in the QTI v2.1 information model:
 * http://www.imsglobal.org/question/qtiv2p1/imsqti_infov2p1.html#element10321
 *
 * @param {object} interaction
 */
var render = function render(interaction) {
    _resetGui(interaction);
};

var _resetGui = function _resetGui(interaction) {
    var $container = containerHelper.get(interaction);
    $container.find('.btn-download').append(__('Download'));
};

export default Object.assign({}, uploadInteraction, {
    template,
    setResponse,
    render,
    resetGui: _resetGui
});
