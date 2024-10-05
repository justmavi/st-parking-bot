export default () => ({
  global: {
    httpPort: process.env.HTTP_PORT ?? 5549,
    nodeEnv: process.env.NODE_ENV ?? 'development',
    host: process.env.APP_HOST ?? 'http://localhost:5549',
    pinCode: process.env.BOT_UNLOCK_PIN_CODE ?? 'changeme'
  },
  log: {
    directoryPath: process.env.LOG_DIRECTORY_PATH ?? './logs',
    fileName: process.env.LOG_FILE_NAME ?? 'armprankbot-err-%DATE%.log',
  },
  telegram: {
    botName: process.env.TELEGRAM_BOT_NAME ?? 'armprankbot',
    botToken: process.env.TELEGRAM_BOT_TOKEN,
    secretToken: process.env.TELEGRAM_SECRET_TOKEN,
    botWebhookUrl: process.env.TELEGRAM_BOT_WEBHOOK_URL ?? '/bot-webhook',
    privateChannelId: +process.env.TELEGRAM_PRIVATE_CHANNEL_ID,
  },
  twilio: {
    sid: process.env.TWILIO_ACCOUNT_SID,
    token: process.env.TWILIO_AUTH_TOKEN,
    callStatusCallback: '/api/twilio/call',
    recordingStatusCallback: '/api/twilio/recording',
  }
});
