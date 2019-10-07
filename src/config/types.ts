
// tslint:disable: max-classes-per-file
export type EnvironmentConfig = 'production'|'development';
export type LogLevel = 'error'|'warn'|'info'|'verbose'|'debug'|'silly';
export class LogConfig {
  public console: boolean;
  public file: boolean;
  public fileNamePrefix: string;
  public fileNamePostfix: string;
  public level: LogLevel;
}
export class ServiceRegistryConfig {
  public startingConcurrency: number;
  public startingTimeout: number;
}
export class PostgressConfig {
  public host: string;
  public port: number;
  public username: string;
  public password: string;
  public database: string;
  public schema: string;
}

export class MongoConfig {
  public host: string;
  public port: number;
  public database: string;
}

export class RedisConfig {
  public host: string;
  public port: number;
}

export class HostConfig {
  public host: string;
  public port: number;
}

export class TelegramConfig {
  public appID: number;
  public appKey: string;
  public tdLibBinaryPath: string;
  public tdLibAppPath: string;

  public telegramBotToken: string;
  public channelManagerChannel: number;

  public superAdminIds: number[];
}

export class InstagramConfig {
  public username: string;
  public password: string;
}

export class SecretsConfig {
  public environmentSecret: string;
}

export class RTMPConfig {
  public port: number;
  public chunkSize: number;
  public gopCache: boolean;
  public ping: number;
  public pingTimeout: number;
  public httpPort: number;
  public mediaRoot?: string = './media';
  public allowOrigin?: string = '*';
  public ffmpeg?: string = '/usr/bin/ffmpeg';
}

// trans: {
//   ffmpeg: '/usr/bin/ffmpeg',
//   tasks: [
//       {
//           app: 'live',
//           hls: true,
//           hlsFlags: '[hls_time=2:hls_list_size=3:hls_flags=delete_segments]',
//           dash: true,
//           dashFlags: '[f=dash:window_size=3:extra_window_size=5]'
//       }
//   ]
// }
