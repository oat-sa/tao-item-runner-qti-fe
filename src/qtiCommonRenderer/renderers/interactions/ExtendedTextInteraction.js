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
 * Copyright (c) 2014-2022 (original work) Open Assessment Technlogies SA (under the project TAO-PRODUCT);
 *
 */

/**
 * @author Sam Sipasseuth <sam@taotesting.com>
 * @author Bertrand Chevrier <bertrand@taotesting.com>
 */
import $ from 'jquery';
import _ from 'lodash';
import __ from 'i18n';
import strLimiter from 'util/strLimiter';
import template from 'taoQtiItem/qtiCommonRenderer/tpl/interactions/extendedTextInteraction';
import countTpl from 'taoQtiItem/qtiCommonRenderer/tpl/interactions/constraints/count';
import containerHelper from 'taoQtiItem/qtiCommonRenderer/helpers/container';
import instructionMgr from 'taoQtiItem/qtiCommonRenderer/helpers/instructions/instructionManager';
import ckEditor from 'ckeditor';
import ckConfigurator from 'taoQtiItem/qtiCommonRenderer/helpers/ckConfigurator';
import patternMaskHelper from 'taoQtiItem/qtiCommonRenderer/helpers/patternMask';
import tooltip from 'ui/tooltip';
import loggerFactory from 'core/logger';

/**
 * Create a logger
 */
const logger = loggerFactory('taoQtiItem/qtiCommonRenderer/renderers/interactions/ExtendedTextInteraction.js');

/**
 * Init rendering, called after template injected into the DOM
 * All options are listed in the QTI v2.1 information model:
 * http://www.imsglobal.org/question/qtiv2p1/imsqti_infov2p1.html#element10296
 *
 * @param {Object} interaction - the extended text interaction model
 * @returns {Promise} rendering is async
 */
