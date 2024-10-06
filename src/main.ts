import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { getBotToken } from 'nestjs-telegraf';
import { Telegraf } from 'telegraf';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  const port = configService.get<number>('global.httpPort');
  const botWebhookUrl = configService.get<string>('telegram.botWebhookUrl');
  const secretToken = configService.get<string>('telegram.secretToken');

  const bot = app.get<Telegraf>(getBotToken());
  app.use(bot.webhookCallback(botWebhookUrl, { secretToken }));

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );
  app.enableCors({
    allowedHeaders: '*',
    origin: '*',
    credentials: true,
  });
  app.setGlobalPrefix('api');

  await app.listen(port);

  console.log('Now listening port', port);
}
void bootstrap();
