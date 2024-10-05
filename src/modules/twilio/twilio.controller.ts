import { BotMessageTranslations } from '@bot/translations';
import { Context } from '@bot/types/context.type';
import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { InjectBot } from 'nestjs-telegraf';
import { from, map, mergeMap, of } from 'rxjs';
import { Telegraf } from 'telegraf';
import { FINAL_CALL_STATUSES } from './constants/twilio.constants';
import { CallWebhookDTO } from './dto/call-webhook.dto';
import { RecordingWebhookDTO } from './dto/recording-webhook.dto';
import { TwilioServiceWrapper } from './twilio.service';
import { DateTime } from 'luxon';

@Controller('twilio')
export class TwilioController {
  constructor(
    @InjectBot() private readonly bot: Telegraf<Context>,
    private readonly twilioService: TwilioServiceWrapper,
  ) {}

  @Post('call')
  @HttpCode(HttpStatus.OK)
  public handleCallWebhook(@Body() dto: CallWebhookDTO) {
    return this.twilioService.getCallInfoBySid(dto.callSid).pipe(
      mergeMap((callInfo) =>
        from(
          this.bot.telegram.sendMessage(
            callInfo.accountId,
            BotMessageTranslations[dto.callStatus].message[callInfo.language],
            {
              reply_markup: {
                inline_keyboard:
                  BotMessageTranslations[dto.callStatus].keyboard[
                    callInfo.language
                  ],
              },
            },
          ),
        ).pipe(map(() => callInfo)),
      ),
      mergeMap((callInfo) => {
        if (FINAL_CALL_STATUSES.includes(dto.callStatus)) {
          //return this.twilioService.handleNoAnswer(callInfo, dto);
        }

        return of(true);
      }),
    );
  }
}
