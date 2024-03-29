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
 * Copyright (c) 2015 (original work) Open Assessment Technologies SA ;
 */

/**
 * TODO this code should be merged with the theme loader
 */
import $ from 'jquery';
import _ from 'lodash';

//throttle events because of the loop
var informLoaded = _.throttle(
    function() {
        $(document).trigger('customcssloaded.styleeditor',[{}]);
    },
    10,
    { leading: false }
);

/**
 * Attach QTI Stylesheets to the document
 *
 * @param {Array} stylesheets - the QTI model stylesheets
 * @fires customcssloaded.styleeditor on document 10ms after stylesheets are loaded
 */
var attach = function attach(stylesheets) {
    var $head = $('head');

    //fallback
    if (!$head.length) {
        $head = $('body');
    }

    // relative links with cache buster
    _(stylesheets).forEach(function(stylesheet) {
        var $link, href;

        //if the href is something
        if (stylesheet.attr('href')) {
            $link = $(stylesheet.render());

            //get the resolved href once rendererd
            href = $link.attr('href');

            //we need to set the href after the link is appended to the head (for our dear IE)
            $link.removeAttr('href').attr('href', href);

            if (stylesheet.attr('onload')) {
                $link[0].onload = stylesheet.attr('onload');
            }

            if (stylesheet.attr('onerror')) {
                $link[0].onerror = stylesheet.attr('onerror');
            }

            $link.one('load', informLoaded).appendTo($head);
        }
    });
};

/**
 * Remove QTI Stylesheets from the document
 *
 * @param {Array} stylesheets - the QTI model stylesheets
 */
var detach = function detach(stylesheets) {
    _(stylesheets).forEach(function(stylesheet) {
        if (stylesheet.serial) {
            $('link[data-serial="' + stylesheet.serial + '"]').remove();
        }
    });
};

/**
 * @exports taoQtiItem/qtiCommonRenderer/helpers/itemStylesheetHandler
 */
export default {
    attach: attach,
    detach: detach
};
