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
 * Copyright (c) 2014 (original work) Open Assessment Technlogies SA (under the project TAO-PRODUCT);
 *
 */

/**
 * @author Sam Sipasseuth <sam@taotesting.com>
 */
import tpl from 'taoQtiItem/qtiCommonRenderer/tpl/choices/simpleChoice.choiceInteraction';
import containerHelper from 'taoQtiItem/qtiCommonRenderer/helpers/container';
import features from 'services/features';

export default {
    qtiClass: 'simpleChoice.choiceInteraction',
    getContainer: containerHelper.get,
    getData: function(choice, data) {
        data.unique = parseInt(data.interaction.attributes.maxChoices) === 1;
        data.allowElimination = features.isVisible('taoQtiItem/creator/interaction/choice/property/allowElimination');
        return data;
    },
    template: tpl
};
