import { AccountService } from '@account/account.service';
import { TelegramBaseHandler } from '@bot/base/handler.base';
import { Hears, Scene, SceneEnter, Ctx } from 'nestjs-telegraf';
import { lastValueFrom } from 'rxjs';
import { SceneNames } from '../constants/bot.constants';
import { Context } from '../types/context.type';
import { GATES } from '@common/constants/app.constants';

@Scene(SceneNames.SELECT_GATE)
export class GateScene extends TelegramBaseHandler {
  constructor(
    private readonly accountService: AccountService,
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

    this.answer(ctx, 'mainMenu');
  }

  @Hears(new RegExp(GATES.map(x => x.name).join('|')))
  public async onSelectGate(@Ctx() ctx: Context)
  {
    const selectedGateName = ctx.message['text'];

    console.log({ GATES, selectedGateName })

    if (!selectedGateName)
    {
      await ctx.scene.reenter();
      return;
    }

    const selectedGateIdx = GATES.findIndex(x => x.name === selectedGateName);

    console.log({ GATES, selectedGateName, selectedGateIdx })

    if (selectedGateIdx === -1) {
      await ctx.scene.reenter();
      return;
    }

    this.setState(ctx, 'selectedGateId', selectedGateIdx);
    await ctx.scene.enter(SceneNames.OPEN_GATE);
  }
}
