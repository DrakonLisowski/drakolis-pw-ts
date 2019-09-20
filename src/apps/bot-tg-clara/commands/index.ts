// tslint:disable-next-line: import-name
import { Message } from 'node-telegram-bot-api';
import path from 'path';
import TelegramBotService from '../../../services/telegramBot';
import { ServiceInjector } from '../../../services/ServiceInjector';
import LoggerService from '../../../services/logger';
import FFmpegService from '../../../services/ffmpegBot';

const bot = ServiceInjector.resolve<TelegramBotService>(TelegramBotService);
const logger = ServiceInjector.resolve<LoggerService>(LoggerService).addLabel('TGBotClara');
const ffmpeg = ServiceInjector.resolve<FFmpegService>(FFmpegService);

interface ITGCommand {
  name: string;
  regexp: RegExp;
  command: (a: Message, b: any) => void;
  description: string;
}

const commands: ITGCommand[] = [
  {
    name: '/ffmpeg',
    regexp: /\/ffmpeg/,
    command: async (msg, match) => {
      const chatId = msg.chat.id;
      const file = msg.reply_to_message
        && (msg.reply_to_message.document || msg.reply_to_message.video);
      if (file && file.mime_type) {
        const type = file.mime_type.split('/')[0];
        if (type === 'video') {
          const fileID = file.file_id;
          logger.info(fileID);
          await bot.sendMessage(chatId, `Download start. FileID: ${fileID}`);
          try {
            const fileName = (await bot
              .downloadFile(fileID, path.join(process.cwd(), 'download-files'))).split('/');
            await bot.sendMessage(chatId, `download complete.
Local file name: ${fileName[fileName.length - 1]}`);
            logger.info(JSON.stringify(fileName));
            logger.info(fileName[fileName.length - 1]);

            ffmpeg.run(
              path.join(process.cwd(), 'download-files', fileName[fileName.length - 1]),
              path.join(process.cwd(), 'converted-files', fileName[fileName.length - 1]),
              [],
            );
          } catch (e) {
            await bot.sendMessage(chatId, 'download error');
            logger.error(e);
          }
        }
      } else {
        bot.sendMessage(chatId, `please reply video message!`);
      }

    },
    description: `ffmpeg converter`,
  },
  {
    name: '/test',
    regexp: /\/test/,
    command: (msg, match) => {
      const chatId = msg.chat.id;
      bot.sendMessage(chatId, `Test!`);
    },
    description: `Test working bot`,
  },
  {
    name: '/help',
    regexp: /\/help/,
    command: (msg, match) => {
      let text = `It is help`;
      const commandsHelp = commands.map(item => `${item.name} - ${item.description}`);
      text = [text, ...commandsHelp].join('\n');
      const chatId = msg.chat.id;
      bot.sendMessage(chatId, text);
    },
    description: 'Display this message',
  },
];
const loadCommands = () => {
  commands.forEach((item) => {
    bot.onText(item.regexp, item.command);
  });
};

export default loadCommands;
