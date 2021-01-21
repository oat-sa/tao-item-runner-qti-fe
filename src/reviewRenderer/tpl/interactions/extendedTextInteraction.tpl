<div {{#if attributes.id}}id="{{attributes.id}}"{{/if}} class="qti-interaction qti-blockInteraction qti-extendedTextInteraction{{#if attributes.class}} {{attributes.class}}{{/if}}" data-serial="{{serial}}" data-qti-class="extendedTextInteraction"{{#if attributes.xml:lang}} lang="{{attributes.xml:lang}}"{{/if}}>
    {{#if prompt}}{{{prompt}}}{{/if}}
    <div class="instruction-container"></div>
    {{#if multiple}}
        {{#equal attributes.format "xhtml"}}
            {{#each maxStringLoop}}
                <pre class="text-container text-{{attributes.format}} solid{{#if attributes.class}} attributes.class{{/if}}" name="{{attributes.identifier}}_{{this}}" contenteditable></pre>
            {{/each}}
        {{else}}
            {{#each maxStringLoop}}
                <pre class="text-container text-{{attributes.format}} solid{{#if attributes.class}} attributes.class{{/if}}"
                    name="{{attributes.identifier}}_{{this}}" {{#if attributes.patternMask}}pattern="{{attributes.patternMask}}"
                    {{/if}} aria-labelledby="{{promptId}}"></pre>
            {{/each}}
        {{/equal}}
    {{else}}
        {{#equal attributes.format xhtml}}
        <pre class="text-container text-{{attributes.format}} solid{{#if attributes.class}} attributes.class{{/if}}" contenteditable></pre>
        {{else}}
            <pre class="text-container text-{{attributes.format}} solid{{#if attributes.class}} attributes.class{{/if}}"
                    name="{{attributes.identifier}}_{{this}}" {{#if attributes.patternMask}}pattern="{{attributes.patternMask}}"
                    {{/if}} aria-labelledby="{{promptId}}"></pre>
        {{/equal}}
    {{/if}}
    <div class="text-counter">
        {{#if attributes.expectedLength}}
            <span class="count-chars">0</span> {{__ "of"}} <span class="count-expected-length">{{attributes.expectedLength}}</span> {{__ "chars"}} {{__ "recommended"}}.
        {{else}}
            {{#if maxLength}}
                <span class="text-counter-chars"><span class="count-chars">0</span> {{__ "of"}} <span class="count-max-length">{{maxLength}}</span> {{__ "chars"}} {{__ "maximum"}}.</span>
            {{else}}
                <span class="text-counter-chars" style="display: none"><span class="count-chars">0</span> {{__ "of"}} <span class="count-max-length">{{maxLength}}</span> {{__ "chars"}} {{__ "maximum"}}.</span>
            {{/if}}
            {{#if maxWords}}
                <span class="text-counter-words"><span class="count-words">0</span> {{__ "of"}} <span class="count-max-words">{{maxWords}}</span> {{__ "words"}} {{__ "maximum"}}.</span>
            {{else}}
                <span class="text-counter-words" style="display: none"><span class="count-words">0</span> {{__ "of"}} <span class="count-max-words">{{maxWords}}</span> {{__ "words"}} {{__ "maximum"}}.</span>
            {{/if}}
        {{/if}}
    </div>
</div>