const render = function render(interaction) {
    return new Promise(function (resolve, reject) {
        let $el, expectedLength, minStrings, patternMask, placeholderType, editor;
        let _styleUpdater, themeLoaded, _getNumStrings;
        let $container = containerHelper.get(interaction);

        const multiple = _isMultiple(interaction);
        const limiter = inputLimiter(interaction);

        const placeholderText = interaction.attr('placeholderText');

        const getItemLanguage = () => {
            let itemLang = $container.closest('.qti-item').attr('lang');
            let itemLocale = itemLang && itemLang.split('-')[0];
            if (!itemLocale) {
                itemLang = window.document.documentElement.getAttribute('lang');
                itemLocale = itemLang && itemLang.split('-')[0];
            }
            return itemLocale;
        };

        const toolbarType = 'extendedText';
        const ckOptions = {
            resize_enabled: true,
            secure: location.protocol === 'https:',
            forceCustomDomain: true,
            language: getItemLanguage()
        };

        if (!multiple) {
            $el = $container.find('textarea');
            if (placeholderText) {
                $el.attr('placeholder', placeholderText);
            }
            if (_getFormat(interaction) === 'xhtml') {
                _styleUpdater = function () {
                    let qtiItemStyle, $editorBody, qtiItem;

                    if (editor.document) {
                        qtiItem = $('.qti-item').get(0);
                        qtiItemStyle = qtiItem.currentStyle || window.getComputedStyle(qtiItem);

                        if (editor.document.$ && editor.document.$.body) {
                            $editorBody = $(editor.document.$.body);
                        } else {
                            $editorBody = $(editor.document.getBody().$);
                        }

                        $editorBody.css({
                            'background-color': 'transparent',
                            color: qtiItemStyle.color
                        });
                    }
                };
                themeLoaded = function () {
                    _styleUpdater();
                };

                editor = _setUpCKEditor(interaction, ckOptions);
                if (!editor) {
                    reject('Unable to instantiate ckEditor');
                }

                editor.on('instanceReady', function () {
                    _styleUpdater();

                    //TAO-6409, disable navigation from cke toolbar
                    if (editor.container && editor.container.$) {
                        $(editor.container.$).addClass('no-key-navigation');
                    }

                    //it seems there's still something done after loaded, so resolved must be defered
                    _.delay(resolve, 300);
                });
                if (editor.status === 'ready' || editor.status === 'loaded') {
                    _.defer(resolve);
                }
                editor.on('configLoaded', function () {
                    editor.config = ckConfigurator.getConfig(editor, toolbarType, ckOptions);

                    if (limiter.enabled) {
                        limiter.listenTextInput();
                    }
                });
                editor.on('change', function () {
                    containerHelper.triggerResponseChangeEvent(interaction, {});
                });

                $(document).on('themechange.themeloader', themeLoaded);
            } else {
                $el.on('keyup.commonRenderer change.commonRenderer', function () {
                    containerHelper.triggerResponseChangeEvent(interaction, {});
                });

                if (limiter.enabled) {
                    limiter.listenTextInput();
                }

                resolve();
            }

            //multiple inputs
        } else {
            $el = $container.find('input');
            minStrings = interaction.attr('minStrings');
            expectedLength = interaction.attr('expectedLength');
            patternMask = interaction.attr('patternMask');

            //setting the checking for minimum number of answers
            if (minStrings) {
                //get the number of filled inputs
                _getNumStrings = function ($element) {
                    let num = 0;
                    $element.each(function () {
                        if ($(this).val() !== '') {
                            num++;
                        }
                    });

                    return num;
                };

                minStrings = parseInt(minStrings, 10);
                if (minStrings > 0) {
                    $el.on('blur.commonRenderer', function () {
                        setTimeout(function () {
                            //checking if the user was clicked outside of the input fields

                            //TODO remove notifications in favor of instructions

                            if (!$el.is(':focus') && _getNumStrings($el) < minStrings) {
                                instructionMgr.appendNotification(
                                    interaction,
                                    `${__('The minimum number of answers is ')} : ${minStrings}`,
                                    'warning'
                                );
                            }
                        }, 100);
                    });
                }
            }

            //set the fields width
            if (expectedLength) {
                expectedLength = parseInt(expectedLength, 10);

                if (expectedLength > 0) {
                    $el.each(function () {
                        $(this).css('width', `${expectedLength}em`);
                    });
                }
            }

            //set the fields pattern mask
            if (patternMask) {
                $el.each(function () {
                    _setPattern($(this), patternMask);
                });
            }

            //set the fields placeholder
            if (placeholderText) {
                /**
                 * The type of the fileds placeholder:
                 * multiple - set placeholder for each field
                 * first - set placeholder only for first field
                 * none - dont set placeholder
                 */
                placeholderType = 'first';

                if (placeholderType === 'multiple') {
                    $el.each(function () {
                        $(this).attr('placeholder', placeholderText);
                    });
                } else if (placeholderType === 'first') {
                    $el.first().attr('placeholder', placeholderText);
                }
            }
            resolve();
        }
    });
};

/**
 * Reset the textarea / ckEditor
 * @param {Object} interaction - the extended text interaction model
 */
const resetResponse = function (interaction) {
    if (_getFormat(interaction) === 'xhtml') {
        _getCKEditor(interaction).setData('');
    } else {
        containerHelper.get(interaction).find('input, textarea').val('');
    }
};

/**
 * Set the response to the rendered interaction.
 *
 * The response format follows the IMS PCI recommendation :
 * http://www.imsglobal.org/assessment/pciv1p0cf/imsPCIv1p0cf.html#_Toc353965343
 *
 * Available base types are defined in the QTI v2.1 information model:
 * http://www.imsglobal.org/question/qtiv2p1/imsqti_infov2p1.html#element10296
 *
 * @param {Object} interaction - the extended text interaction model
 * @param {object} response
 */
const setResponse = (interaction, response) => {
    const _setMultipleVal = (identifier, value) => {
        interaction.getContainer().find(`#${identifier}`).val(value);
    };

    const baseType = interaction.getResponseDeclaration().attr('baseType');

    if (response.base === null && Object.keys(response).length === 1) {
        response = { base: { string: '' } };
    }

    if (response.base && typeof response.base[baseType] !== 'undefined') {
        setText(interaction, response.base[baseType]);
    } else if (response.list && response.list[baseType]) {
        for (let i in response.list[baseType]) {
            const serial = typeof response.list.serial === 'undefined' ? '' : response.list.serial[i];
            _setMultipleVal(`${serial}_${i}`, response.list[baseType][i]);
        }
    } else {
        throw new Error('wrong response format in argument.');
    }
};

