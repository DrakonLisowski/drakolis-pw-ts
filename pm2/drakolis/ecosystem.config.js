module.exports = {
  apps : [
    {
    name: '[Drakolis.PW] WebSocket',
    script: 'ts-node',
    args: './src/runner websocket',
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
  // {
  //   name: '[Drakolis.PW] TelegramManager',
  //   script: 'npm',
  //   args: 'start telegram-manager',
  //   instances: 1,
  //   autorestart: true,
  //   watch: true,
  //   ignore_watch: ['[\/\\]\./', 'node_modules', 'logs'],
  //   max_memory_restart: '1G',
  //   env: {
  //     NODE_ENV: 'development'
  //   },
  //   env_production: {
  //     NODE_ENV: 'production'
  //   },
  //   kill_timeout : 3000
  // },
    {
      name: '[Drakolis.PW] HTTP API',
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
    },
    {
      name: '[Drakolis.PW] RTMP Server',
      script: 'ts-node',
      args: './src/runner rtmp-server',
      instances: 1,
      exec_mode: 'fork',
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
  ],
/*
  deploy : {
    production : {
      user : 'node',
      host : '212.83.163.1',
      ref  : 'origin/master',
      repo : 'git@github.com:repo.git',
      path : '/var/www/production',
      'post-deploy' : 'npm install && pm2 reload ecosystem.config.js --env production'
    }
  }
*/
};
