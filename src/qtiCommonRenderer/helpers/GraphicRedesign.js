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
 * Copyright (c) 2015-2023 (original work) Open Assessment Technologies SA ;
 */

/**
 * @author Bertrand Chevrier <bertrand@taotesting.com>
 */

import $ from 'jquery';
import _ from 'lodash';
import raphael from 'raphael';
import scaleRaphael from 'scale.raphael';
import { gstyle } from 'taoQtiItem/qtiCommonRenderer/renderers/graphic-style-redesign';

// extend raphael
raphael.fn.elFromTagName = function (tagName, attrs, raphType) {
    const node = document.createElementNS('http://www.w3.org/2000/svg', tagName);
    const paper = this; // eslint-disable-line consistent-this
    paper.canvas && paper.canvas.appendChild(node);
    const raphEl = new raphael.el.constructor(node, paper);
    raphEl.type = raphType || tagName; //to get bbox(); maybe smth else
    if (attrs && Object.keys(attrs).length) {
        raphEl.attr(attrs);
    }
    return raphEl;
};
/**
 * NB! Please create child elements *before* group, or el.next/el.prev and paper.top/paper.bottom might get messed up
 * @param {*} attrs
 * @returns
 */
raphael.fn.group = function (attrs) {
    const raphEl = this.elFromTagName('g', attrs, 'set');

    const paper = this; // eslint-disable-line consistent-this
    raphEl.childrenSet = paper.set();

    const originalRemove = raphEl.remove;
    raphEl.remove = function () {
        this.childrenSet.forEach(childRaphEl => childRaphEl.remove());
        this.childrenSet.clear();
        originalRemove.apply(this);
    };

    return raphEl;
};

raphael.el.appendChild = function (childRaphEl) {
    this.node.appendChild(childRaphEl.node);

    if (this.childrenSet) {
        this.childrenSet.push(childRaphEl);
    }
};

const hotspotStates = {
    basic: 'basic',
    active: 'active',
    selectable: 'selectable',
    error: 'error'
};

//maps the QTI shapes to Raphael shapes
const shapeMap = {
    default: 'rect',
    poly: 'path'
};

//length constraints to validate coords
const coordsValidator = {
    rect: 4,
    ellipse: 4,
    circle: 3,
    poly: 6,
    default: 0
};

//transform the coords from the QTI system to Raphael system
const qti2raphCoordsMapper = {
    /**
     * Rectangle coordinate mapper:  from left-x,top-y,right-x-bottom-y to x,y,w,h
     * @param {Array} coords - QTI coords
     * @returns {Array} raphael coords
     */
    rect: function (coords) {
        return [coords[0], coords[1], coords[2] - coords[0], coords[3] - coords[1]];
    },

    /**
     * Creates the coords for a default shape (a rectangle that covers all the paper)
     * @param {Raphael.Paper} paper - the paper
     * @returns {Array} raphael coords
     */
    default: function (paper) {
        return [0, 0, paper.width, paper.height];
    },

    /**
     * polygone coordinate mapper:  from x1,y1,...,xn,yn to SVG path format
     * @param {Array} coords - QTI coords
     * @returns {Array} path desc
     */
    poly: function (coords) {
        let a;
        const size = coords.length;

        // autoClose if needed
        if (coords[0] !== coords[size - 2] && coords[1] !== coords[size - 1]) {
            coords.push(coords[0]);
            coords.push(coords[1]);
        }

        // move to first point
        coords[0] = 'M' + coords[0];

        for (a = 1; a < size; a++) {
            if (a % 2 === 0) {
                coords[a] = 'L' + coords[a];
            }
        }

        return [coords.join(' ')];
    }
};