/**
 * Return the response of the rendered interaction
 *
 * The response format follows the IMS PCI recommendation :
 * http://www.imsglobal.org/assessment/pciv1p0cf/imsPCIv1p0cf.html#_Toc353965343
 *
 * Available base types are defined in the QTI v2.1 information model:
 * http://www.imsglobal.org/question/qtiv2p1/imsqti_infov2p1.html#element10296
 *
 * @param {Object} interaction - the extended text interaction model
 * @returns {object}
 */
const getResponse = function (interaction) {
    const $container = containerHelper.get(interaction);
    const attributes = interaction.getAttributes();
    const responseDeclaration = interaction.getResponseDeclaration();
    const baseType = responseDeclaration.attr('baseType');
    const numericBase = attributes.base || 10;
    const multiple = !!(
        attributes.maxStrings &&
        (responseDeclaration.attr('cardinality') === 'multiple' ||
            responseDeclaration.attr('cardinality') === 'ordered')
    );
    const ret = multiple ? { list: {} } : { base: {} };
    let values;
    let value = '';

    if (multiple) {
        values = [];

        $container.find('input').each(function (i) {
            const $el = $(this);

            if (attributes.placeholderText && $el.val() === attributes.placeholderText) {
                values[i] = '';
            } else {
                if (baseType === 'integer') {
                    values[i] = parseInt($el.val(), numericBase);
                    values[i] = isNaN(values[i]) ? '' : values[i];
                } else if (baseType === 'float') {
                    values[i] = parseFloat($el.val());
                    values[i] = isNaN(values[i]) ? '' : values[i];
                } else if (baseType === 'string') {
                    values[i] = $el.val();
                }
            }
        });

        ret.list[baseType] = values;
    } else {
        if (attributes.placeholderText && _getTextareaValue(interaction) === attributes.placeholderText) {
            value = '';
        } else {
            if (baseType === 'integer') {
                value = parseInt(_getTextareaValue(interaction), numericBase);
            } else if (baseType === 'float') {
                value = parseFloat(_getTextareaValue(interaction));
            } else if (baseType === 'string') {
                value = _getTextareaValue(interaction, true);
            }
        }

        ret.base[baseType] = isNaN(value) && typeof value === 'number' ? '' : value;
    }

    return ret;
};

/**
 * Creates an input limiter object
 * @param {Object} interaction - the extended text interaction
 * @returns {Object} the limiter
 */
