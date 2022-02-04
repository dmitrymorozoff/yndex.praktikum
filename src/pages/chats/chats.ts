import { ChatList } from '../../components/chatList/index';
import notCompiledTemplate from './chats.tmpl';
import './chats.less';
import { Block } from '../../baseClasses/Block';
import EventBus from '../../baseClasses/EventBus';
import { Conversation } from '../../components/conversation/index';
import { Chat } from './types';
import { ChatsController } from './chats.controller';
import { ChatContact } from '../../components/chatContact/index';
import { Link } from '../../components/link/index';

type ChatsPageProps = {
  isChatSelected: boolean;
  conversation: Conversation | null;
}

export class ChatsPage extends Block {
  chatList: ChatList;
  chatContacts: Chat[];
  controller: ChatsController;
  localEventBus: EventBus;
  conversation: Conversation;
  selectedChat: ChatContact;
  linkToRemoveChat: Link;
  props: ChatsPageProps;

  constructor() {
    super('div', {}, true);
  }

  chatIsSelected() {
    this.setProps({
      isChatSelected: false,
    });
    this.conversation.setProps({
      chatId: this.chatList.getSelectedChat()?.getChatId(),
    });
  }

  chatIsRemoved() {
    this.setProps({
      isChatSelected: false,
    });
    this.conversation.closeSocket();
  }

  async onNewMessage() {
    this.chatList.setProps({
      chatContacts: await this.controller.getChats(),
    });
  }

  async componentDidMount() {
    this.controller = new ChatsController();
    this.chatContacts = await this.controller.getChats();

    this.localEventBus = new EventBus();
    this.localEventBus.on('chatIsSelected', this.chatIsSelected);
    this.localEventBus.on('chatIsRemoved', this.chatIsRemoved);
    this.localEventBus.on('onNewMessage', this.onNewMessage.bind(this));

    this.chatList = new ChatList({
      chatContacts: this.chatContacts,
      localEventBus: this.localEventBus,
    });
    this.conversation = new Conversation({
      localEventBus: this.localEventBus,
    });
  }

  render() {
    this.rh.registerPartial('chatsList', this.chatList.renderAsHTMLString());
    this.rh.registerPartial('chat', this.conversation.renderAsHTMLString());
    const templateHTML = this.rh.generateView(notCompiledTemplate,
      { isChatSelected: this.props.isChatSelected });
    return this.rh.replaceElementsInHTMLTemplate(templateHTML,
      [this.chatList, this.conversation],
    );
  }
}
