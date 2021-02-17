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
import _ from 'lodash';
import __ from 'i18n';

var uploadMime = {
    /**
     * @TODO these mime types are not up-to-date, in particular the MS ones
     * refer to http://filext.com/faq/office_mime_types.php
     * @type [{getMimeTypes: getMimeTypes}]
     */
    getMimeTypes: function getMimeTypes() {
        return [
            {
                mime: 'application/zip',
                label: __('ZIP archive'),
                equivalent: [
                    'application/x-compress',
                    'application/x-compressed',
                    'application/x-zip',
                    'application/x-zip-compressed',
                    'application/zip-compressed',
                    'application/x-7zip-compressed',
                ],
                extensions: ['zip', 'zipx']
            },
            {
                mime: 'text/plain',
                label: __('Plain text'),
                extensions: ['txt', 'bas']
            },
            {
                mime: 'application/pdf',
                label: __('PDF file'),
                equivalent: [
                    'application/acrobat',
                    'application/nappdf',
                    'application/x-pdf',
                    'application/vnd.pdf',
                    'text/pdf',
                    'text/x-pdf'
                ],
                extensions: ['pdf']
            },
            {
                mime: 'image/jpeg',
                label: __('JPEG image'),
                equivalent: ['image/pjpeg'],
                extensions: ['pjpeg', 'jfif', 'jpe', 'jpeg', 'jpg']
            },
            {
                mime: 'image/png',
                label: __('PNG image'),
                equivalent: ['image/x-png'],
                extensions: ['png']
            },
            {
                mime: 'image/gif',
                label: __('GIF image'),
                extensions: ['gif']
            },
            {
                mime: 'image/svg+xml',
                label: __('SVG image'),
                extensions: ['svg']
            },
            {
                mime: 'audio/mpeg',
                label: __('MPEG audio'),
                equivalent: [
                    'audio/mp3',
                    'audio/mpeg3',
                    'audio/mpg',
                    'audio/x-mp3',
                    'audio/x-mpeg',
                    'audio/x-mpeg3',
                    'audio/x-mpg'
                ],
                extensions: ['mp3']
            },
            {
                mime: 'audio/x-ms-wma',
                label: __('Windows Media audio'),
                extensions: ['wma']
            },
            {
                mime: 'audio/x-wav',
                label: __('WAV audio'),
                equivalent: ['audio/wav', 'audio/s-wav', 'audio/wave'],
                extensions: ['wav']
            },
            {
                mime: 'video/mpeg',
                label: __('MPEG video'),
                extensions: ['m1v', 'm2v', 'mp2', 'mpa', 'mpe', 'mpeg', 'mpg', 'mpv2']
            },
            {
                mime: 'video/mp4',
                label: __('MP4 video'),
                equivalent: ['video/mpeg4', 'video/x-m4v'],
                extensions: ['m4v']
            },
            {
                mime: 'video/quicktime',
                label: __('Quicktime video'),
                extensions: ['mov', 'qt', 'mqv']
            },
            {
                mime: 'video/x-ms-wmv',
                label: __('Windows Media video'),
                extensions: ['wmv']
            },
            {
                mime: 'video/x-flv',
                label: __('Flash video'),
                equivalent: ['.flv'],
                extensions: ['flv']
            },
            {
                mime: 'text/csv',
                label: __('CSV file'),
                equivalent: ['.csv', 'application/csv', 'text/comma-separated-values', 'text/x-comma-separated-values'],
                extensions: ['csv']
            },
            {
                mime: 'application/vnd.ms-word',
                label: __('Microsoft Word'),
                equivalent: [
                    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                    'application/vnd.openxmlformats-officedocument.wordprocessingml.template',
                    'application/vnd.ms-word.document.macroEnabled.12',
                    'application/vnd.ms-word.template.macroEnabled.12',
                    'application/doc',
                    'application/msword',
                    'application/msword-doc',
                    'application/vnd.msword',
                    'application/winword',
                    'application/word',
                    'application/x-msw6',
                    'application/x-msword',
                    'application/x-msword-doc'
                ],
                extensions: ['doc', 'docx', 'dot', 'docm', 'dotm', 'dotx']
            },
            {
                mime: 'application/vnd.ms-excel',
                label: __('Microsoft Excel'),
                equivalent: [
                    'application/excel',
                    'application/msexcel',
                    'application/msexcell',
                    'application/x-dos_ms_excel',
                    'application/x-excel',
                    'application/x-ms-excel',
                    'application/x-msexcel',
                    'application/x-xls',
                    'application/xls',
                    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                    'application/vnd.ms-excel.sheet.binary.macroEnabled.12',
                    'application/vnd.ms-excel.sheet.macroEnabled.12'
                ],
                extensions: ['xls', 'xlsx', 'xlsb', 'xlsm']
            },
            {
                mime: 'application/vnd.ms-powerpoint',
                label: __('Microsoft Powerpoint'),
                equivalent: [
                    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
                    'application/vnd.openxmlformats-officedocument.presentationml.slideshow',
                    'application/vnd.ms-powerpoint.presentation.macroEnabled.12',
                    'application/vnd.ms-powerpoint.slideshow.macroEnabled.12',
                    'application/ms-powerpoint',
                    'application/mspowerpoint',
                    'application/powerpoint',
                    'application/ppt',
                    'application/vnd-mspowerpoint',
                    'application/vnd_ms-powerpoint',
                    'application/x-mspowerpoint',
                    'application/x-powerpoint'
                ],
                extensions: ['ppt', 'pptm', 'pptx', 'ppsm', 'ppsx']
            },
            {
                mime: 'application/vnd.oasis.opendocument.text',
                label: __('OpenDocument text document'),
                equivalent: ['.odf'],
                extensions: ['odt']
            },
            {
                mime: 'application/vnd.oasis.opendocument.spreadsheet',
                label: __('OpenDocument spreadsheet document'),
                equivalent: ['.ods'],
                extensions: ['ods']
            },
            {
                mime: 'text/x-c',
                label: __('C++ file (.cpp)'),
                equivalent: ['.cpp', 'text/x-c++src'],
                extensions: ['cpp', 'c++']
            },
            {
                mime: 'text/x-csrc',
                label: __('C file'),
                equivalent: ['text/x-c'],
                extensions: ['c']
            },
            {
                mime: 'text/pascal',
                label: __('Pascal file (.pas)'),
                equivalent: ['.pas'],
                extensions: ['.pas']
            },
            {
                mime: 'video/avi',
                label: __('Audio Video Interleave'),
                equivalent: [
                    'application/x-troff-msvideo',
                    'image/avi',
                    'video/msvideo',
                    'video/x-msvideo',
                    'video/xmpg2'
                ],
                extensions: ['avi']
            },
            {
                mime: 'image/bmp',
                label: __('Bitmap image'),
                equivalent: [
                    'application/bmp',
                    'application/x-bmp',
                    'image/ms-bmp',
                    'image/x-bitmap',
                    'image/x-bmp',
                    'image/x-ms-bmp',
                    'image/x-win-bitmap',
                    'image/x-windows-bmp',
                    'image/x-xbitmap'
                ],
                extensions: ['bmp']
            },
            {
                mime: 'text/css',
                label: __('Cascading Style Sheets'),
                equivalent: ['application/css-stylesheet'],
                extensions: ['css']
            },
            {
                mime: 'image/x-emf',
                label: __('Enhanced metafile'),
                extensions: ['emf']
            },
            {
                mime: 'application/vnd.geogebra.file application-x/geogebra-file',
                label: __('Geogebra data file'),
                extensions: ['ggb']
            },
            {
                mime: 'text/x-h',
                label: __('Header file with extensions'),
                extensions: ['h']
            },
            {
                mime: 'application/hlp',
                label: __('Windows help file'),
                equivalent: ['application/x-helpfile', 'application/x-winhelp'],
                extensions: ['hlp']
            },
            {
                mime: 'text/html',
                label: __('Hypertext markup language'),
                extensions: ['htm', 'html']
            },
            {
                mime: 'application/x-javascript',
                label: __('Javascript code'),
                equivalent: ['application/javascript', 'application/ecmascript', 'text/javascript', 'text/ecmascript'],
                extensions: ['js']
            },
            {
                mime: 'application/octet-stream',
                label: __('Database file'),
                extensions: ['mdb']
            },
            {
                mime: 'image/vnd.ms-modi',
                label: __('Microsoft Office Document Imaging'),
                equivalent: [],
                extensions: ['mdi']
            },
            {
                mime: 'multipart/related',
                label: __('MIME encapsulation of aggregate HTML documents'),
                equivalent: ['message/rfc822', 'application/x-mimearchive'],
                extensions: ['mht']
            },
            {
                mime: 'application/base64',
                label: __('Mind mapping software application (free mind open source)'),
                equivalent: ['application/x-meme'],
                extensions: ['mm']
            },
            {
                mime: 'audio/m4a',
                label: __('MPEG-4 audio file'),
                equivalent: ['audio/x-m4a'],
                extensions: ['m4a']
            },
            {
                mime: 'video/x-sgi-movie',
                label: __('Storing digital video data on a computer game'),
                extensions: ['movie']
            },
            {
                mime: 'application/vnd.ms-project',
                label: __('Microsoft Project file'),
                equivalent: [
                    'application/mpp',
                    'application/msproj',
                    'application/msproject',
                    'application/x-dos_ms_project',
                    'application/x-ms-project',
                    'application/x-msproject'
                ],
                extensions: ['mpp']
            },
            {
                mime: 'application/vnd.oasis.opendocument.database',
                label: __('OpenDocument Database'),
                extensions: ['odb']
            },
            {
                mime: 'application/vnd.oasis.opendocument.presentation',
                label: __('OpenDocument Presentation'),
                extensions: ['odp']
            },
            {
                mime: 'application/vnd.oasis.opendocument.spreadsheet',
                label: __('OpenDocument Spreadsheet'),
                extensions: ['ods']
            },
            {
                mime: 'application/vnd.oasis.opendocument.text',
                label: __('OpenDocument Text'),
                extensions: ['odt']
            },
            {
                mime: 'application/vnd.oasis.opendocument.text-template',
                label: __('OpenDocument Text Template'),
                extensions: ['ott']
            },
            {
                mime: 'application/octet-stream',
                label: __('Flowchart-based programming environment'),
                extensions: ['rap']
            },
            {
                mime: 'application/vnd.rn-realmedia',
                label: __('RealMedia file'),
                extensions: ['rm']
            },
            {
                mime: 'application/rtf',
                label: __('Rich Text Format file'),
                equivalent: ['application/richtext', 'application/x-rtf', 'text/richtext', 'text/rtf'],
                extensions: ['rtf']
            },
            {
                mime: 'application/vnd.sun.xml.writer.template',
                label: __('Document templates (Staroffice)'),
                extensions: ['stw']
            },
            {
                mime: 'application/x-shockwave-flash',
                label: __('Adobe Flash file'),
                equivalent: ['application/futuresplash'],
                extensions: ['swf']
            },
            {
                mime: 'application/x-sibelius-score',
                label: __('Sibelius music notation'),
                extensions: ['sib']
            },
            {
                mime: 'application/tar',
                label: __('Compressed tar file'),
                equivalent: ['application/x-gtar', 'application/x-tar'],
                extensions: ['tar']
            },
            {
                mime: 'application/vnd.sun.xml.calc',
                label: __('Calc speadsheet (Staroffice)'),
                extensions: ['sxc']
            },
            {
                mime: 'application/vnd.sun.xml.writer',
                label: __('Text document file format (Staroffice)'),
                extensions: ['sxw']
            },
            {
                mime: 'application/x-tex',
                label: __('TeX file'),
                equivalent: ['text/x-tex'],
                extensions: ['']
            },
            {
                mime: 'image/tiff',
                label: __('Tagged image file'),
                equivalent: [
                    'application/tif',
                    'application/tiff',
                    'application/x-tif',
                    'application/x-tiff',
                    'image/tif',
                    'image/x-tif',
                    'image/x-tiff'
                ],
                extensions: ['tif', 'tiff']
            },
            {
                mime: 'application/vnd.visio',
                label: __('Microsoft Visio file'),
                equivalent: [
                    'application/visio',
                    'application/visio.drawing',
                    'application/vsd',
                    'application/x-visio',
                    'application/x-vsd',
                    'image/x-vsd'
                ],
                extensions: ['vsd']
            },
            {
                mime: 'application/vnd.ms-works',
                label: __('Microsoft Works file (spreadsheet)'),
                equivalent: ['application/x-msworks-wp'],
                extensions: ['wks']
            },
            {
                mime: 'image/x-wmf',
                label: __('Windows Media file (metafile)'),
                equivalent: [
                    'application/wmf',
                    'application/x-msmetafile',
                    'application/x-wmf',
                    'image/wmf',
                    'image/x-win-metafile'
                ],
                extensions: ['wmf']
            },
            {
                mime: 'application/vnd.ms-works',
                label: __('Microsoft Works file (processor file)'),
                equivalent: ['application/x-msworks-wp'],
                extensions: ['wps']
            },
            {
                mime: 'application/x-mswrite',
                label: __('Write Document'),
                extensions: ['wri']
            },
            {
                mime: 'text/xml',
                label: __('XML file'),
                equivalent: ['application/x-xml', 'application/xml'],
                extensions: ['xml']
            },
            {
                mime: 'application/vnd.ms-xpsdocument',
                label: __('Microsoft XPS file'),
                extensions: ['xps']
            },
            {
                mime: 'application/x-7z-compressed',
                label: __('7-zip archive'),
                extensions: ['7z']
            },
            {
                mime: 'application/gzip',
                label: __('GZip Compressed Archive'),
                equivalent: [
                    'application/gzip-compressed',
                    'application/gzipped',
                    'application/x-gunzip',
                    'application/x-gzip'
                ],
                extensions: ['gz']
            },
            {
                mime: 'application/vnd.rar',
                label: __('RAR archive'),
                equivalent: ['application/rar', 'application/x-rar-compressed'],
                extensions: ['rar']
            },
            {
                mime: 'application/tar',
                label: __('Tape Archive (TAR)'),
                equivalent: ['application/x-gtar', 'application/x-tar'],
                extensions: ['tar']
            },
            {
                mime: 'application/x-compress',
                label: __('UNIX Compressed Archive File'),
                equivalent: ['application/z', 'application/x-z'],
                extensions: ['z']
            }
        ];
    },

    /**
     * Set the expected types in the format according to the number of types
     *
     * @param {Object} interaction
     * @param {Array} types
     */
    setExpectedTypes: function setExpectedTypes(interaction, types) {
        var classes = interaction.attr('class') || '';
        classes = classes.replace(/x-tao-upload-type-[-_a-zA-Z+.0-9]*/g, '').trim();
        interaction.attr('class', classes);
        interaction.removeAttr('type');

        if (!types) {
            return;
        }

        if (types.length === 1) {
            //if there is only one value set into the qti standard type attribute
            if (types[0] !== 'any/kind') {
                interaction.attr('type', types[0]);
            }
        } else {
            //if there is more than one value, set into into TAO specific css classes
            //qti 2.1 xsd indeed does not allow comma-separated multi mime type value for the attribute "type
            interaction.attr(
                'class',
                _.reduce(
                    types,
                    function(acc, selectedType) {
                        return acc + ' x-tao-upload-type-' + selectedType.replace('/', '_');
                    },
                    classes
                ).trim()
            );
        }
    },

    /**
     * Return the array of authorized mime types
     * It first get the standard "type" attribute value.
     * If not set search the TAO specific type information recorded in the class attributes,
     * qti 2.1 xsd indeed does not allow comma-separated multi mime type value for the attribute "type"
     * @param {Object} interaction - standard QTI interaction model object
     * @param {Boolean} [includeEquivalents] - enable including all recognized as equivalent types
     * @returns {Array}
     */
    getExpectedTypes: function getExpectedTypes(interaction, includeEquivalents) {
        var classes = interaction.attr('class') || '';
        var types = [];
        var mimes;
        var equivalents = [];
        if (interaction.attr('type')) {
            types.push(interaction.attr('type'));
        } else {
            classes.replace(/x-tao-upload-type-([-_a-zA-Z+.0-9]*)/g, function($0, type) {
                types.push(type.replace('_', '/').trim());
            });
        }

        // add in equivalent mimetypes to the list of expected types
        if (includeEquivalents === true) {
            mimes = uploadMime.getMimeTypes();
            _.forEach(types, function(mime) {
                var mimeData = _.find(mimes, { mime: mime });
                if (mimeData && _.isArray(mimeData.equivalent)) {
                    equivalents = _.union(equivalents, mimeData.equivalent);
                }
            });
        }

        return _.union(types, equivalents);
    }
};

export default uploadMime;
