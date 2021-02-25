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
 * Copyright (c) 2021 (original work) Open Assessment Technologies SA;
 */

import __ from 'i18n';

export default {
    getList: function getList() {
        return [
            {
                mime: 'application/zip',
                label: __('ZIP archive'),
                equivalent: ['.zipx']
            },
            {
                mime: 'text/plain',
                label: __('Plain text')
            },
            {
                mime: 'application/pdf',
                label: __('PDF file')
            },
            {
                mime: 'image/jpeg',
                label: __('JPEG image'),
                equivalent: ['.jpe']
            },
            {
                mime: 'image/png',
                label: __('PNG image')
            },
            {
                mime: 'image/gif',
                label: __('GIF image')
            },
            {
                mime: 'image/svg+xml',
                label: __('SVG image')
            },
            {
                mime: 'audio/mpeg',
                label: __('MPEG audio')
            },
            {
                mime: 'audio/x-ms-wma',
                label: __('Windows Media audio')
            },
            {
                mime: 'audio/x-wav',
                label: __('WAV audio'),
                equivalent: ['audio/wav']
            },
            {
                mime: 'video/mpeg',
                label: __('MPEG video')
            },
            {
                mime: 'video/mp4',
                label: __('MP4 video')
            },
            {
                mime: 'video/quicktime',
                label: __('Quicktime video'),
                equivalent: ['.qt']
            },
            {
                mime: 'video/x-ms-wmv',
                label: __('Windows Media video')
            },
            {
                mime: 'video/x-flv',
                label: __('Flash video'),
                equivalent: ['.flv']
            },
            {
                mime: 'text/csv',
                label: __('CSV file'),
                equivalent: ['.csv']
            },
            {
                mime: 'application/msword',
                label: __('Microsoft Word'),
                equivalent: [
                    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                    'application/vnd.ms-word.document.macroEnabled.12',
                    'application/vnd.ms-word.template.macroEnabled.12',
                    'application/vnd.openxmlformats-officedocument.wordprocessingml.template',
                    '.doc',
                    '.docx',
                    '.dot',
                    '.docm',
                    '.dotm',
                    '.dotx'
                ]
            },
            {
                mime: 'application/vnd.ms-excel',
                label: __('Microsoft Excel'),
                equivalent: [
                    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                    'application/vnd.ms-excel.sheet.binary.macroEnabled.12',
                    'application/vnd.ms-excel.sheet.macroEnabled.12',
                    '.xlsb',
                    '.xlsm'
                ]
            },
            {
                mime: 'application/vnd.ms-powerpoint',
                label: __('Microsoft Powerpoint'),
                equivalent: [
                    'application/vnd.ms-powerpoint.slideshow.macroEnabled.12',
                    'application/vnd.openxmlformats-officedocument.presentationml.slideshow',
                    'application/vnd.ms-powerpoint.presentation.macroEnabled.12',
                    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
                    '.ppt',
                    '.pptm',
                    '.pptx',
                    '.ppsm',
                    '.ppsx'
                ]
            },
            {
                mime: 'application/vnd.oasis.opendocument.text',
                label: __('OpenDocument text document'),
                equivalent: ['.odt']
            },
            {
                mime: 'application/vnd.oasis.opendocument.spreadsheet',
                label: __('OpenDocument spreadsheet document'),
                equivalent: ['.ods']
            },
            {
                mime: 'text/x-c',
                label: __('C++ file (.cpp)'),
                equivalent: ['.cpp']
            },
            {
                mime: 'text/x-csrc',
                label: __('C file'),
                equivalent: ['text/plain', '.c']
            },
            {
                mime: 'text/pascal',
                label: __('Pascal file (.pas)'),
                equivalent: ['.pas']
            },
            {
                mime: 'video/avi',
                label: __('Audio Video Interleave')
            },
            {
                mime: 'image/bmp',
                label: __('Bitmap image')
            },
            {
                mime: 'text/css',
                label: __('Cascading Style Sheets')
            },
            {
                mime: 'image/x-emf',
                label: __('Enhanced metafile')
            },
            {
                mime: 'application/vnd.geogebra.file',
                label: __('Geogebra data file'),
                equivalent: ['.ggb']
            },
            {
                mime: 'text/x-h',
                label: __('Header file with extensions'),
                equivalent: ['text/plain', '.h']
            },
            {
                mime: 'application/winhlp',
                label: __('Windows help file'),
                equivalent: ['.hlp']
            },
            {
                mime: 'text/html',
                label: __('Hypertext markup language')
            },
            {
                mime: 'text/javascript',
                label: __('Javascript code')
            },
            {
                mime: 'application/vnd.ms-access',
                label: __('Database file'),
                equivalent: ['.mdb']
            },
            {
                mime: 'image/vnd.ms-modi',
                label: __('Microsoft Office Document Imaging'),
                equivalent: ['.mdi']
            },
            {
                mime: 'multipart/related',
                label: __('MIME encapsulation of aggregate HTML documents')
            },
            {
                mime: 'application/base64',
                label: __('Mind mapping software application (free mind open source)'),
                equivalent: ['.mm']
            },
            {
                mime: 'audio/x-m4a',
                label: __('MPEG-4 audio file')
            },
            {
                mime: 'video/x-sgi-movie',
                label: __('Storing digital video data on a computer game'),
                equivalent: ['.movie']
            },
            {
                mime: 'application/vnd.ms-project',
                label: __('Microsoft Project file'),
                equivalent: ['.mpp']
            },
            {
                mime: 'application/vnd.oasis.opendocument.database',
                label: __('OpenDocument Database'),
                equivalent: ['.odb']
            },
            {
                mime: 'application/vnd.oasis.opendocument.presentation',
                label: __('OpenDocument Presentation'),
                equivalent: ['.odp']
            },
            {
                mime: 'application/vnd.oasis.opendocument.text-template',
                label: __('OpenDocument Text Template'),
                equivalent: ['.ott']
            },
            {
                mime: 'application/octet-stream',
                label: __('Flowchart-based programming environment & TI Interactive Workbook'),
                equivalent: ['.rap', '.tii']
            },
            {
                mime: 'application/vnd.rn-realmedia',
                label: __('RealMedia file'),
                equivalent: ['.rm']
            },
            {
                mime: 'application/rtf',
                label: __('Rich Text Format file'),
                equivalent: ['.rtf']
            },
            {
                mime: 'application/vnd.sun.xml.writer.template',
                label: __('Document templates (Staroffice)'),
                equivalent: ['.stw']
            },
            {
                mime: 'application/x-shockwave-flash',
                label: __('Adobe Flash file')
            },
            {
                mime: 'application/x-sibelius-score',
                label: __('Sibelius music notation'),
                equivalent: ['.sib']
            },
            {
                mime: 'application/x-tar',
                label: __('Compressed tar file')
            },
            {
                mime: 'application/vnd.sun.xml.calc',
                label: __('Calc speadsheet (Staroffice)'),
                equivalent: ['.sxc']
            },
            {
                mime: 'application/vnd.sun.xml.writer',
                label: __('Text document file format (Staroffice)'),
                equivalent: ['.sxw']
            },
            {
                mime: 'application/x-tex',
                label: __('TeX file'),
                equivalent: ['.tex']
            },
            {
                mime: 'image/tiff',
                label: __('Tagged image file')
            },
            {
                mime: 'application/vnd.visio',
                label: __('Microsoft Visio file'),
                equivalent: ['.vsd']
            },
            {
                mime: 'application/vnd.ms-works',
                label: __('Microsoft Works file'),
                equivalent: ['.wks', '.wps']
            },
            {
                mime: 'image/x-wmf',
                label: __('Windows Media file (metafile)')
            },
            {
                mime: 'application/x-mswrite',
                label: __('Write Document'),
                equivalent: ['.wri']
            },
            {
                mime: 'text/xml',
                label: __('XML file')
            },
            {
                mime: 'application/vnd.ms-xpsdocument',
                label: __('Microsoft XPS file'),
                equivalent: ['.xps']
            },
            {
                mime: 'application/x-7z-compressed',
                label: __('7-zip archive'),
                equivalent: ['.7z']
            },
            {
                mime: 'application/x-gzip',
                label: __('GZip Compressed Archive')
            },
            {
                mime: 'application/x-rar-compressed',
                label: __('RAR archive'),
                equivalent: ['.rar']
            },
            {
                mime: 'application/x-tar',
                label: __('Tape Archive (TAR)')
            },
            {
                mime: 'application/x-compress',
                label: __('UNIX Compressed Archive File')
            }
        ];
    }
};
