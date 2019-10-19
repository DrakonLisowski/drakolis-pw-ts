module.exports = {
  apps : [
    // {
    //   name: 'OhuennijBotClary',
    //   script: 'ts-node',
    //   args: './src/runner bot-tg-clara',
    //   instances: 1,
    //   autorestart: true,
    //   watch_delay: 5000,
    //   watch: ['src'],
    //   env: {
    //     NODE_ENV: 'development'
    //   },
    //   env_production: {
    //     NODE_ENV: 'production'
    //   },
    //   kill_timeout : 3000
    // },
    {
      name: 'BotIGClara',
      script: 'ts-node',
      args: './src/runner bot-ig',
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
    },
    {
      name: '[Clara-Blitz.PW] HTTP API',
      script: 'ts-node',
      args: './src/runner http-api',
      instances: 0,
      exec_mode: 'cluster',
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
    },
    {
      name: 'OhuennayaMongoClary',
      script: 'mongod',
      args: '--dbpath=./mongoData --port 1701',
      instances: 1,
      autorestart: true,
      watch: false,
    },
  ],
};
