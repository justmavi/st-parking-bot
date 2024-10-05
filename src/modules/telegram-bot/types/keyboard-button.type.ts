import { KeyboardButton as KbButton } from 'telegraf/typings/core/types/typegram';

export type KeyboardButton = KbButton & {
  callback_data?: string;
};
