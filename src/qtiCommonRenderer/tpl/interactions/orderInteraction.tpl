<div {{#if attributes.id}}id="{{attributes.id}}"{{/if}} class="qti-interaction qti-blockInteraction qti-orderInteraction{{#if horizontal}} qti-horizontal{{else}} qti-vertical{{/if}}{{#if attributes.class}} {{attributes.class}}{{/if}}{{#equal attributes.data-order 'single'}} qti-single{{/equal}}{{#equal attributes.order 'single'}} qti-single{{/equal}} qti-choices-{{position}}"
     data-serial="{{serial}}"
     data-qti-class="orderInteraction"
     data-orientation="{{#if horizontal}}horizontal{{else}}vertical{{/if}}"{{#if attributes.xml:lang}} lang="{{attributes.xml:lang}}"{{/if}}>
    {{#if prompt}}{{{prompt}}}{{/if}}
    <div class="instruction-container"></div>
    <div class="order-interaction-area">
        <ul class="choice-area square source solid block-listing {{#if horizontal}}horizontal{{/if}}">
            {{#choices}}{{{.}}}{{/choices}}
        </ul>
        <div class="arrow-bar middle">
            <span class="icon-add-to-selection {{arrowIcon}}"></span>
        </div>
        <ul class="drag-container block-listing"></ul>
        <ul class="result-area decimal target solid block-listing {{#if horizontal}}horizontal{{/if}}">
        </ul>
    </div>
    <div class="notification-container"></div>
</div>