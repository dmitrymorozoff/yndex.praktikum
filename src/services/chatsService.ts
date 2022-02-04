/* eslint-disable no-console */
/* eslint-disable camelcase */
import { Request } from '../utils/request';
import { CallBack } from '../global/types';
import { RawChat } from '../pages/chats/types';
import { isError } from '../utils/typeGuards';

export default class ChatsService {
  request: Request;
  baseUrl: string;
  wssBaseUrl: string;
  constructor() {
    this.request = new Request();
    this.baseUrl = 'https://ya-praktikum.tech/api/v2';
    this.wssBaseUrl = 'wss://ya-praktikum.tech/ws/chats';
  }

  async getChats(): Promise<RawChat[]> {
    let rawChats: RawChat[] = [];
    try {
      const res = await this.request.get(`${this.baseUrl}/chats`);
      rawChats = JSON.parse(res.response);
    } catch (error) {
      // todo: create a component that will be popped up when an error occurs
      if (isError(error)) {
        throw new Error(error.message);
      }
    }
    return rawChats;
  }

  async createChat(title: string): Promise<void> {
    try {
      await this.request.post(`${this.baseUrl}/chats`, {
        headers: {
          'Content-type': 'application/x-www-form-urlencoded',
        },
        data: { title },
      });
    } catch (error) {
      // todo: create a component that will be popped up when an error occurs
      if (isError(error)) {
        throw new Error(error.message);
      }
    }
  }

  async removeChat(chatId: number): Promise<void> {
    try {
      await this.request.delete(`${this.baseUrl}/chats`, {
        headers: {
          'Content-type': 'application/x-www-form-urlencoded',
        },
        data: { chatId },
      });
    } catch (error) {
      // todo: create a component that will be popped up when an error occurs
      if (isError(error)) {
        throw new Error(error.message);
      }
    }
  }

  async getChatWSToken(chatId: number): Promise<string> {
    let wsToken;
    try {
      const res = await this.request.post(`${this.baseUrl}/chats/token/${chatId}`, {
        headers: {
          'Content-type': 'application/x-www-form-urlencoded',
        },
      });
      wsToken = JSON.parse(res.responseText).token;
    } catch (error) {
      // todo: create a component that will be popped up when an error occurs
      if (isError(error)) {
        throw new Error(error.message);
      }
    }
    return wsToken;
  }

  createWSconnection(chatId: number, userId: number, wsToken: string, cb: CallBack):
    Promise<WebSocket> {
    return new Promise((resolve, reject) => {
      const server = new WebSocket(`${this.wssBaseUrl}/${userId}/${chatId}/${wsToken}`);
      server.onopen = () => {
        console.log('Соединение установлено');
        resolve(server);
      };
      server.onmessage = cb;
      server.onerror = (error) => reject(error);
      server.onclose = (event) => {
        if (event.wasClean) {
          console.log('Соединение закрыто чисто');
        } else {
          console.log('Обрыв соединения');
        }
        console.log(`Код: ${event.code} | Причина: ${event.reason}`);
      };
    });
  }
}