function inputLimiter(interaction) {
    const $container = containerHelper.get(interaction);
    const expectedLength = interaction.attr('expectedLength');
    const expectedLines = interaction.attr('expectedLines');
    const patternMask = interaction.attr('patternMask');
    let patternRegEx;
    let $textarea, $charsCounter, $wordsCounter, maxWords, maxLength, $maxLengthCounter, $maxWordsCounter;
    let enabled = false;

    if (expectedLength || expectedLines || patternMask) {
        enabled = true;
        $textarea = $('.text-container', $container);
        $charsCounter = $('.count-chars', $container);
        $wordsCounter = $('.count-words', $container);
        $maxLengthCounter = $('.count-max-length', $container);
        $maxWordsCounter = $('.count-max-words', $container);

        if (patternMask !== '') {
            maxWords = parseInt(patternMaskHelper.parsePattern(patternMask, 'words'), 10);
            maxLength = parseInt(patternMaskHelper.parsePattern(patternMask, 'chars'), 10);
            maxWords = _.isNaN(maxWords) ? 0 : maxWords;
            maxLength = _.isNaN(maxLength) ? 0 : maxLength;
            if (!maxLength && !maxWords) {
                patternRegEx = new RegExp(patternMask);
            }
            $maxLengthCounter.text(maxLength);
            $maxWordsCounter.text(maxWords);
        }
    }

    /**
     * The limiter instance
     */
    const limiter = {
        /**
         * Is the limiter enabled regarding the interaction configuration
         */
        enabled: enabled,

        /**
         * Listen for text input into the interaction and limit it if necessary
         */
        listenTextInput: function listenTextInput() {
            const ignoreKeyCodes = [
                8, // backspace
                13, // enter
                16, // shift
                17, // control
                46, // delete
                37, // arrow left
                38, // arrow up
                39, // arrow right
                40, // arrow down
                35, // home
                36, // end

                // ckeditor specific:
                1114177, // home
                3342401, // Shift + home
                1114181, // end
                3342405, // Shift + end

                2228232, // Shift + backspace
                2228261, // Shift + arrow left
                4456485, // Alt   + arrow left
                2228262, // Shift + arrow up
                2228263, // Shift + arrow right
                4456487, // Alt   + arrow right
                2228264, // Shift + arrow down
                2228237, // Shift + enter

                1114120, // Ctrl + backspace
                1114177, // Ctrl + a
                1114202, // Ctrl + z
                1114200 // Ctrl + x
            ];
            const triggerKeyCodes = [
                32, // space
                13, // enter
                2228237 // shift + enter in ckEditor
            ];
            let cke;
            let isComposing = false;
            let hasCompositionJustEnded = false;

            const acceptKeyCode = keyCode => _.contains(ignoreKeyCodes, keyCode);
            const emptyText = txt => txt && txt.trim() === '' || /\^s*$/.test(txt);
            const hasSpace = txt => /\s+/.test(txt);
            const cancelEvent = e => {
                if (e.cancel) {
                    e.cancel();
                } else {
                    e.preventDefault();
                    e.stopImmediatePropagation();
                }
                return false;
            };
            const invalidToolip = tooltip.error($container, __('This is not a valid answer'), {
                position: 'bottom',
                trigger: 'manual'
            });
            const patternHandler = function patternHandler(e) {
                if (isComposing || hasCompositionJustEnded) {
                    // IME composing fires keydown/keyup events
                    hasCompositionJustEnded = false;
                    return;
                }

                const isCke = _getFormat(interaction) === 'xhtml';
                let newValue;
                if (patternRegEx) {
                    if (isCke) {
                        // cke has its own object structure
                        newValue = this.getData();
                    } else {
                        // covers input
                        newValue = e.currentTarget.value;
                    }

                    if (!newValue) {
                        return false;
                    }
                    _.debounce(function () {
                        if (!patternRegEx.test(newValue)) {
                            $container.addClass('invalid');
                            $container.show();
                            invalidToolip.show();
                            containerHelper.triggerResponseChangeEvent(interaction);
                        } else {
                            $container.removeClass('invalid');
                            invalidToolip.dispose();
                        }
                    }, 400)();
                }
            };

            /**
             * This part works on keyboard input
             *
             * @param {Event} e
             * @returns {boolean}
             */
            const keyLimitHandler = e => {
                if (isComposing) {
                    return;
                }
                // Safari on OS X may send a keydown of 229 after compositionend
                if (e.which !== 229) {
                    hasCompositionJustEnded = false;
                }

                const keyCode = e.data ? e.data.keyCode : e.which;
                const isCke = _getFormat(interaction) === 'xhtml';
                const wordsCount = maxWords && this.getWordsCount();
                const charsCount = maxLength && this.getCharsCount();

                if (maxWords && wordsCount >= maxWords) {
                    let left, right, middle;

                    if (isCke) {
                        // TODO
                    } else {
                        const { selectionStart, selectionEnd, value } = $textarea[0];
                        left = value.substring(Math.max(0, selectionStart - 1), selectionStart);
                        right = value.substring(selectionEnd, selectionEnd + 1);
                        middle = value.substring(selectionStart, selectionEnd);
                    }

                    if ((!emptyText(left) && !emptyText(right) && !hasSpace(middle) && (keyCode === 13 || keyCode === 32)) ||
                        (emptyText(left) && emptyText(right) && !middle && !acceptKeyCode(keyCode) && keyCode !== 32)) {
                        return cancelEvent(e);
                    }
                }

                if (maxLength && charsCount >= maxLength && !acceptKeyCode(keyCode)) {
                    if (!isCke && charsCount > maxLength) {
                        const textarea = $textarea[0];
                        textarea.value = textarea.value.substring(0, maxLength);
                        textarea.focus();
                    }
                    return cancelEvent(e);
                }

                _.defer(() => this.updateCounter());
            };

            /**
             * This part works on drop or paste
             * @param {Event} e
             * @returns {boolean}
             */
            const nonKeyLimitHandler = e => {
                let newValue;
                const isCke = _getFormat(interaction) === 'xhtml';

                if (typeof $(e.target).attr('data-clipboard') === 'string') {
                    newValue = $(e.target).attr('data-clipboard');
                } else if (isCke) {
                    // cke has its own object structure
                    newValue = e.data.dataValue;
                } else {
                    // covers input via paste or drop
                    newValue = e.originalEvent.clipboardData
                        ? e.originalEvent.clipboardData.getData('text')
                        : e.originalEvent.dataTransfer.getData('text') ||
                          e.originalEvent.dataTransfer.getData('text/plain') ||
                          '';
                }

                // prevent insertion of non-limited data
                cancelEvent(e);

                if (!newValue) {
                    return false;
                }

                // limit by word or character count if required
                if (maxWords) {
                    newValue = strLimiter.limitByWordCount(newValue, maxWords - this.getWordsCount());
                } else if (maxLength) {
                    newValue = strLimiter.limitByCharCount(newValue, maxLength - this.getCharsCount());
                }

                // insert the cut-off text
                if (isCke) {
                    _getCKEditor(interaction).insertHtml(newValue);
                } else {
                    let elements = containerHelper.get(interaction).find('textarea');
                    let el = elements[0];
                    let { selectionStart: start, selectionEnd: end, value: text } = el;
                    elements.val(text.substring(0, start) + newValue + text.substring(end, text.length));
                    el.focus();
                    el.selectionStart = start + newValue.length;
                    el.selectionEnd = el.selectionStart;
                }

                _.defer(() => this.updateCounter());
            };

            const handleCompositionStart = e => {
                isComposing = true;
                return e;
            };

            const handleCompositionEnd = e => {
                isComposing = false;
                hasCompositionJustEnded = true;
                // if plain text - then limit input right after composition end event
                if (_getFormat(interaction) !== 'xhtml' && maxLength !== null) {
                    const currentValue = $textarea[0].value;
                    $textarea[0].value = currentValue.substring(0, maxLength);
                }
                _.defer(() => this.updateCounter());
                return e;
            };

            const handleBeforeInput = e => {
                _.defer(() => this.updateCounter());
                return e;
            };

            if (_getFormat(interaction) === 'xhtml') {
                cke = _getCKEditor(interaction);

                if (maxLength) {
                    let previousSnapshot = cke.getSnapshot();

                    cke.on('key', function () {
                        const range = this.createRange();
                        if (limiter.getCharsCount() > limiter.maxLength) {
                            const editable = this.editable();
                            editable.setData(previousSnapshot, true);
                            range.moveToElementEditablePosition(editable, true);
                            cke.getSelection().selectRanges([range]);
                            return;
                        }
                        previousSnapshot = cke.getSnapshot();
                    });
                }
                cke.on('key', keyLimitHandler);
                cke.on('change', evt => {
                    patternHandler(evt);
                    _.defer(() => this.updateCounter());
                });
                cke.on('paste', nonKeyLimitHandler);
                // @todo: drop requires cke 4.5
                // cke.on('drop', nonKeyLimitHandler);
            } else {
                $textarea
                    .on('beforeinput.commonRenderer', handleBeforeInput)
                    .on('input.commonRenderer', () => {
                        _.defer(() => this.updateCounter());
                    })
                    .on('compositionstart.commonRenderer', handleCompositionStart)
                    .on('compositionend.commonRenderer', handleCompositionEnd)
                    .on('keyup.commonRenderer', patternHandler)
                    .on('keydown.commonRenderer', keyLimitHandler)
                    .on('paste.commonRenderer drop.commonRenderer', nonKeyLimitHandler);
            }
        },

        /**
         * Get the number of words that are actually written in the response field
         * @returns {Number} number of words
         */
        getWordsCount: function getWordsCount() {
            const value = _getTextareaValue(interaction) || '';
            if (_.isEmpty(value)) {
                return 0;
            }
            // leading and trailing white space don't qualify as words
            return value.trim().replace(/\s+/gi, ' ').split(' ').length;
        },

        /**
         * Get the number of characters that are actually written in the response field
         * @returns {Number} number of characters
         */
        getCharsCount: function getCharsCount() {
            const value = _getTextareaValue(interaction) || '';
            // remove NO-BREAK SPACE in empty lines added and all new line symbols
            return value.replace(/[\r\n]{1}\xA0[\r\n]{1}/gm, '\r').replace(/[\r\n]+/gm, '').length;
        },

        /**
         * Update the counter element
         */
        updateCounter: function udpateCounter() {
            $charsCounter.text(this.getCharsCount());
            $wordsCounter.text(this.getWordsCount());
        },
        maxLength
    };

    return limiter;
}

