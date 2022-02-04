import './profile.less';
import { RenderHelpers } from '../../baseClasses/RenderHelpers';
import EventBus from '../../baseClasses/EventBus';
import ProfileController from './profile.controller';
import notCompiledTemplate from './profile.tmpl';
import { InputField } from '../../components/inputField/index';
import { Block } from '../../baseClasses/Block';
import { Text } from '../../components/text/index';
import {
  emailRule, loginRule, nameRule, phoneRule,
} from '../../global/regex';
import { Form } from '../../global/types';
import { getFormData } from '../../utils/common';
import { Button } from '../../components/button/index';
import { Router } from '../../utils/router';
import { UpdateUserInfo } from './types';

type User = {
  id: number,
  firstName: string,
  secondName: string,
  displayName: string,
  login: string,
  email: string,
  phone: string,
  avatar: string,
}
export class ProfilePage extends Block {
  user: User;
  bus: EventBus;
  controller: ProfileController;
  emailInputField: InputField;
  loginInputField: InputField;
  nameInputField: InputField;
  surnameInputField: InputField;
  visibleNameInputField: InputField;
  phoneInputField: InputField;
  changeUserSettingsText: Text;
  changePasswordText: Text;
  logoutText: Text;
  backToButton: Button;
  router: Router;
  props: {
    user: User
  }

  constructor() {
    super('div', {}, true);
    this.router = new Router();
    this.controller = new ProfileController();
  }

  async componentDidMount() {
    this.controller = new ProfileController();
    this.user = await this.controller.getUserInfo();
    this._setUserState(this.user);
    this.emailInputField = new InputField({
      inputFieldInternalName: 'email',
      inputFieldName: 'Email',
      inputFieldPlaceholder: '',
      inputFieldType: 'text',
      inputFieldValue: this.props.user.email,
      inpFieldStyle: 'profileInputField',
      labelStyle: 'profileInputFieldLabel',
      mediumMarginHorizontally: false,
      vbox: false,
      style_justifyContentSpaceBetween: true,
      validation: emailRule,
    });

    this.loginInputField = new InputField({
      inputFieldInternalName: 'login',
      inputFieldName: 'Login',
      inputFieldPlaceholder: '',
      inputFieldType: 'text',
      inputFieldValue: this.props.user.login,
      inpFieldStyle: 'profileInputField',
      labelStyle: 'profileInputFieldLabel',
      mediumMarginHorizontally: false,
      vbox: false,
      style_justifyContentSpaceBetween: true,
      validation: loginRule,
    });

    this.nameInputField = new InputField({
      inputFieldInternalName: 'first_name',
      inputFieldName: 'Name',
      inputFieldPlaceholder: '',
      inputFieldType: 'text',
      inputFieldValue: this.props.user.firstName,
      inpFieldStyle: 'profileInputField',
      labelStyle: 'profileInputFieldLabel',
      mediumMarginHorizontally: false,
      vbox: false,
      style_justifyContentSpaceBetween: true,
      validation: nameRule,
    });

    this.surnameInputField = new InputField({
      inputFieldInternalName: 'second_name',
      inputFieldName: 'Surname',
      inputFieldPlaceholder: '',
      inputFieldType: 'text',
      inputFieldValue: this.props.user.secondName,
      inpFieldStyle: 'profileInputField',
      labelStyle: 'profileInputFieldLabel',
      mediumMarginHorizontally: false,
      vbox: false,
      style_justifyContentSpaceBetween: true,
      validation: nameRule,
    });

    this.visibleNameInputField = new InputField({
      inputFieldInternalName: 'display_name',
      inputFieldName: 'Visible name',
      inputFieldPlaceholder: '',
      inputFieldType: 'text',
      inputFieldValue: this.props.user.displayName,
      inpFieldStyle: 'profileInputField',
      labelStyle: 'profileInputFieldLabel',
      mediumMarginHorizontally: false,
      vbox: false,
      style_justifyContentSpaceBetween: true,
      validation: nameRule,
    });

    this.phoneInputField = new InputField({
      inputFieldInternalName: 'phone',
      inputFieldName: 'Phone',
      inputFieldPlaceholder: '',
      inputFieldType: 'text',
      inputFieldValue: this.props.user.phone,
      inpFieldStyle: 'profileInputField',
      labelStyle: 'profileInputFieldLabel',
      mediumMarginHorizontally: false,
      vbox: false,
      style_justifyContentSpaceBetween: true,
      validation: phoneRule,
    });
    this.changeUserSettingsText = new Text({
      textStyle: 'profileConfigs__changeUserSettings',
      text: 'Change user settings',
      events: {
        click: this.onClickChangeUserSettings.bind(this),
      },
    });
    this.changePasswordText = new Text({
      textStyle: 'profileConfigs__changePassword',
      text: 'Change password',
      events: {
        click: this.onClickChangePswrd.bind(this),
      },
    });
    this.logoutText = new Text({
      textStyle: 'profileConfigs__logout',
      text: 'Logout',
      events: {
        click: this.onClickLogout.bind(this),
      },
    });
    this.backToButton = new Button({
      buttonStyle: 'button_style_round-arrow-left',
      events: {
        click: this.onClickBackToButton.bind(this),
      },
    });
  }