//transform the coords from a raphael shape to the QTI system
const raph2qtiCoordsMapper = {
    /**
     * Rectangle coordinate mapper: from x,y,w,h to left-x,top-y,right-x-bottom-y
     * @param {Object} attr - Raphael Element's attributes
     * @returns {Array} qti based coords
     */
    rect: function (attr) {
        return [attr.x, attr.y, attr.x + attr.width, attr.y + attr.height];
    },

    /**
     * Circle coordinate mapper
     * @param {Object} attr - Raphael Element's attributes
     * @returns {Array} qti based coords
     */
    circle: function (attr) {
        return [attr.cx, attr.cy, attr.r];
    },

    /**
     * Ellispe coordinate mapper
     * @param {Object} attr - Raphael Element's attributes
     * @returns {Array} qti based coords
     */
    ellipse: function (attr) {
        return [attr.cx, attr.cy, attr.rx, attr.ry];
    },

    /**
     * Get the coords for a default shape (a rectangle that covers all the paper)
     * @param {Object} attr - Raphael Element's attributes
     * @returns {Array} qti based coords
     */
    default: function (attr) {
        return this.rect(attr);
    },

    /**
     * polygone coordinate mapper:  from SVG path (available as segments) to x1,y1,...,xn,yn format
     * @param {Raphael.Paper} paper - the paper
     * @returns {Array} raphael coords
     */
    path: function (attr) {
        const poly = [];
        let i;

        if (_.isArray(attr.path)) {
            for (i = 1; i < attr.path.length; i++) {
                if (attr.path[i].length === 3) {
                    poly.push(attr.path[i][1]);
                    poly.push(attr.path[i][2]);
                }
            }
        }

        return poly;
    }
};

const clipPathSetter = {
    // raphael coords
    rect: function (raphEl) {
        raphEl.node.style.clipPath = `fill-box`;
    },

    circle: function (raphEl, coords) {
        raphEl.node.style.clipPath = `circle(${coords[2]}px)`;
    },

    ellipse: function (raphEl, coords) {
        raphEl.node.style.clipPath = `ellipse(${coords[2]}px ${coords[3]}px)`;
    },

    default: function (raphEl, coords) {
        return this.rect(raphEl, coords);
    },

    poly: function (raphEl, coords, clipPathDefId) {
        raphEl.node.setAttribute('clip-path', `url(#${clipPathDefId})`);
    }
};

const clipPathDefSetter = {
    // raphael coords
    poly: function (paper, coords) {
        return prepareClipPathDef(paper, `<path d="${coords[0]}" />`);
    }
};

function prepareClipPathDef(paper, clipPathHtml) {
    const defsElId = 'defs-el';
    let defsEl = paper.getById(defsElId);
    if (!defsEl) {
        defsEl = paper.elFromTagName('defs');
        defsEl.id = defsElId;
        defsEl.toBack();
    }
    const id = `clip-${defsEl.node.children.length}`;
    const clipPathEl = paper.elFromTagName('clipPath');
    clipPathEl.node.innerHTML = clipPathHtml;
    clipPathEl.node.id = id;
    defsEl.appendChild(clipPathEl);
    return id;
}

function getSelectableStateTransform(raphEl) {
    const diff = 8; //px
    const bbox = raphEl.getBBox();
    const scaleX = (bbox.width + diff) / bbox.width;
    const scaleY = (bbox.height + diff) / bbox.height;
    return Math.min(scaleX, scaleY);
}

function removeDefaultStyle(raphEl) {
    const node = raphEl.node;
    node.removeAttribute('stroke');
    node.removeAttribute('stroke-width');
    node.removeAttribute('fill');
    node.removeAttribute('stroke-dasharray');
}

/**
 * Graphic interaction helper
 * @exports qtiCommonRenderer/helpers/Graphic
 */
