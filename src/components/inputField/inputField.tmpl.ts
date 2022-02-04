/* eslint-disable no-useless-escape */
export default `
    <div 
      class="{{#if mediumMarginHorizontally}}mediumMarginLeft mediumMarginRight {{/if}}
      {{#if vbox}}inputfield_style_VBox{{else}}inputfield_style_HBox{{/if}}
      {{#if style_justifyContentSpaceBetween}}style_justifyContentSpaceBetween{{/if}}">
      {{#if isLabelEnabled}}
        <label for="{{inputFieldId}}" class="{{labelStyle}}">{{inputFieldName}}</label>
      {{/if}}
      <input 
        placeholder="{{inputFieldPlaceholder}}"
        type="{{inputFieldType}}"
        value="{{inputFieldValue}}"
        name="{{inputFieldInternalName}}"
        class="inputField {{inpFieldStyle}}"
        {{#if readOnly}}readonly{{/if}}>
    </div>
    {{#unless isValid}}
      <span class="inputfield__error-msg mediumMarginLeft mediumMarginRight">{{validationFailedMessage}}</span>
    {{/unless}}
`;
