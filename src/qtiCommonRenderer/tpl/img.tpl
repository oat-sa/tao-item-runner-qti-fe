<qh5:figure
    id="figureImg"
    data-serial="{{serial}}"
    data-qti-class="img"
>
<img
    src="{{attributes.src}}"
    alt="{{attributes.alt}}"
    {{#if attributes.id}}id="{{attributes.id}}"{{/if}}
    {{#if attributes.class}}class="{{attributes.class}}"{{/if}}
    {{#if attributes.height}}height="{{attributes.height}}" {{/if}}
    {{#if attributes.width}}width="{{attributes.width}}" {{/if}}
    {{#if attributes.xml:lang}} lang="{{attributes.xml:lang}}"{{/if}}
    {{#if attributes.[aria-describedby]}} aria-describedby="{{attributes.[aria-describedby]}}"{{/if}}
    {{#if attributes.[aria-hidden]}} aria-hidden="{{attributes.[aria-hidden]}}"{{/if}}
    {{#if attributes.[aria-label]}} aria-label="{{attributes.[aria-label]}}"{{/if}}
    {{#if attributes.[aria-labelledby]}} aria-labelledby="{{attributes.[aria-labelledby]}}"{{/if}}
    {{#if attributes.[aria-live]}} aria-live="{{attributes.[aria-live]}}"{{/if}}
    {{#if attributes.role}} role="{{attributes.role}}"{{/if}}
    />
{{#if attributes.figcaption}}
<qh5:figcaption>{{attributes.figcaption}}</qh5:figcaption>
</qh5:figure>{{/if}}
