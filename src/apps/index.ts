enum Application {
  BotTGForClara = 'bot-tg-clara',
}

async function appLoader(app: Application) {
  switch (app) {
    case Application.BotTGForClara:
      return (await import('./bot-tg-clara')).default;
    default:
      throw new Error('Unknown service');
  }
}

export { Application, appLoader };
