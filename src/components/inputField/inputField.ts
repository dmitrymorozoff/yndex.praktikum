import notCompiledTemplate from './inputField.tmpl';
import './inputField.less';
import { Block } from '../../baseClasses/Block';
import { CallBack } from '../../global/types';
import { RenderHelpers } from '../../baseClasses/RenderHelpers';

const Handlebars = require('handlebars');

type InputFieldProps = {
  inputFieldInternalName?: string,
  inputFieldName?: string,
  inputFieldPlaceholder?: string,
  inputFieldType?: string,
  inputFieldValue?: string,
  inpFieldStyle?: string,
  labelStyle?: string,
  readOnly?: boolean,
  mediumMarginHorizontally?: boolean,
  vbox?: boolean,
  style_justifyContentSpaceBetween?: boolean,
  validation?: { regex: RegExp, validationMessage: string },
  isValid?: boolean,
  isLabelEnabled?: boolean
}

export class InputField extends Block {
  validation: { regex: RegExp, validationMessage: string };
  id: string;
  isValid: boolean;
  value: string;
  constructor(props: InputFieldProps) {
    super('div', props);
    this.validation = this.props.validation;
    this.isValid = this.props.isValid ?? true;
  }

  componentDidMount() {
    this._addEventsToInputField({
      blur: this.handleBlur.bind(this),
      focus: this.handleFocus.bind(this),
    });
  }

  private _addEventsToInputField(events: { [key: string]: CallBack }) {
    Object.keys(events).forEach((eventName) => {
      this.getElement().addEventListener(eventName, events[eventName], true);
    });
  }

  handleBlur() {
    const inpFieldVal = this.getInputFieldValue();
    if (!this.isInputFieldValid(inpFieldVal)) {
      this.isValid = false;
      this.setProps({
        isValid: false,
        inputFieldValue: inpFieldVal,
      });
      this.highlightInvalidInput();
    } else {
      this.isValid = true;
      this.setProps({
        isValid: true,
        inputFieldValue: inpFieldVal,
      });
      this.resetHighlightedInput();
    }
  }

  handleFocus() {
    this.resetHighlightedInput();
  }

  validateInputField() {
    this._getInputField().dispatchEvent(new Event('blur'));
  }

  getIsInputFieldValid() {
    return this.isValid;
  }

  isInputFieldValid(inpFieldValue: string) {
    if (!this.validation) {
      return true;
    }
    return this.validation.regex.test(inpFieldValue);
  }

  getInputFieldValue() {
    return (this._getInputField() as HTMLInputElement).value;
  }

  getValidationRule() {
    return this.validation.regex;
  }

  private _getInputField() {
    return (this.getElement().querySelector('.inputField') as HTMLElement);
  }

  highlightInvalidInput() {
    this._getInputField().classList.add('inputfield_style_invalid');
    (this.getElement().querySelector('.inputfield__error-msg') as HTMLElement).innerText = this.validation.validationMessage;
  }

  resetHighlightedInput() {
    this._getInputField().classList.remove('inputfield_style_invalid');
    //  todo : this seems to be not working properly atm
    // (this.getElement().querySelector('.inputfield__error-msg') as HTMLElement).innerText = '';
  }

  setInputFieldValue(value: string) {
    this.setProps({
      inputFieldValue: value,
    });
  }

  render() {
    const rh = new RenderHelpers();
    const template = Handlebars.compile(notCompiledTemplate);
    const templateHTML = template({
      inputFieldInternalName: this.props.inputFieldInternalName ?? '',
      inputFieldName: this.props.inputFieldName ?? '',
      inputFieldPlaceholder: this.props.inputFieldPlaceholder ?? '',
      inputFieldType: this.props.inputFieldType ?? 'text',
      inputFieldValue: this.props.inputFieldValue ?? '',
      inpFieldStyle: this.props.inpFieldStyle ?? '',
      labelStyle: this.props.labelStyle ?? '',
      readOnly: this.props.readOnly ?? false,
      mediumMarginHorizontally: this.props.mediumMarginHorizontally ?? false,
      vbox: this.props.vbox ?? true,
      style_justifyContentSpaceBetween: this.props.style_justifyContentSpaceBetween ?? false,
      isValid: this.isValid,
      validationFailedMessage: this.validation?.validationMessage ?? '',
      isLabelEnabled: this.props.isLabelEnabled ?? true,
    });
    return rh.convertHTMLToDOM(templateHTML);
  }
}
