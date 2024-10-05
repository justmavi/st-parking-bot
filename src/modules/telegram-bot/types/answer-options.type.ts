import { InlineKeyboardButton } from 'telegraf/typings/core/types/typegram';

export interface AnswerOptions {
  messageArgs?: any[];
  keyboard?: InlineKeyboardButton[][];
}
