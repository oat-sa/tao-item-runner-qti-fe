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
 * The variable expression processor.
 * @see http://www.imsglobal.org/question/qtiv2p1/imsqti_infov2p1.html#element10572
 *
 * @author Bertrand Chevrier <bertrand@taotesting.com>
 */
/**
 * Correct expression
 * @type {ExpressionProcesssor}
 * @exports taoQtiItem/scoring/processor/expressions/variable
 */
var variableProcessor = {

    /**
     * Process the expression
     * @returns {ProcessingValue} the value from the expression
     */
    process: function() {

        var identifier = this.expression.attributes.identifier;
        var variable = this.state[identifier];

        if (typeof variable === 'undefined' || variable === null) {
            return null;
        }

        //TODO cast value
        return this.preProcessor.parseVariable({
            cardinality: variable.cardinality,
            baseType: variable.baseType,
            value: variable.value
        });
    }
};

export default variableProcessor;
