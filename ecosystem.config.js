module.exports = {
  apps: [
    {
      name: '[Drakolis.PW] BotTG Channel Manager',
      script: 'ts-node',
      args: './src/runner bot-tg-channelmanager',
      instances: 1,
      autorestart: true,
      watch_delay: 5000,
      watch: ['src'],
      env: {
        NODE_ENV: 'development'
      },
      env_production: {
        NODE_ENV: 'production'
      },
      kill_timeout : 3000
    }
  ],
};
