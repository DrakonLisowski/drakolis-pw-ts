module.exports = {
  apps : [
    {
      name: 'Ohuennij Bot Clary',
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
      name: 'Ohuennaya Mongo Clary',
      script: 'mongod',
      args: '--dbpath=./mongoData --port 1701',
      instances: 1,
      autorestart: true,
      watch: false,
    }
  ],
};
