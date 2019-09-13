enum Application {
  WebSocket = 'websocket',
  TelegramManager = 'telegram-manager',
  InfoAPI = 'api-info',
  BotTGChannelManager = 'bot-tg-channelmanager',
}

async function appLoader(app: Application) {
  switch (app) {
    case Application.WebSocket:
      return (await import('./websocket')).default;
    case Application.TelegramManager:
      throw new Error('Unsupported service');
    case Application.InfoAPI:
      return (await import('./api-info')).default;
    case Application.BotTGChannelManager:
      return (await import('./bot-tg-channelmanager')).default;
    default:
      throw new Error('Unknown service');
  }
}

export { Application, appLoader };