const GraphicHelper = {
    /**
     * Raw access to the styles
     * @type {Object}
     */
    _style: gstyle,

    /**
     * Apply the style defined by name to the element
     * @param {Raphael.Element} element - the element to change the state
     * @param {String} state - the name of the state (from states) to switch to
     */
    setStyle: function (element, name) {
        if (element && gstyle[name]) {
            element.attr(gstyle[name]);
        }
    },

    /**
     * Create a Raphael paper with a bg image, that is width responsive
     * @param {String} id - the id of the DOM element that will contain the paper
     * @param {String} serial - the interaction unique indentifier
     * @param {Object} options - the paper parameters
     * @param {String} options.img - the url of the background image
     * @param {jQueryElement} [options.container] - the parent of the paper element (got the closest parent by default)
     * @param {Boolean} [options.responsive] - scale to container
     * @param {Number} [options.width] - the paper width
     * @param {Number} [options.height] - the paper height
     * @param {String} [options.imgId] - an identifier for the image element
     * @param {Function} [options.done] - executed once the image is loaded
     * @returns {Raphael.Paper} the paper
     */
    responsivePaper: function (id, serial, options) {
        const $container = options.container || $('#' + id).parent();
        const $editor = $('.image-editor', $container);
        const $body = $container.closest('.qti-itemBody');
        const resizer = _.throttle(resizePaper, 10);

        const imgWidth = options.width || $container.innerWidth();
        const imgHeight = options.height || $container.innerHeight();

        const paper = scaleRaphael(id, imgWidth, imgHeight);
        const image = paper.image(options.img, 0, 0, imgWidth, imgHeight);
        image.id = options.imgId || image.id;
        paper.setViewBox(0, 0, imgWidth, imgHeight);
        paper.scale = 1;

        resizer();

        //retry to resize once the SVG is loaded
        $(image.node).attr('externalResourcesRequired', 'true').on('load', resizer);

        if (raphael.type === 'SVG') {
            // TODO: move listeners somewhere they can be easily turned off
            $(window).on('resize.qti-widget.' + serial, resizer);
            // TODO: favor window resize event and deprecate $container resive event (or don't allow $container to be destroyed and rebuilt
            $container.on('resize.qti-widget.' + serial, resizer);
            $(document).on('customcssloaded.styleeditor', resizer);
        } else {
            $container.find('.main-image-box').width(imgWidth);
            if (typeof options.resize === 'function') {
                options.resize(imgWidth, 1);
            }
        }

        /**
         * scale the raphael paper
         * @private
         */
        function resizePaper(e, givenWidth) {
            let containerWidth;

            if (e) {
                e.stopPropagation();
            }

            const diff = $editor.outerWidth() - $editor.width() + ($container.outerWidth() - $container.width()) + 1;
            const maxWidth = $body.width();
            if (options.responsive) {
                containerWidth = $container.innerWidth();
            } else {
                containerWidth = $editor.innerWidth();
            }

            if ((options.responsive && containerWidth > 0) || givenWidth > 0 || containerWidth > maxWidth) {
                if (options.responsive) {
                    if (givenWidth < containerWidth && givenWidth < maxWidth) {
                        containerWidth = givenWidth - diff;
                    } else if (containerWidth > maxWidth) {
                        containerWidth = maxWidth - diff;
                    } else {
                        containerWidth -= diff;
                    }
                } else {
                    if (givenWidth > 0 && givenWidth < maxWidth) {
                        containerWidth = givenWidth;
                    } else if (containerWidth > maxWidth) {
                        containerWidth = maxWidth;
                    }
                }

                const factor = containerWidth / imgWidth;
                const containerHeight = imgHeight * factor;

                if (containerWidth > 0) {
                    paper.changeSize(containerWidth, containerHeight, false, false);

                    paper.scale = paper.width / paper.canvas.viewBox.baseVal.width;
                    paper.canvas.style.setProperty('--paper-scale', paper.scale);
                }

                if (typeof options.resize === 'function') {
                    options.resize(containerWidth, factor);
                }
            }
            $container.trigger('resized.qti-widget');
        }

        return paper;
    },

    /**
     * Create a new Element into a raphael paper
     * @param {Raphael.Paper} paper - the interaction paper
     * @param {String} type - the shape type
     * @param {String|Array.<Number>} coords - qti coords as a string or an array of number
     * @param {Object} [options] - additional creation options
     * @param {String} [options.id] - to set the new element id
     * @param {String} [options.style = basic] - to default style
     * @param {Boolean} [options.hover = true] - to disable the default hover state
     * @param {Boolean} [options.touchEffect = true] - a circle appears on touch
     * @param {Boolean} [options.qtiCoords = true] - if the coords are in QTI format
     * @param {String} [options.class="hotspot"] - css class for <g>
     * @returns {Raphael.Element} the created element
     */
    createElement: function (paper, type, coords, options) {
        const self = this;
        let groupEl;
        const shaper = shapeMap[type] ? paper[shapeMap[type]] : paper[type];
        const shapeCoords = options.qtiCoords !== false ? self.raphaelCoords(paper, type, coords) : coords;
        const stateCls = options.style || hotspotStates.basic;

        if (typeof shaper === 'function') {
            try {
                let clipPathDefId;
                if (clipPathDefSetter[type]) {
                    clipPathDefId = clipPathDefSetter[type](paper, shapeCoords);
                }

                groupEl = paper.group({ class: `hotspot ${stateCls}` });

                const innerEl = shaper.apply(paper, shapeCoords).attr({ class: 'hotspot-inner' });
                removeDefaultStyle(innerEl);
                groupEl.appendChild(innerEl);

                const outerEl = shaper.apply(paper, shapeCoords).attr({ class: 'hotspot-outer' });
                removeDefaultStyle(outerEl);
                groupEl.appendChild(outerEl);

                clipPathSetter[type](groupEl, shapeCoords, clipPathDefId);
                if (options.id) {
                    groupEl.id = options.id;
                }
            } catch (err) {
                console.error(err);
                throw err;
            }
        } else {
            throw new Error('Unable to find method ' + type + ' on paper');
        }

        return groupEl;
    },

    /**
     * Get the Raphael coordinate from QTI coordinate
     * @param {Raphael.Paper} paper - the interaction paper
     * @param {String} type - the shape type
     * @param {String|Array.<Number>} coords - qti coords as a string or an array of number
     * @returns {Array} the arguments array of coordinate to give to the approriate raphael shapre creator
     */
    raphaelCoords: function raphaelCoords(paper, type, coords) {
        let shapeCoords;

        if (_.isString(coords)) {
            coords = _.map(coords.split(','), function (coord) {
                return parseInt(coord, 10);
            });
        }

        if (!_.isArray(coords) || coords.length < coordsValidator[type]) {
            throw new Error('Invalid coords ' + JSON.stringify(coords) + '  for type ' + type);
        }

        switch (type) {
            case 'rect':
                shapeCoords = qti2raphCoordsMapper.rect(coords);
                break;
            case 'default':
                shapeCoords = qti2raphCoordsMapper['default'].call(null, paper);
                break;
            case 'poly':
                shapeCoords = qti2raphCoordsMapper.poly(coords);
                break;
            default:
                shapeCoords = coords;
                break;
        }

        return shapeCoords;
    },

    /**
     * Get the QTI coordinates from a Raphael Element
     * @param {Raphael.Element} element - the shape to get the coords from
     * @param {Raphael.Element} paper - the interaction paper
     * @param {number} width - width of background image
     * @returns {String} the QTI coords
     */
    qtiCoords: function qtiCoords(element, paper, width) {
        const mapper = raph2qtiCoordsMapper[element.type];
        let result = '';
        const factor = paper && width ? width / paper.w : 1;

        if (_.isFunction(mapper)) {
            result = _.map(mapper.call(raph2qtiCoordsMapper, element.attr()), function (coord) {
                return Math.round(coord * factor);
            }).join(',');
        }

        return result;
    },

    /**
     * Update the visual state of an Element
     * @param {Raphael.Element} element - the element to change the state
     * @param {String} state - the name of the state (from states) to switch to
     */
    updateElementState: function (element, state) {
        if (element) {
            if (state === hotspotStates.active) {
                const scale = getSelectableStateTransform(element);
                element.animate({ transform: `s${scale}` }, 100, 'linear');
            } else if (element.node.classList.contains(hotspotStates.active)) {
                element.animate({ transform: '' }, 100, 'linear');
            }
            element.attr({ class: `hotspot ${state}` });
        }
    },

    /**
     * Highlight an element with the error style
     * @param {Raphael.Element} element - the element to hightlight
     * @param {String} [restorState = 'basic'] - the state to restore the elt into after flash
     */
    highlightError: function (element, restoredState) {
        if (element) {
            element.flashing = true;
            this.updateElementState(element, 'error');
            _.delay(() => {
                this.updateElementState(element, restoredState || 'basic');
                element.flashing = false;
            }, 800);
        }
    },

    /**
     * Trigger an event already bound to a raphael element
     * @param {Raphael.Element} element
     * @param {String} event - the event name
     *
     */
    trigger: function (element, event) {
        const evt = element.events.filter(el => el.name === event);
        if (evt.length && evt[0] && typeof evt[0].f === 'function') {
            evt[0].f.apply(element, Array.prototype.slice.call(arguments, 2));
        }
    }
};

export default GraphicHelper;
