import './login.less';
import { Button } from '../../components/button/index';
import { RenderHelpers } from '../../baseClasses/RenderHelpers';
import notCompiledTemplate from './login.tmpl';
import { InputField } from '../../components/inputField/index';
import { loginRule, passwordRule } from '../../global/regex';
import { Link } from '../../components/link/index';
import { getFormData } from '../../utils/common';
import { Form } from '../../global/types';
import { Block } from '../../baseClasses/Block';
import { Router } from '../../utils/router';
import { LoginController } from './loigin.controller';

export default class LoginPage extends Block {
  login: string;
  password: string;
  button: Button;
  loginInputField: InputField;
  passwordInputField: InputField;
  isLoggedIn: boolean;
  linkToRegistration: Link;
  rh: RenderHelpers;
  router: Router;
  controller: LoginController;

  constructor() {
    super('div', {}, true);
    this.login = '';
    this.password = '';
    this.isLoggedIn = false;
    this.router = new Router();
    this.controller = new LoginController();
  }

  componentDidMount() {
    this.button = new Button({
      buttonStyle: 'button_style_default',
      buttonText: 'Sign In',
      events: {
        click: this.onClickSignIn.bind(this),
      },
    });
    this.loginInputField = new InputField({
      inputFieldInternalName: 'login',
      inputFieldPlaceholder: 'Login',
      inpFieldStyle: 'loginInputFieldStyle',
      labelStyle: 'loginLabelStyle',
      readOnly: false,
      mediumMarginHorizontally: true,
      validation: loginRule,
    });
    this.passwordInputField = new InputField({
      inputFieldInternalName: 'password',
      inputFieldPlaceholder: 'Password',
      inputFieldType: 'password',
      inpFieldStyle: 'loginInputFieldStyle',
      labelStyle: 'loginLabelStyle',
      readOnly: false,
      mediumMarginHorizontally: true,
      validation: passwordRule,
    });
    this.linkToRegistration = new Link({
      linkText: 'Registration',
      linkStyle: 'link-registration',
      events: {
        click: this.onClickLinkToRegistration.bind(this),
      },
    });
  }

  async onClickSignIn() {
    const { loginForm } = document.forms as Form;
    this.loginInputField.validateInputField();
    this.passwordInputField.validateInputField();
    const isValidationPassed = this.loginInputField.getIsInputFieldValid()
      && this.passwordInputField.getIsInputFieldValid();
    this.isLoggedIn = await this.controller.isUserSigned(getFormData(loginForm));
    if (isValidationPassed && this.isLoggedIn) {
      this.router.go('/messenger');
    }
  }

  onClickLinkToRegistration() {
    this.router.go('/sign-up');
  }

  render() {
    const rh = new RenderHelpers();
    rh.registerPartial('signInButton', this.button.renderAsHTMLString());
    rh.registerPartial('loginInputField', this.loginInputField.renderAsHTMLString());
    rh.registerPartial('passwordInputField', this.passwordInputField.renderAsHTMLString());
    rh.registerPartial('linkToRegistration', this.linkToRegistration.renderAsHTMLString());
    const templateHTML = rh.generateView(notCompiledTemplate);

    return rh.replaceElementsInHTMLTemplate(templateHTML,
      [this.button, this.loginInputField, this.passwordInputField, this.linkToRegistration],
    );
  }
}
