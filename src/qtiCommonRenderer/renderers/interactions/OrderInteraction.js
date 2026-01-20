/*
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU General Public License
 * as published by the Free Software Foundation; under version 2
 * of the License (non-upgradable).
 *
 * Copyright (c) 2014-2019 Open Assessment Technologies SA
 */

import _ from 'lodash';
import $ from 'jquery';
import __ from 'i18n';
import 'core/mouseEvent';
import features from 'services/features';
import tpl from 'taoQtiItem/qtiCommonRenderer/tpl/interactions/orderInteraction';
import containerHelper from 'taoQtiItem/qtiCommonRenderer/helpers/container';
import instructionMgr from 'taoQtiItem/qtiCommonRenderer/helpers/instructions/instructionManager';
import pciResponse from 'taoQtiItem/qtiCommonRenderer/helpers/PciResponse';
import interact from 'interact';
import interactUtils from 'ui/interactUtils';

const orientationSelectionEnabled =
    features.isVisible('taoQtiItem/creator/interaction/order/property/orientation');

/**
 * Arrow direction mapping for the "add to selection" control,
 * depending on interaction orientation and position.
 */
const ARROW_DIRECTION = {
    vertical: {
        top: 'icon-down',
        bottom: 'icon-up',
        left: 'icon-up',
        right: 'icon-left'
    },
    horizontal: {
        top: 'icon-down',
        bottom: 'icon-up',
        left: 'icon-left',
        right: 'icon-right'
    }
};

function extractPositionFromClass(classAttr) {
    if (!classAttr) {
        return 'top';
    }
    if (classAttr.indexOf('qti-choices-bottom') !== -1) return 'bottom';
    if (classAttr.indexOf('qti-choices-left') !== -1) return 'left';
    if (classAttr.indexOf('qti-choices-right') !== -1) return 'right';
    return 'top';
}

function updateAddArrowIcon($iconAdd, orientation, position) {
    const axis = ARROW_DIRECTION[orientation] || ARROW_DIRECTION.vertical;
    const iconClass = axis[position] || axis.top;

    $iconAdd
        .removeClass('icon-up icon-down icon-left icon-right')
        .addClass(iconClass);
}

const _freezeSize = function ($container) {
    const $orderArea = $container.find('.order-interaction-area');
    $orderArea.height($orderArea.height());
};

const render = function (interaction) {
    const $container = containerHelper.get(interaction),
        $choiceArea = $container.find('.choice-area'),
        $resultArea = $container.find('.result-area'),
        $iconAdd = $container.find('.icon-add-to-selection'),
        $iconRemove = $container.find('.icon-remove-from-selection'),
        $iconBefore = $container.find('.icon-move-before'),
        $iconAfter = $container.find('.icon-move-after'),
        choiceSelector = `${$choiceArea.selector} >li:not(.deactivated)`,
        resultSelector = `${$resultArea.selector} >li`,
        $dragContainer = $container.find('.drag-container'),
        orderState = interaction.attr('data-order') || interaction.attr('order'),
        isSingleOrder = orderState === 'single',
        orientation =
            interaction.attr('orientation') && orientationSelectionEnabled
                ? interaction.attr('orientation')
                : 'vertical';

    /* --------------------------------
     * APPLY ARROW DIRECTION (KEY PART)
     * -------------------------------- */
    const position = extractPositionFromClass(interaction.attr('class'));
    updateAddArrowIcon($iconAdd, orientation, position);

    if (isSingleOrder) {
        const $choices = $choiceArea.children('.qti-choice');
        $container.addClass('test-preview');
        $resultArea.append($choices);
    }

    let $activeChoice = null,
        scaleX,
        scaleY,
        isDragAndDropEnabled,
        dragOptions,
        $dropzoneElement;

    const _resetControls = function () {
        $iconAdd.removeClass('inactive');
        $iconRemove.removeClass('active').addClass('inactive');
        $iconBefore.removeClass('active').addClass('inactive');
        $iconAfter.removeClass('active').addClass('inactive');
    };

    const _setSelection = function ($choice) {
        if ($activeChoice) {
            $activeChoice.removeClass('active');
        }
        $activeChoice = $choice;
        $activeChoice.addClass('active');
    };

    const _resetSelection = function () {
        if ($activeChoice) {
            $activeChoice.removeClass('active');
            $activeChoice = null;
        }
        _resetControls();
    };

    const _addChoiceToSelection = function ($target, position) {
        const $results = $(resultSelector);
        _resetSelection();

        if (typeof position !== 'undefined' && position < $results.length) {
            $results.eq(position).before($target);
        } else {
            $resultArea.append($target);
        }

        containerHelper.triggerResponseChangeEvent(interaction);
        instructionMgr.validateInstructions(interaction);
    };

    /* --------------------------------
     * CLICK HANDLERS
     * -------------------------------- */

    interact($container.selector).on('tap', function () {
        _resetSelection();
    });

    interact(choiceSelector).on('tap', function (e) {
        const $target = $(e.currentTarget);

        if ($target.closest('.qti-item').hasClass('prevent-click-handler')) {
            return;
        }

        e.stopPropagation();

        $iconAdd.addClass('triggered');
        setTimeout(function () {
            $iconAdd.removeClass('triggered');
        }, 150);

        _addChoiceToSelection($target);
    });

    interact(resultSelector).on('tap', function (e) {
        const $target = $(e.currentTarget);

        if ($target.closest('.qti-item').hasClass('prevent-click-handler')) {
            return;
        }

        e.stopPropagation();
        _setSelection($target);
    });

    /* --------------------------------
     * DRAG & DROP (UNCHANGED)
     * -------------------------------- */

    if (this.getOption && this.getOption('enableDragAndDrop') && this.getOption('enableDragAndDrop').order) {
        isDragAndDropEnabled = this.getOption('enableDragAndDrop').order;
    }

    if (isDragAndDropEnabled) {
        $dropzoneElement = $('<li>', { class: 'dropzone qti-choice' });
        $('<div>', { class: 'qti-block' }).appendTo($dropzoneElement);

        dragOptions = {
            inertia: false,
            autoScroll: true,
            restrict: {
                restriction: '.qti-interaction',
                endOnly: false,
                elementRect: { top: 0, left: 0, bottom: 1, right: 1 }
            }
        };

        interact(choiceSelector).draggable(
            _.assign({}, dragOptions, {
                onstart: function (e) {
                    const $target = $(e.target);
                    $target.addClass('dragged');
                },
                onend: function (e) {
                    $(e.target).removeClass('dragged');
                }
            })
        );

        interact($resultArea.selector).dropzone({
            overlap: 0.5,
            ondrop: function (e) {
                _addChoiceToSelection($(e.relatedTarget));
            }
        });
    }

    _freezeSize($container);
};

export default {
    qtiClass: 'orderInteraction',
    template: tpl,
    render,
    getContainer: containerHelper.get
};
