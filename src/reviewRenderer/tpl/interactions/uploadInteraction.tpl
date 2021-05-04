<div class="qti-interaction qti-blockInteraction qti-uploadInteraction" data-serial="{{serial}}"{{#if attributes.xml:lang}} lang="{{attributes.xml:lang}}"{{/if}}>
	{{#if prompt}}{{{prompt}}}{{/if}}
    <div class="file-upload fixed-grid-row lft">
        <span class="file-name placeholder col-8 truncate"></span>
        <a class="btn-download btn-info small"><span class="icon-download"></span></a>
    </div>
    <div class="file-upload-preview lft visible-file-upload-preview runtime-visible-file-upload-preview">
        <p class="nopreview">{{__ 'No preview available'}}</p>
    </div>
</div>
