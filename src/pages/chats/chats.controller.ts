import ChatsService from '../../services/chatsService';
import { snakeToCamelCase } from '../../utils/common';
import { Chat, RawChat } from './types';

export class ChatsController {
  chatsService: ChatsService;

  constructor() {
    this.chatsService = new ChatsService();
  }

  async getChats(): Promise<Chat[]> {
    const rawChats: RawChat[] = await this.chatsService.getChats();
    return rawChats.map(snakeToCamelCase) as Chat[];
  }
}
