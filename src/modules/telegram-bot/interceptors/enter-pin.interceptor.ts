import { AccountService } from '@account/account.service';
import { SceneNames } from '@bot/constants/bot.constants';
import { Context } from '@bot/types/context.type';
import {
  Injectable,
  type CallHandler,
  type ExecutionContext,
  type NestInterceptor,
} from '@nestjs/common';
import { TelegrafExecutionContext } from 'nestjs-telegraf';
import { from, mergeMap } from 'rxjs';

@Injectable()
export class EnterPinInterceptor implements NestInterceptor {
  constructor(private readonly accountService: AccountService) {}

  public intercept(context: ExecutionContext, next: CallHandler) {
    const ctx = TelegrafExecutionContext.create(context).getContext<Context>();

    if (
      ctx.session.authorized ||
      ctx.scene.current?.id === SceneNames.ENTER_PIN ||
      ctx['command'] === 'start'
    )
      return next.handle();

    return from(this.accountService.findOne(ctx.from.id)).pipe(
      mergeMap((account) => {
        if (account) {
          ctx.session.authorized = true;
          return next.handle();
        }

        return from(ctx.scene.enter(SceneNames.ENTER_PIN));
      }),
    );
  }
}
