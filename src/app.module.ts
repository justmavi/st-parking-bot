import { BotModule } from '@bot/bot.module';
import { GlobalExceptionFilter } from '@common/filters/exception.filter';
import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_FILTER } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountModule } from 'modules/account/account.module';
import {
  WinstonModule,
  utilities as nestWinstonModuleUtilities,
} from 'nest-winston';
import * as winston from 'winston';
import 'winston-daily-rotate-file';
import config from './common/config/app.config';
import dataSource from './data-source';
import { TwilioModule } from './modules/twilio/twilio.module';
import { HistoryModule } from '@history/history.module';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [config] }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => {
        const isDevelopment =
          config.get<string>('global.nodeEnv') === 'development';

        return Object.assign(dataSource.options, {
          logging: isDevelopment ? 'all' : ['error', 'warn'],
          logger: isDevelopment ? 'advanced-console' : 'file',
        });
      },
    }),
    WinstonModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        transports: [
          configService.get<string>('global.nodeEnv') === 'development'
            ? new winston.transports.Console({
                format: winston.format.combine(
                  winston.format.timestamp({ format: 'DD-MM-YYYY HH:mm:SS' }),
                  nestWinstonModuleUtilities.format.nestLike('prankbot', {
                    prettyPrint: true,
                  }),
                ),
              })
            : new winston.transports.DailyRotateFile({
                filename: configService.get<string>('log.fileName'),
                dirname: configService.get<string>('log.directoryPath'),
                zippedArchive: true,
                datePattern: 'YYYY-MM-DD-HH',
                maxSize: '50m',
                maxFiles: '14d',
                format: winston.format.combine(
                  winston.format.timestamp({ format: 'DD-MM-YYYY HH:mm:SS' }),
                  winston.format.printf(
                    ({ level, message, timestamp, stack }) => {
                      return `[${level.toUpperCase()}] — ${timestamp}\t${message}\t${JSON.stringify(
                        stack,
                        null,
                        2,
                      )}`;
                    },
                  ),
                ),
              }),
        ],
      }),
    }),
    BotModule,
    AccountModule,
    HistoryModule,
    TwilioModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_FILTER,
      useClass: GlobalExceptionFilter,
    },
  ],
})
export class AppModule {}
