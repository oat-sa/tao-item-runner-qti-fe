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
 * Copyright (c) 2015-2019 (original work) Open Assessment Technlogies SA (under the project TAO-PRODUCT);
 *
 */

/**
 * The Round operator processor.
 * @see http://www.imsglobal.org/question/qtiv2p1/imsqti_infov2p1.html#element10703
 *
 * @author Bertrand Chevrier <bertrand@taotesting.com>
 */
import _ from 'lodash';

/**
 * Process operands and returns round result.
 * @type {OperatorProcessor}
 * @exports taoQtiItem/scoring/processor/expressions/operators/round
 */
var roundProcessor = {

    constraints: {
        minOperand: 1,
        maxOperand: 1,
        cardinality: ['single'],
        baseType: ['integer', 'float']
    },

    operands: [],

    /**
     * @returns {?ProcessingValue} a single boolean
     */
    process: function() {

        var result = {
            cardinality: 'single',
            baseType: 'float'
        };
        var value;

        //if at least one operand is null, then break and return null
        if (_.some(this.operands, _.isNull) === true) {
            return null;
        }

        value = this.preProcessor
            .parseOperands(this.operands)
            .value()[0];

        if (_.isNaN(value)) {
            return null;
        }

        if (!_.isFinite(value)) {
            result.value = value;
            return result;
        }

        result.value = Math.round(value);
        return result;
    }
};

export default roundProcessor;
