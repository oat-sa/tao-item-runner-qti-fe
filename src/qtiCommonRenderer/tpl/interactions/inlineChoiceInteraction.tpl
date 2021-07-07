<div role="listbox" {{#if attributes.id}}id="{{attributes.id}}"{{/if}} class="qti-interaction qti-inlineInteraction qti-inlineChoiceInteraction{{#if attributes.class}} {{attributes.class}}{{/if}}"
        data-serial="{{serial}}"
        data-qti-class="inlineChoiceInteraction"
        data-has-search="false"
        {{#if attributes.xml:lang}} lang="{{attributes.xml:lang}}"{{/if}}
>
    <div role="option" data-identifier="empty"></div>
    {{#choices}}{{{.}}}{{/choices}}
</div>
