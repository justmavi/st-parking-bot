import { AvailableLanguages } from '@bot/constants/bot.constants';
import { ElementType } from './element.type';

export interface CallInfo {
  to: string;
  accountId: number;
  historyId: number;
  language: ElementType<typeof AvailableLanguages>;
  date: Date;
  price: number;
}
