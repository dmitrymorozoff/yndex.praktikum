import ChatsService from '../../services/chatsService';
import { snakeToCamelCase } from '../../utils/common';
import { Chat, RawChat } from '../../pages/chats/types';

export class ChatListController {
  chatsService: ChatsService;
  constructor() {
    this.chatsService = new ChatsService();
  }

  async getChats(): Promise<Chat[]> {
    const rawChats: RawChat[] = await this.chatsService.getChats();
    return rawChats.map(snakeToCamelCase) as Chat[];
  }

  async createChat(title: string) {
    await this.chatsService.createChat(title);
  }

  async removeChat(chatId: number) {
    await this.chatsService.removeChat(chatId);
  }
}
