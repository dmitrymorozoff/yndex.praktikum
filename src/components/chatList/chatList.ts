import notCompiledTemplate from './chatList.tmpl';
import './chatList.less';
import { Block } from '../../baseClasses/Block';
import { SearchField } from '../searchField/index';
import { Link } from '../link/index';
import { RenderHelpers } from '../../baseClasses/RenderHelpers';
import { ChatContact } from '../chatContact/index';
import EventBus from '../../baseClasses/EventBus';
import { Router } from '../../utils/router';
import { Chat } from '../../pages/chats/types';
import { ChatListController } from './chatList.controller';

// todo: centralize Handlebars in Block ts
const Handlebars = require('handlebars');

type ChatListProps = {
  chatContacts: Chat[];
  localEventBus: EventBus;
  selectedChat?: ChatContact;
}

export class ChatList extends Block {
  searchField: SearchField;
  linkToProfile: Link;
  chatContacts: ChatContact[];
  rh: RenderHelpers;
  isChatSelected: boolean;
  localEventBus: EventBus;
  router: Router;
  linkToCreateNewChat: Link;
  linkToRemoveChat: Link;
  controller: ChatListController;
  props: ChatListProps;

  constructor(props: ChatListProps) {
    super('div', props);
    this.isChatSelected = false;
    this.router = new Router();
    this.controller = new ChatListController();
  }

  componentDidMount() {
    this.searchField = new SearchField();
    this.linkToProfile = new Link({
      linkText: 'Profile',
      linkStyle: 'chatlist__link_profile',
      events: {
        click: this.onClickLinkToProfile.bind(this),
      },
    });
    this.linkToCreateNewChat = new Link({
      linkText: 'New chat',
      linkStyle: 'chatlist__link_new-chat',
      events: {
        click: this.onClickLinkToCreateChat.bind(this),
      },
    });
    this.linkToRemoveChat = new Link({
      linkText: 'Remove chat',
      linkStyle: 'chatlist__link_remove-chat',
      events: {
        click: this.onClickLinkToRemoveChat.bind(this),
      },
    });
    this.chatContacts = this.buildChatContacts();
  }

  onClickLinkToProfile() {
    this.router.go('/settings');
  }

  async onClickLinkToCreateChat() {
    // todo: introduce a pop up component for new chat's name
    await this.controller.createChat('randomName');
    const updatedChatContacts = await this.controller.getChats();
    this.setProps({
      chatContacts: updatedChatContacts,
    });
  }

  async onClickLinkToRemoveChat() {
    // todo: introduce a pop up component for new chat's name
    const { selectedChat } = this.props;
    if (selectedChat) {
      await this.controller.removeChat(selectedChat.getChatId());
      const updatedChatContacts = await this.controller.getChats();
      const isSelectedChatRemoved = updatedChatContacts
        .map((chat) => chat.id)
        .includes(selectedChat.getChatId());
      this.setProps({
        chatContacts: updatedChatContacts,
        selectedChat: isSelectedChatRemoved ?? undefined,
      });
    }
    this.props.localEventBus.emit('chatIsRemoved');
  }

  onClickChatContact(event: Event) {
    let selectedChat;
    const { currentTarget } = event;
    if (currentTarget) {
      const selectedChatId = (currentTarget as HTMLElement).getAttribute('data-id');
      selectedChat = this.chatContacts.find((chat) => chat.getId() === selectedChatId);
    }
    if (selectedChat) {
      this.setProps({
        selectedChat,
      });
      this.props.localEventBus.emit('chatIsSelected', selectedChat);
    }
  }

  getSelectedChat() {
    return this.props.selectedChat;
  }

  buildChatContacts() {
    const chatContacts: ChatContact[] = [];
    const { selectedChat } = this.props;
    this.props.chatContacts.forEach((chat: Chat) => {
      const chatContact = new ChatContact({
        ...chat,
        events: {
          click: this.onClickChatContact.bind(this),
        },
        isHighlighted: selectedChat ? selectedChat.getChatId() === chat.id : false,
      });
      chatContacts.push(chatContact);
    });
    return chatContacts;
  }

  componentDidUpdate() {
    this.chatContacts = this.buildChatContacts();
  }

  render() {
    Handlebars.registerPartial('searchField', this.searchField.renderAsHTMLString());
    Handlebars.registerPartial('linkToProfile', this.linkToProfile.renderAsHTMLString());
    Handlebars.registerPartial('linkToCreateNewChat', this.linkToCreateNewChat.renderAsHTMLString());
    Handlebars.registerPartial('linkToRemoveChat', this.linkToRemoveChat.renderAsHTMLString());
    Handlebars.registerPartial('chatContacts', this.chatContacts
      .map((chatContact: ChatContact) => chatContact.renderAsHTMLString())
      .join(''));
    const template = Handlebars.compile(notCompiledTemplate);
    const templateHTML = template({
      chatContacts: this.props.chatContacts,
      isRemoveChatLinkEnabled: this.props.selectedChat ?? false,
    });
    return this.rh.replaceElementsInHTMLTemplate(templateHTML,
      [
        this.searchField,
        this.linkToProfile,
        ...this.chatContacts,
        this.linkToCreateNewChat,
        this.linkToRemoveChat,
      ],
    );
  }
}
