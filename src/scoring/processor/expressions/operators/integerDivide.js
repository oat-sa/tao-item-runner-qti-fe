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
 * The integerDivide operator processor.
 * @see http://www.imsglobal.org/question/qtiv2p1/imsqti_infov2p1.html#element10697
 *
 * @author Bertrand Chevrier <bertrand@taotesting.com>
 */
import _ from 'lodash';

/**
 * Process operands and returns the integerDivide.
 * @type {OperatorProcessor}
 * @exports taoQtiItem/scoring/processor/expressions/operators/integerDivide
 */
var integerDivideProcessor = {

    constraints: {
        minOperand: 2,
        maxOperand: 2,
        cardinality: ['single'],
        baseType: ['integer']
    },

    operands: [],

    /**
     * Process the integerDivide of the operands.
     * @returns {?ProcessingValue} the integerDivide or null
     */
    process: function() {

        var result = {
            cardinality: 'single',
            baseType: 'integer'
        };

        //if at least one operand is null, then break and return null
        if (_.some(this.operands, _.isNull) === true) {
            return null;
        }

        result.value = this.preProcessor
            .mapNumbers(this.operands)
            .reduce(function(f, s) {
                var divResult = Math.floor(f / s);

                if (s === 0) {
                    return null;
                }

                return divResult;
            });

        if (_.isNull(result.value)) {
            return null;
        }

        return result;
    }
};

export default integerDivideProcessor;
