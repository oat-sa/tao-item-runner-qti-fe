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
 * @author Ansul Sharma <ansultaotesting.com>
 */
import $ from 'jquery';
import __ from 'i18n';
import sliderInteraction from 'taoQtiItem/qtiCommonRenderer/renderers/interactions/sliderInteraction';
import 'nouislider';

var _slideTo = function(options) {
    options.sliderCurrentValue.find('.qti-slider-cur-value').text(options.value);
    options.sliderValue.val(options.value);
};

/**
 * Init rendering, called after template injected into the DOM
 * All options are listed in the QTI v2.1 information model:
 * http://www.imsglobal.org/question/qtiv2p1/imsqti_infov2p1.html#element10333
 *
 * @param {object} interaction
 */
const render = function(interaction) {
    const attributes = interaction.getAttributes(),
        $container = interaction.getContainer(),
        $el = $('<div />').attr({ disabled: true, id: `${attributes.responseIdentifier}-qti-slider`, class: 'qti-slider' }), //slider element
        $sliderLabels = $('<div />').attr({ class: 'qti-slider-values' }),
        $sliderCurrentValue = $('<div />').attr({
            id: `${attributes.responseIdentifier}-qti-slider-cur-value`,
            class: 'qti-slider-cur-value'
        }), //show the current selected value
        $sliderValue = $('<input />').attr({ type: 'hidden', id: `${attributes.responseIdentifier}-qti-slider-value`, class: 'qti-slider-value' }); //the input that always holds the slider value

    //getting the options
    let orientation = 'horizontal';
    const reverse = typeof attributes.reverse !== 'undefined' && attributes.reverse ? true : false, //setting the slider whether to be reverse or not
        min = parseInt(attributes.lowerBound),
        max = parseInt(attributes.upperBound),
        step = typeof attributes.step !== 'undefined' && attributes.step ? parseInt(attributes.step) : 1, //default value as per QTI standard
        steps = (max - min) / step; //number of the steps

    //add the containers
    $sliderCurrentValue
        .append(`<span class="qti-slider-cur-value-text">${__('Current value:')}</span>`)
        .append('<span class="qti-slider-cur-value"></span>');

    $sliderLabels
        .append(`<span class="slider-min">${!reverse ? min : max}</span>`)
        .append(`<span class="slider-max">${!reverse ? max : min}</span>`);

    interaction
        .getContainer()
        .append($el)
        .append($sliderLabels)
        .append($sliderCurrentValue)
        .append($sliderValue);

    //setting the orientation of the slider
    if (
        typeof attributes.orientation !== 'undefined' &&
        $.inArray(attributes.orientation, ['horizontal', 'vertical']) > -1
    ) {
        orientation = attributes.orientation;
    }

    let sliderSize = 0;

    if (orientation === 'horizontal') {
        $container.addClass('qti-slider-horizontal');
    } else {
        const maxHeight = 300;
        sliderSize = steps * 20;
        if (sliderSize > maxHeight) {
            sliderSize = maxHeight;
        }
        $container.addClass('qti-slider-vertical');
        $el.height(`${sliderSize}px`);
        $sliderLabels.height(`${sliderSize}px`);
    }

    //set the middle value if the stepLabel attribute is enabled
    if (typeof attributes.stepLabel !== 'undefined' && attributes.stepLabel) {
        const middleStep = parseInt(steps / 2),
            leftOffset = (100 / steps) * middleStep,
            middleValue = reverse ? max - middleStep * step : min + middleStep * step;

        if (orientation === 'horizontal') {
            $sliderLabels
                .find('.slider-min')
                .after(`<span class="slider-middle" style="left:'${leftOffset}%">${middleValue}</span>`);
        } else {
            $sliderLabels
                .find('.slider-min')
                .after(`<span class="slider-middle" style="top:${leftOffset}%">${middleValue}</span>`);
        }
    }

    //create the slider
    $el.noUiSlider({
        start: reverse ? max : min,
        range: {
            min: min,
            max: max
        },
        step: step,
        orientation: orientation
    });

    _slideTo({
        value: min,
        sliderValue: $sliderValue,
        sliderCurrentValue: $sliderCurrentValue
    });
};

export default Object.assign({}, sliderInteraction, {render: render});