/**
 * return the value of the textarea or ckeditor data
 * @param  {Object} interaction
 * @param  {Boolean} raw Tells if the returned data does not have to be filtered (i.e. XHTML tags not removed)
 * @returns {String} the value
 */
function _getTextareaValue(interaction, raw) {
    if (_getFormat(interaction) === 'xhtml') {
        return _ckEditorData(interaction, raw);
    } else {
        return containerHelper.get(interaction).find('textarea').val();
    }
}

/**
 * Setting the pattern mask for the input, for browsers which doesn't support this feature
 * @param {jQuery} $element
 * @param {string} pattern
 */
function _setPattern($element, pattern) {
    const patt = new RegExp(pattern);

    //test when some data is entering in the input field
    //@todo plug the validator + tooltip
    $element.on('keyup.commonRenderer', function () {
        $element.removeClass('field-error');
        if (!patt.test($element.val())) {
            $element.addClass('field-error');
        }
    });
}

/**
 * Whether or not multiple strings are expected from the candidate to
 * compose a valid response.
 *
 * @param {Object} interaction - the extended text interaction model
 * @returns {Boolean} true if a multiple
 */
function _isMultiple(interaction) {
    const attributes = interaction.getAttributes();
    const response = interaction.getResponseDeclaration();
    return !!(
        attributes.maxStrings &&
        (response.attr('cardinality') === 'multiple' || response.attr('cardinality') === 'ordered')
    );
}

