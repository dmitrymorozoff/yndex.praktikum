import EventBus from '../../baseClasses/EventBus';
import { Message } from '../message/index';

export type ConversationProps = {
  chatId?: number,
  localEventBus: EventBus,
  messages?: Message[]
}

export type RawMessage = {
  id: number,
  user_id: number,
  chat_id: number,
  type: string,
  time: Date,
  content: string,
  is_read: boolean,
  file: null
}
