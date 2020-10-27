<li class="qti-choice qti-simpleChoice" data-identifier="{{attributes.identifier}}" data-serial="{{serial}}"{{#if attributes.xml:lang}} lang="{{attributes.xml:lang}}"{{/if}}>
    <label class="real-label">
        <div class="cell">
            {{#if unique}}
            <input
                type="radio"
                name="response-{{interaction.serial}}"
                value="{{attributes.identifier}}"
                tabindex="1"
            >
            <span class="icon-radio"></span>
            {{else}}
            <input
                type="checkbox"
                name="response-{{interaction.serial}}"
                value="{{attributes.identifier}}"
                tabindex="1"
            >
            <span class="icon-checkbox"></span>
            {{/if}}
        </div>
    </label>

    <div class="list-symbol-container">
        <div class="cell">
            <div class="list-symbol"></div>
        </div>
    </div>

    <label data-eliminable="container" data-label="{{__ "Eliminate"}}" class="choice-eliminate">
        <div class="cell">
            <span data-eliminable="trigger" class="icon-checkbox"></span>
        </div>
    </label>

    <div class="label-content" contenteditable="false" id="choice-{{interaction.serial}}-{{attributes.identifier}}">
        <div class="content-body">{{{body}}}</div>
        <svg class="overlay-answer-eliminator">
            <line x1="0" y1="100%" x2="100%" y2="0"/>
            <line x1="0" y1="0" x2="100%" y2="100%"/>
        </svg>
    </div>
</li>
