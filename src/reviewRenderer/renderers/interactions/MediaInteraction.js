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
import $ from 'jquery';
import _ from 'lodash';
import containerHelper from 'taoQtiItem/qtiCommonRenderer/helpers/container';
import mediaInteraction from 'taoQtiItem/qtiCommonRenderer/renderers/interactions/MediaInteraction';
import mediaplayer from 'ui/mediaplayer';

var defaults = {
    type: 'video/mp4',
    video: {
        height: 270
    }
};

/**
 * Init rendering, called after template injected into the DOM
 * All options are listed in the QTI v2.1 information model:
 * http://www.imsglobal.org/question/qtiv2p1/imsqti_infov2p1.html#element10391
 *
 * @param {object} interaction
 * @returns {Promise<any>}
 */
var render = function render(interaction) {
    return new Promise((resolve) => {
        var $container = containerHelper.get(interaction);
        var media = interaction.object;
        var $item = $container.parents('.qti-item');
        var url = media.attr('data') || '';

        /**
         * Resize video player elements to fit container size
         * @param {Object} mediaElement - player instance
         * @param {jQueryElement} $container   - container element to adapt
         */
        var resize = _.debounce(function resize() {
            var width, height;
            if (interaction.mediaElement) {
                height = $container.find('.media-container').height();
                width = $container.find('.media-container').width();

                interaction.mediaElement.resize(width, height);
            }
        }, 200);

        //intialize the player if not yet done
        const initMediaPlayer = () => {
            if (!interaction.mediaElement) {
                interaction.mediaElement = mediaplayer({
                    url: url && this.resolveUrl(url),
                    type: media.attr('type') || defaults.type,
                    canPause: true,
                    canSeek: true,
                    width: media.attr('width'),
                    height: media.attr('height'),
                    autoStart: false,
                    loop: false,
                    renderTo: $('.media-container', $container)
                })
                    .on('render', function() {
                        resize();

                        $(window)
                            .off('resize.mediaInteraction')
                            .on('resize.mediaInteraction', resize);

                        $item.off('resize.gridEdit').on('resize.gridEdit', resize);

                        /**
                         * @event playerrendered
                         */
                        $container.trigger('playerrendered');
                    })
                    .on('ready', function() {
                        /**
                         * @event playerready
                         */
                        $container.trigger('playerready');

                        // declare the item ready when player is ready to play.
                        resolve();
                    })
                    .on(
                        'update',
                        _.throttle(function() {
                            containerHelper.triggerResponseChangeEvent(interaction);
                        }, 1000)
                    )
                    .on('ended', function() {
                        containerHelper.triggerResponseChangeEvent(interaction);
                    });
            }
        };

        if (_.size(media.attributes) === 0) {
            //TODO move to afterCreate
            media.attr('type', defaults.type);
            media.attr('width', $container.innerWidth());

            media.attr('height', defaults.video.height);
            media.attr('data', '');
        }

        //initialize the component
        $container.on('responseSet', function() {
            initMediaPlayer();
        });

        //gives a small chance to the responseSet event before initializing the player
        initMediaPlayer();
    });
};

/**
 * Expose the common renderer for the media interaction
 * @exports reviewRenderer/renderers/interactions/mediaInteraction
 */
export default Object.assign({}, mediaInteraction, {render});