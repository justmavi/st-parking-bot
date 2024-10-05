import { EnterPinInterceptor } from '@bot/interceptors/enter-pin.interceptor';
import { AnswerOptions } from '@bot/types/answer-options.type';
import { format } from '@common/helpers/string-format.helper';
import { UseInterceptors } from '@nestjs/common';
import { BotMessageTranslations } from '../translations';
import { Context } from '../types/context.type';

@UseInterceptors(EnterPinInterceptor)
export class TelegramBaseHandler {
  public async answer(
    ctx: Context,
    message: keyof typeof BotMessageTranslations,
    opts?: AnswerOptions,
  ) {
    opts ??= {} as AnswerOptions;

    const text =
      BotMessageTranslations[message].message;
    const keyboard =
      BotMessageTranslations[message].keyboard;

    if (!text && !keyboard) {
      throw new Error('Undefined behavior. Cannot answer to message');
    }

    const response = await ctx.replyWithHTML(
      format(text, ...(opts.messageArgs ?? [])),
      {
        reply_markup: {
          keyboard
        },
      },
    );

    return response;
  }


  protected setState(
    ctx: Context,
    key: keyof Context['session'],
    value: Context['session'][typeof key],
  ) {
    ctx.session[key] = value as never;
    ctx.scene.state[key] = value;
  }
}
