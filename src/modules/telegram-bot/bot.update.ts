import { Composer, Ctx, Hears, On, Start, Update } from 'nestjs-telegraf';
import { TelegramBaseHandler } from './base/handler.base';
import { SceneNames } from './constants/bot.constants';
import { Context } from './types/context.type';
import { GO_TO_MAIN_MENU_TEXT } from './messages';

@Update()
@Composer()
export class BotUpdate extends TelegramBaseHandler {
  @Start()
  public async start(@Ctx() ctx: Context) {
    if (ctx.scene.current) {
      await ctx.scene.leave();
    }

    await ctx.reply('👋');
    await this.selectGateOrEnterPin(ctx);
  }

  @Hears(GO_TO_MAIN_MENU_TEXT)
  public async mainMenu(@Ctx() ctx: Context)
  {
    await this.selectGateOrEnterPin(ctx);
  }

  private selectGateOrEnterPin(ctx: Context)
  {
    if (ctx.session.authorized)
      return ctx.scene.enter(SceneNames.SELECT_GATE);
    else
      return ctx.scene.enter(SceneNames.ENTER_PIN);
  }
}