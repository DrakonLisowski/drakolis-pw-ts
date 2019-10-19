enum Application {
  WebSocket = 'websocket',
  TelegramManager = 'telegram-manager',
  HttpAPI = 'http-api',
  BotTGChannelManager = 'bot-tg-channelmanager',
  BotTGClara = 'bot-tg-clara',
  BotIG = 'bot-ig',
  RTMPServer = 'rtmp-server',
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
    case Application.BotTGClara:
      return (await import('./bot-tg-clara')).default;
    case Application.BotIG:
      return (await import('./bot-ig')).default;
    case Application.RTMPServer:
      return (await import('./rtmp-server')).default;
    default:
      throw new Error('Unknown service');
  }
}

export { Application, appLoader };