/**
 * Instantiate CkEditor for the interaction
 *
 * @param {Object} interaction - the extended text interaction model
 * @param {Object} [options= {}] - the CKEditor configuration options
 * @returns {Object} the ckEditor instance (or you'll be in trouble
 */
function _setUpCKEditor(interaction, options) {
    const $container = containerHelper.get(interaction);
    const editor = ckEditor.replace($container.find('.text-container')[0], options || {});
    if (editor) {
        $container.data('editor', editor.name);
        return editor;
    }
}

/**
 * Destroy CKEditor
 *
 * @param {Object} interaction - the extended text interaction model
 */
function _destroyCkEditor(interaction) {
    const $container = containerHelper.get(interaction);
    const name = $container.data('editor');
    let editor;
    if (name) {
        editor = ckEditor.instances[name];
    }
    if (editor) {
        editor.destroy();
        $container.removeData('editor');
    }
}

/**
 * Gets the CKEditor instance
 * @param {Object} interaction - the extended text interaction model
 * @returns {Object}  CKEditor instance
 */
function _getCKEditor(interaction) {
    const $container = containerHelper.get(interaction);
    const name = $container.data('editor');

    return ckEditor.instances[name];
}

/**
 * get the text content of the ckEditor ( not the entire html )
 * @param  {object} interaction the interaction
 * @param  {Boolean} raw Tells if the returned data does not have to be filtered (i.e. XHTML tags not removed)
 * @returns {string}             text content of the ckEditor
 */
function _ckEditorData(interaction, raw) {
    const editor = _getCKEditor(interaction);
    let data = (editor && editor.getData()) || '';

    if (!raw) {
        data = _stripTags(data);
    }

    return data;
}

/**
 * Remove HTML tags from a string
 * @param {String} str
 * @returns {String}
 */
function _stripTags(str) {
    const tempNode = document.createElement('div');
    tempNode.innerHTML = str;
    return tempNode.textContent;
}

/**
 * Get the interaction format
 * @param {Object} interaction - the extended text interaction model
 * @returns {String} format in 'plain', 'xhtml', 'preformatted'
 */
function _getFormat(interaction) {
    const format = interaction.attr('format');
    if (_.contains(['plain', 'xhtml', 'preformatted'], format)) {
        return format;
    }
    return 'plain';
}

function enable(interaction) {
    const $container = containerHelper.get(interaction);
    let editor;

    $container.find('input, textarea').removeAttr('disabled');

    if (_getFormat(interaction) === 'xhtml') {
        editor = _getCKEditor(interaction);
        if (editor) {
            if (editor.status === 'ready') {
                editor.setReadOnly(false);
            } else {
                editor.readOnly = false;
            }
        }
    }
}

function disable(interaction) {
    const $container = containerHelper.get(interaction);
    let editor;

    $container.find('input, textarea').attr('disabled', 'disabled');

    if (_getFormat(interaction) === 'xhtml') {
        editor = _getCKEditor(interaction);
        if (editor) {
            if (editor.status === 'ready') {
                editor.setReadOnly(true);
            } else {
                editor.readOnly = true;
            }
        }
    }
}

