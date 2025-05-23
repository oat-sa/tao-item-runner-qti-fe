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
 * Copyright (c) 2014 (original work) Open Assessment Technologies SA
 */

import tpl from 'taoQtiItem/qtiCommonRenderer/tpl/object';
import containerHelper from 'taoQtiItem/qtiCommonRenderer/helpers/container';
import 'ui/previewer';

export default {
    qtiClass: 'object',
    template: tpl,
    getContainer: containerHelper.get,
    render: function(obj) {
        var $container = containerHelper.get(obj);
        var previewOptions = {
            url: obj.renderer.resolveUrl(obj.attr('data')),
            mime: obj.attr('type')
        };
        if (obj.attr('height')) {
            previewOptions.height = obj.attr('height');
        }
        if (obj.attr('width')) {
            previewOptions.width = obj.attr('width');
        }
        if (
            obj.metaData.metadataUri
            && obj.metaData.resourceMetadataUrl
            && obj.attr('data').includes('taomedia://mediamanager/')
        ) {
            const transcriptionUrl = obj.metaData.resourceMetadataUrl;
            const metadataUri = encodeURIComponent(obj.metaData.metadataUri);
            const resourceUri = obj.attr('data').replace('taomedia://mediamanager/', '');
            previewOptions.transcriptionUrl = `${transcriptionUrl}?metadataUri=${metadataUri}&resourceUri=${resourceUri}`;
        }
        if (previewOptions.url && previewOptions.mime) {
            $container.previewer(previewOptions);
        }
    }
};
