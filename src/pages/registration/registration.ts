import notCompiledTemplate from './registration.tmpl';
import { Button } from '../../components/button/index';
import './registration.less';
import { InputField } from '../../components/inputField/index';
import {
  loginRule,
  emailRule, nameRule, surnameRule, phoneRule, passwordRule,
} from '../../global/regex';
import { getFormData } from '../../utils/common';
import { Form } from '../../global/types';
import { Link } from '../../components/link/link';
import { RenderHelpers } from '../../baseClasses/RenderHelpers';
import { Block } from '../../baseClasses/Block';
import { Router } from '../../utils/router';
import { RegistrationController } from './registration.controller';

export class RegistrationPage extends Block {
  notCompiledTemplate: string;
  button: Button;
  loginInputField: InputField
  emailInputField: InputField
  nameInputField: InputField
  surnameInputField: InputField
  phoneInputField: InputField
  passwordInputField: InputField
  passwordAgainInputField: InputField
  isLoggedIn: boolean;
  linkToSignIn: Link;
  router: Router;
  controller: RegistrationController;

  constructor() {
    super('div', {}, true);
    this.isLoggedIn = false;
    this.router = new Router();
    this.controller = new RegistrationController();
  }

  componentDidMount() {
    this.button = new Button({
      buttonText: 'Complete registration',
      buttonStyle: 'button_style_default',
      events: {
        click: this.onClickCompleteRegistration.bind(this),
      },
    });
    this.loginInputField = new InputField({
      inputFieldInternalName: 'login',
      inputFieldPlaceholder: 'Login',
      inpFieldStyle: 'registrationInputFieldStyle',
      labelStyle: 'registrationLabelStyle',
      readOnly: false,
      mediumMarginHorizontally: true,
      validation: loginRule,
    });
    this.emailInputField = new InputField({
      inputFieldInternalName: 'email',
      inputFieldPlaceholder: 'Email',
      inpFieldStyle: 'registrationInputFieldStyle',
      labelStyle: 'registrationLabelStyle',
      readOnly: false,
      mediumMarginHorizontally: true,
      validation: emailRule,
    });
    this.nameInputField = new InputField({
      inputFieldInternalName: 'first_name',
      inputFieldPlaceholder: 'Name',
      inpFieldStyle: 'registrationInputFieldStyle',
      labelStyle: 'registrationLabelStyle',
      readOnly: false,
      mediumMarginHorizontally: true,
      validation: nameRule,
    });
    this.surnameInputField = new InputField({
      inputFieldInternalName: 'second_name',
      inputFieldPlaceholder: 'Surname',
      inpFieldStyle: 'registrationInputFieldStyle',
      labelStyle: 'registrationLabelStyle',
      readOnly: false,
      mediumMarginHorizontally: true,
      validation: surnameRule,
    });
    this.phoneInputField = new InputField({
      inputFieldInternalName: 'phone',
      inputFieldPlaceholder: 'Phone',
      inpFieldStyle: 'registrationInputFieldStyle',
      labelStyle: 'registrationLabelStyle',
      readOnly: false,
      mediumMarginHorizontally: true,
      validation: phoneRule,
    });
    this.passwordInputField = new InputField({
      inputFieldInternalName: 'password',
      inputFieldPlaceholder: 'Password',
      inputFieldType: 'password',
      inpFieldStyle: 'registrationInputFieldStyle',
      labelStyle: 'registrationLabelStyle',
      readOnly: false,
      mediumMarginHorizontally: true,
      validation: passwordRule,
    });
    this.passwordAgainInputField = new InputField({
      inputFieldInternalName: 'password',
      inputFieldPlaceholder: 'Password',
      inputFieldType: 'password',
      inpFieldStyle: 'registrationInputFieldStyle',
      labelStyle: 'registrationLabelStyle',
      readOnly: false,
      mediumMarginHorizontally: true,
      validation: passwordRule,
    });
    this.linkToSignIn = new Link({
      linkText: 'Sign In',
      linkStyle: 'link-signin',
      events: {
        click: this.onClickLinkToSignIn.bind(this),
      },
    });
  }

  getAllInputFields() {
    return [
      this.loginInputField,
      this.emailInputField,
      this.nameInputField,
      this.surnameInputField,
      this.phoneInputField,
      this.passwordInputField,
      this.passwordAgainInputField,
    ];
  }

  async onClickCompleteRegistration() {
    const { registrationForm } = document.forms as Form;
    this.getAllInputFields().forEach((inpField) => {
      inpField.validateInputField();
    });
    const isValidationPassed = this.getAllInputFields()
      .map((inpField) => inpField.getIsInputFieldValid()).every((isValidField) => isValidField);
    if (isValidationPassed || this.isLoggedIn) {
      await this.controller.signUp(getFormData(registrationForm));
      this.router.go('/messenger');
    }
  }

  onClickLinkToSignIn() {
    this.router.go('/');
  }

  render() {
    const rh = new RenderHelpers();
    rh.registerPartial('completeRegistration', this.button.renderAsHTMLString());
    rh.registerPartial('loginInputFieldReg', this.loginInputField.renderAsHTMLString());
    rh.registerPartial('emailInputFieldReg', this.emailInputField.renderAsHTMLString());
    rh.registerPartial('nameInputFieldReg', this.nameInputField.renderAsHTMLString());
    rh.registerPartial('surnameInputFieldReg', this.surnameInputField.renderAsHTMLString());
    rh.registerPartial('phoneInputFieldReg', this.phoneInputField.renderAsHTMLString());
    rh.registerPartial('passwordInputFieldReg', this.passwordInputField.renderAsHTMLString());
    rh.registerPartial('passwordAgainInputFieldReg', this.passwordAgainInputField.renderAsHTMLString());
    rh.registerPartial('linkToSignIn', this.linkToSignIn.renderAsHTMLString());
    const templateHTML = rh.generateView(notCompiledTemplate);
    return rh.replaceElementsInHTMLTemplate(templateHTML,
      [this.button, this.linkToSignIn, ...this.getAllInputFields()],
    );
  }
}
