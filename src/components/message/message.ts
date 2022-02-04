import notRenderedTemplateAuthor from './message.author.tmpl';
import notRenderedTemplateGuest from './message.guest.tmpl';
import './message.less';
import { Block } from '../../baseClasses/Block';
import { CallBack } from '../../global/types';

const Handlebars = require('handlebars');

type MessageProps = {
  messageText: string,
  messageTime: string,
  isMessageAuthor: boolean,
  events?: { [key: string]: CallBack },
}

export class Message extends Block {
  props: MessageProps;
  templateToRender: string;
  constructor(props: MessageProps) {
    super('div', props);
  }

  componentDidMount() {
    this.templateToRender = this.props.isMessageAuthor
      ? notRenderedTemplateAuthor : notRenderedTemplateGuest;
  }

  render() {
    const template = Handlebars.compile(this.templateToRender);
    const templateHTML = template({
      messageText: this.props.messageText,
      messageTime: this.props.messageTime,
    });
    return this.rh.convertHTMLToDOM(templateHTML);
  }
}
