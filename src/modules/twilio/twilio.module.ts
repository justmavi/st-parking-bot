import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TwilioModule as TwilioModuleLocal } from 'nestjs-twilio';
import { TwilioController } from './twilio.controller';
import { HistoryModule } from '@history/history.module';
import { TwilioServiceWrapper } from './twilio.service';
import { AccountModule } from '@account/account.module';

@Module({
  imports: [
    TwilioModuleLocal.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        accountSid: config.get('twilio.sid'),
        authToken: config.get('twilio.token'),
      }),
      inject: [ConfigService],
    }),
    HistoryModule,
    AccountModule,
  ],

  controllers: [TwilioController],
  providers: [TwilioServiceWrapper],
  exports: [TwilioServiceWrapper],
})
export class TwilioModule {}
