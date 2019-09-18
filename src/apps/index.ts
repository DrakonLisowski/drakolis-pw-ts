enum Application {
  WebSocket = 'websocket',
  TelegramManager = 'telegram-manager',
  HttpAPI = 'http-api',
  BotTGChannelManager = 'bot-tg-channelmanager',
}

async function appLoader(app: Application) {
  switch (app) {
    case Application.WebSocket:
      return (await import('./websocket')).default;
    case Application.TelegramManager:
      throw new Error('Unsupported service');
    case Application.HttpAPI:
      return (await import('./http-api')).default;
    case Application.BotTGChannelManager:
      return (await import('./bot-tg-channelmanager')).default;
    default:
      throw new Error('Unknown service');
  }
}

export { Application, appLoader };
