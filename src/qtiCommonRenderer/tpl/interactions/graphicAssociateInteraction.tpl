<div {{#if attributes.id}}id="{{attributes.id}}"{{/if}} class="qti-interaction qti-blockInteraction qti-graphicInteraction qti-graphicAssociateInteraction clearfix{{#if attributes.class}} {{attributes.class}}{{/if}}" data-serial="{{serial}}"{{#if attributes.xml:lang}} lang="{{attributes.xml:lang}}"{{/if}}>
    {{#if prompt}}{{{prompt}}}{{/if}}
    <div class="instruction-container"></div>
    <div class="image-editor solid">
        <div id='graphic-paper-{{serial}}' class="main-image-box"></div>
    </div>
</div>
