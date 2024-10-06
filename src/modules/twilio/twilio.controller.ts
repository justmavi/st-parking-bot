import { BotMessageTranslations } from '@bot/messages';
import { Context } from '@bot/types/context.type';
import { HistoryService } from '@history/history.service';
import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { InjectBot } from 'nestjs-telegraf';
import { from, map, mergeMap, of } from 'rxjs';
import { Telegraf } from 'telegraf';
import { FINAL_CALL_STATUSES, SUCCESS_CALL_STATUS } from './constants/twilio.constants';
import { CallWebhookDTO } from './dto/call-webhook.dto';
import { TwilioServiceWrapper } from './twilio.service';

@Controller('twilio')
export class TwilioController {
  constructor(
    @InjectBot() private readonly bot: Telegraf<Context>,
    private readonly twilioService: TwilioServiceWrapper,
    private readonly historyService: HistoryService,
  ) {}

  @Post('call')
  @HttpCode(HttpStatus.NO_CONTENT)
  public handleCallWebhook(@Body() dto: CallWebhookDTO) {
    console.log({dto})
    return this.twilioService.getCallInfoBySid(dto.callSid).pipe(
      mergeMap((callInfo) =>
        from(
          this.bot.telegram.sendMessage(
            callInfo.accountId,
            BotMessageTranslations[dto.callStatus].message,
            {
              reply_markup: {
                keyboard:
                  BotMessageTranslations[dto.callStatus].keyboard,
                remove_keyboard: true
              },
            },
          ),
        ).pipe(map(() => callInfo)),
      ),
      mergeMap((callInfo) => {
        if (FINAL_CALL_STATUSES.includes(dto.callStatus)) {
          return this.historyService.update(callInfo.historyId, {
            isActive: false,
            isCanceled: dto.callStatus !== SUCCESS_CALL_STATUS,
            cancelationReason: dto.callStatus === SUCCESS_CALL_STATUS ? null : dto.callStatus,
          })
        }

        return of(true);
      })
    );
  }
}