  _setUserState(user: User) {
    this.setProps({
      user,
    });
  }

  onClickBackToButton() {
    this.router.go('/messenger');
  }

  onClickChangePswrd() {
    this.router.go('/404');
  }

  async onClickLogout() {
    await this.controller.logOut();
    this.router.go('/');
  }

  async onClickChangeUserSettings() {
    const { profileForm } = document.forms as Form;
    this.getAllInputFields().forEach((inpField) => {
      inpField.validateInputField();
    });
    const isValidationPassed = this.getAllInputFields()
      .map((inpField) => inpField.getIsInputFieldValid()).every((isValidField) => isValidField);
    if (isValidationPassed) {
      const {
        first_name,
        second_name,
        display_name,
        login,
        email,
        phone,
      } = getFormData(profileForm) as UpdateUserInfo;
      // todo update all input fields with the new data;
      const newUserData = await this.controller.updateUserData({
        first_name,
        second_name,
        display_name,
        login,
        email,
        phone,
      });
      this._setUserState(newUserData);
    }
  }

  getAllInputFields() {
    return [
      this.emailInputField,
      this.loginInputField,
      this.nameInputField,
      this.surnameInputField,
      this.visibleNameInputField,
      this.phoneInputField,
    ];
  }

  getAllText() {
    return [
      this.changeUserSettingsText,
      this.changePasswordText,
      this.logoutText,
    ];
  }

  render() {
    const rh = new RenderHelpers();
    rh.registerPartial('emailInputField', this.emailInputField.renderAsHTMLString());
    rh.registerPartial('loginInputField', this.loginInputField.renderAsHTMLString());
    rh.registerPartial('nameInputField', this.nameInputField.renderAsHTMLString());
    rh.registerPartial('surnameInputField', this.surnameInputField.renderAsHTMLString());
    rh.registerPartial('visibleNameInputField', this.visibleNameInputField.renderAsHTMLString());
    rh.registerPartial('phoneInputField', this.phoneInputField.renderAsHTMLString());
    rh.registerPartial('changeUserSettingsText', this.changeUserSettingsText.renderAsHTMLString());
    rh.registerPartial('changePasswordText', this.changePasswordText.renderAsHTMLString());
    rh.registerPartial('logoutText', this.logoutText.renderAsHTMLString());
    rh.registerPartial('backToButton', this.backToButton.renderAsHTMLString());
    const templateHTML = rh.generateView(notCompiledTemplate, {
      profileName: `${this.props.user.displayName}`,
    });
    return rh.replaceElementsInHTMLTemplate(templateHTML,
      [...this.getAllInputFields(), ...this.getAllText(), this.backToButton],
    );
  }
}
