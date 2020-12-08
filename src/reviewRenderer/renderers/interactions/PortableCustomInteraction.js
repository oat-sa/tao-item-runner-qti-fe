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
import template from 'taoQtiItem/reviewRenderer/tpl/interactions/customInteraction';
import portableCustomInteraction from 'taoQtiItem/qtiCommonRenderer/renderers/interactions/PortableCustomInteraction';
import util from 'taoQtiItem/qtiItem/helper/util';
import PortableElement from 'taoQtiItem/qtiCommonRenderer/helpers/PortableElement';
import { isInteractionDisabled } from 'taoQtiItem/reviewRenderer/helpers/pci';

const getData = (customInteraction, data) => {
    let markup = data.markup;

    //remove ns + fix media file path
    markup = util.removeMarkupNamespaces(markup);
    markup = PortableElement.fixMarkupMediaSources(markup, this);
    data.markup = markup;

    data.isInteractionDisabled = isInteractionDisabled(data.typeIdentifier);

    return data;
};

export default Object.assign({}, portableCustomInteraction, { template, getData });
