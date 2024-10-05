import { AccountModule } from '@account/account.module';
import { HistoryModule } from '@history/history.module';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TwilioModule } from '@twilio/twilio.module';
import { TelegrafModule } from 'nestjs-telegraf';
import { session } from 'telegraf';
import { BotUpdate } from './bot.update';
import { Memory } from '@telegraf/session';
import { CallScene } from './scenes/call.scene';
import { EnterPinInterceptor } from './interceptors/enter-pin.interceptor';

@Module({
  imports: [
    TelegrafModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        token: configService.get<string>('telegram.botToken'),
        botName: configService.get<string>('telegram.botName'),
        launchOptions: {
          webhook: {
            domain: configService.get<string>('global.host'),
            hookPath: configService.get<string>('telegram.botWebhookUrl'),
            secretToken: configService.get<string>('telegram.secretToken'),
          },
        },
        middlewares: [
          session({
            store: Memory(),
            defaultSession: () => ({}),
            getSessionKey: (ctx) => ctx.from.id,
          }),
        ],
      }),
      inject: [ConfigService],
    }),
    AccountModule,
    TwilioModule,
    HistoryModule,
  ],
  providers: [
    BotUpdate,
    EnterPinInterceptor,
    CallScene,
  ],
})
export class BotModule {}
