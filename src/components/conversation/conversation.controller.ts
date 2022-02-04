import ChatsService from '../../services/chatsService';
import { CallBack } from '../../global/types';
import UserService from '../../services/userService';
import { snakeToCamelCase } from '../../utils/common';
import { User } from '../../pages/profile/types';
import { isError } from '../../utils/typeGuards';

export class ConversationController {
  chatsService: ChatsService;
  userService: UserService;

  constructor() {
    this.chatsService = new ChatsService();
    this.userService = new UserService();
  }

  async createWSconnection(chatId: number, userId: number, cb: CallBack) {
    let webSocket;
    try {
      const wsToken = await this.chatsService.getChatWSToken(chatId);
      if (wsToken) {
        webSocket = await this.chatsService.createWSconnection(chatId, userId, wsToken, cb);
      }
    } catch (error) {
      if (isError(error)) {
        throw new Error(error.message);
      }
    }
    return webSocket;
  }

  async getUserInfo() {
    const user = await this.userService.getUserInfo();
    return (snakeToCamelCase(user) as User);
  }
}
