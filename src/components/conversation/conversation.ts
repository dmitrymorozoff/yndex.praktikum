import notCompiledTemplate from './conversation.tmpl';
import './conversation.less';
import { InputField } from '../inputField/index';
import { Block } from '../../baseClasses/Block';
import { RenderHelpers } from '../../baseClasses/RenderHelpers';
import { noEmptyStringRule } from '../../global/regex';
import { Button } from '../button/index';
import { Form } from '../../global/types';
import { getFormData } from '../../utils/common';
import { ConversationController } from './conversation.controller';
import { Message } from '../message/index';
import { ConversationProps, RawMessage } from './types';
import { User } from '../../pages/profile/types';
import { isArray, isObject } from '../../utils/typeGuards';

export class Conversation extends Block {
  messageInputField: InputField;
  rh: RenderHelpers;
  submitMessageButton: Button;
  props: ConversationProps;
  controller: ConversationController;
  socket: WebSocket;
  rawMessages: RawMessage[];
  messages: Message[];
  user: User;

  constructor(props: ConversationProps) {
    super('div', props, false, true);
  }

  async componentDidMount() {
    this.controller = new ConversationController();
    this.user = await this.controller.getUserInfo();
    this.messages = [];
    this.rawMessages = [];
    this._initComponents();
  }

  _initComponents() {
    this.messageInputField = new InputField({
      inputFieldPlaceholder: 'Message',
      inputFieldType: 'text',
      inputFieldInternalName: 'Message',
      inpFieldStyle: 'form-conversation__inputfield_style_default',
      mediumMarginHorizontally: true,
      validation: noEmptyStringRule,
      isLabelEnabled: false,
    });
    this.submitMessageButton = new Button({
      buttonStyle: 'button_style_round-arrow-right',
      events: {
        submit: this.onClickSubmitMessage.bind(this),
        click: this.onClickSubmitMessage.bind(this),
      },
    });
  }

  onClickSubmitMessage() {
    const { conversationForm } = document.forms as Form;
    getFormData(conversationForm);
    this.messageInputField.validateInputField();
    const isValidationPassed = this.messageInputField.getIsInputFieldValid();
    if (isValidationPassed) {
      this.initializeSocketConnection();
      this.socket.send(JSON.stringify({
        content: this.messageInputField.getInputFieldValue(),
        type: 'message',
      }));
      this.messageInputField.setInputFieldValue('');
      this.props.localEventBus.emit('onNewMessage');
    }
  }

  _sortByDate(a: RawMessage, b:RawMessage) {
    return new Date(a.time).getTime() - new Date(b.time).getTime();
  }

  _onMessageWebSocket(event: MessageEvent) {
    const { data } = event;
    const parsedData = JSON.parse(data);
    if (isArray(parsedData)) {
      parsedData.forEach((el: RawMessage) => this.rawMessages.push(el));
    } else if (isObject(parsedData)) {
      this.rawMessages.push(parsedData as RawMessage);
    } else {
      throw new Error('Not supported type of parsed WS response!');
    }
    const messages = this.rawMessages.sort(this._sortByDate).map((msg) => new Message({
      messageText: msg.content,
      messageTime: new Date(msg.time).toLocaleTimeString([], {
        year: 'numeric', month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit',
      }),
      isMessageAuthor: msg.user_id === this.user.id,
    }));
    this.updateMessages(messages);
    this.forceRender();
  }

  async initializeSocketConnection() {
    if (this.props.chatId) {
      const socket = await this.controller.createWSconnection(
        this.props.chatId,
        this.user.id,
        this._onMessageWebSocket.bind(this),
      );
      if (socket) {
        this.socket = socket;
      }
    }
  }

  closeSocket() {
    this.socket.close();
  }

  updateMessages(messages: Message[]) {
    this.messages = messages;
  }

  getPreviousMessages() {
    this.socket.send(JSON.stringify({
      content: '0',
      type: 'get old',
    }));
  }

  async componentDidUpdate() {
    this.rawMessages = [];
    await this.initializeSocketConnection();
    this.getPreviousMessages();
  }

  render() {
    this.rh.registerPartial('messageInputField', this.messageInputField.renderAsHTMLString());
    this.rh.registerPartial('submitMessageButton', this.submitMessageButton.renderAsHTMLString());
    this.rh.registerPartial('messages', this.messages
      .map((msg: Message) => msg.renderAsHTMLString())
      .join(''));
    const templateHTML = this.rh.generateView(notCompiledTemplate);
    return this.rh.replaceElementsInHTMLTemplate(templateHTML,
      [this.messageInputField, this.submitMessageButton, ...this.messages],
    );
  }
}
