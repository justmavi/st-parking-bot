import { AccountService } from '@account/account.service';
import { TelegramBaseHandler } from '@bot/base/handler.base';
import { ConfigService } from '@nestjs/config';
import { Ctx, On, Scene, SceneEnter } from 'nestjs-telegraf';
import { lastValueFrom } from 'rxjs';
import { SceneNames } from '../constants/bot.constants';
import { Context } from '../types/context.type';

@Scene(SceneNames.ENTER_PIN)
export class EnterPinScene extends TelegramBaseHandler {
  constructor(private readonly accountService: AccountService,
    private readonly config: ConfigService) {
    super();
  }

  @SceneEnter()
  public async onSceneEnter(ctx: Context) {
    await this.answer(ctx, 'start');
  }

  @On('text')
  public async onPinEnter(
    @Ctx() ctx: Context,
  ) {
    const enteredPin = ctx.message['text'];
    const realPin = this.config.get<number>('global.pinCode');

    if (enteredPin !== realPin) {
      await this.answer(ctx, 'incorrectPin');
      await ctx.scene.reenter();
      return;
    }

    this.setState(ctx, 'authorized', true);

    await lastValueFrom(
      this.accountService.create(ctx.from.id, ctx.from.first_name),
    );
    await ctx.scene.enter(SceneNames.SELECT_GATE);
  }
}
