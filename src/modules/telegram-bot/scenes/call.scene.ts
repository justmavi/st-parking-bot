import { AccountService } from '@account/account.service';
import { TelegramBaseHandler } from '@bot/base/handler.base';
import { TwilioServiceWrapper } from '@twilio/twilio.service';
import { Hears, Scene, SceneEnter, Ctx } from 'nestjs-telegraf';
import { lastValueFrom } from 'rxjs';
import { SceneNames } from '../constants/bot.constants';
import { Context } from '../types/context.type';
import { GATES } from '@common/constants/app.constants';

@Scene(SceneNames.OPEN_GATE)
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

    if (isNaN(ctx.session.selectedGateId))
    {
      await ctx.scene.enter(SceneNames.SELECT_GATE);
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