function clearText(interaction) {
    setText(interaction, '');
}

function setText(interaction, text) {
    const limiter = inputLimiter(interaction);
    if (_getFormat(interaction) === 'xhtml') {
        try {
            _getCKEditor(interaction).setData(text, function () {
                if (limiter.enabled) {
                    limiter.updateCounter();
                }
            });
        } catch (e) {
            logger.warn(`setText error ${e}!`);
        }
    } else {
        containerHelper.get(interaction).find('textarea').val(text);
        if (limiter.enabled) {
            limiter.updateCounter();
        }
    }
}

/**
 * Clean interaction destroy
 * @param {Object} interaction
 */
function destroy(interaction) {
    const $container = containerHelper.get(interaction);
    const $el = $container.find('input, textarea');

    if (_getFormat(interaction) === 'xhtml') {
        _destroyCkEditor(interaction);
    }

    //remove event
    $el.off('.commonRenderer');
    $(document).off('.commonRenderer');

    //remove instructions
    instructionMgr.removeInstructions(interaction);

    //remove all references to a cache container
    containerHelper.reset(interaction);
}

/**
 * Set the interaction state. It could be done anytime with any state.
 *
 * @param {Object} interaction - the interaction instance
 * @param {Object} state - the interaction state
 */
function setState(interaction, state) {
    if (_.isObject(state)) {
        if (state.response) {
            try {
                interaction.setResponse(state.response);
            } catch (e) {
                interaction.resetResponse();
                throw e;
            }
        }
    }
}

/**
 * Get the interaction state.
 *
 * @param {Object} interaction - the interaction instance
 * @returns {Object} the interaction current state
 */
function getState(interaction) {
    const state = {};
    const response = interaction.getResponse();

    if (response) {
        state.response = response;
    }
    return state;
}

/**
 * Hydrates the dataset for the interaction with respect to its attributes.
 *
 * @param {object} interaction - the interaction instance
 * @param {object} data - the default data object
 * @returns {object} the hydrated data set
 */
function getData(interaction, data) {
    const pattern = interaction.attr('patternMask');
    const maxWords = parseInt(patternMaskHelper.parsePattern(pattern, 'words'), 10);
    const maxLength = parseInt(patternMaskHelper.parsePattern(pattern, 'chars'), 10);
    const expectedLines = parseInt(interaction.attr('expectedLines'), 10);
    const expectedLength = !isNaN(expectedLines)
        ? expectedLines * 72
        : parseInt(interaction.attr('expectedLength'), 10);

    // Build DOM placeholders, this is needed to properly assemble the constraint hints
    // The interaction will later rely on this to bind the values
    const countChars = countTpl({ name: 'count-chars', value: 0 });
    const countWords = countTpl({ name: 'count-words', value: 0 });
    const countExpectedLength = countTpl({ name: 'count-expected-length', value: expectedLength });
    const countMaxLength = countTpl({ name: 'count-max-length', value: maxLength });
    const countMaxWords = countTpl({ name: 'count-max-words', value: maxWords });

    return _.merge(data || {}, {
        maxWords: !isNaN(maxWords) ? maxWords : 0,
        maxLength: !isNaN(maxLength) ? maxLength : 0,
        attributes: !isNaN(expectedLines) ? { expectedLength } : void 0,
        // Build the constraint hints from translated text and DOM placeholders
        // The template will render them as it, then the interaction will update the value from the binding
        constraintHints: {
            expectedLength: __('%s of %s characters recommended.', countChars, countExpectedLength),
            maxLength: __('%s of %s characters maximum.', countChars, countMaxLength),
            maxWords: __('%s of %s words maximum.', countWords, countMaxWords)
        }
    });
}

/**
 * Expose the common renderer for the extended text interaction
 * @exports qtiCommonRenderer/renderers/interactions/ExtendedTextInteraction
 */
export default {
    qtiClass: 'extendedTextInteraction',
    getContainer: containerHelper.get,
    template,
    render,
    setResponse,
    getResponse,
    getData,
    resetResponse,
    destroy,
    getState,
    setState,
    enable,
    disable,
    clearText,
    setText,
    inputLimiter
};
