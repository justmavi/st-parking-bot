import { AccountService } from '@account/account.service';
import { TelegramBaseHandler } from '@bot/base/handler.base';
import { TwilioServiceWrapper } from '@twilio/twilio.service';
import { Scene, SceneEnter } from 'nestjs-telegraf';
import { lastValueFrom } from 'rxjs';
import { SceneNames } from '../constants/bot.constants';
import { Context } from '../types/context.type';

@Scene(SceneNames.SELECT_GATE)
export class CallScene extends TelegramBaseHandler {
  constructor(
    private readonly accountService: AccountService,
    private readonly twilioService: TwilioServiceWrapper,
  ) {
    super();
  }

  @SceneEnter()
  public async onSceneEnter(ctx: Context) {
    const account = await lastValueFrom(this.accountService.findOne(ctx.from.id));

    if (!account) {
      await ctx.scene.enter(SceneNames.ENTER_PIN);
      return;
    }

    this.twilioService
      .makeCall({
        accountId: ctx.from.id,
        gateId: ctx.session.selectedGateId
      })
      .subscribe(async () => {
        await this.answer(ctx, 'queued');
      });
  }
}
