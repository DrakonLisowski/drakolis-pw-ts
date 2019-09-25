// tslint:disable-next-line: import-name
import { Message } from 'node-telegram-bot-api';
import path from 'path';
import fs from 'fs';
import TelegramBotService from '../../../services/telegramBot';
import InstaService from '../../../services/instaService';
import { ServiceInjector } from '../../../services/ServiceInjector';
import LoggerService from '../../../services/logger';
import FFmpegService from '../../../services/ffmpegBot';
import ContextService from '../../../services/context';
import { IgApiClient } from 'instagram-private-api';

interface ITGCommand {
  name: string;
  regexp: RegExp;
  command: (a: Message, b: any) => void;
  description: string;
}

const loadCommands = async () => {
  const context = ServiceInjector.resolve<ContextService>(ContextService)
  .addSubContext(this, null, 'Commands');
  const logger = ServiceInjector.resolve<LoggerService>(LoggerService)
    .addLabels(context.getContext(this));
  logger.info('Start load commands');

  const botService = ServiceInjector.resolve<TelegramBotService>(TelegramBotService);
  const ffmpeg = ServiceInjector.resolve<FFmpegService>(FFmpegService);
  const insta = ServiceInjector.resolve<InstaService>(InstaService);
  const bot = await botService.init(true);
  const IgApi = await insta.init();

  const commands: ITGCommand[] = [
    {
      name:  '/IGuserid <username>',
      regexp: /\/IGuserid (.+)/,
      command: async (msg, match) => {
        const chatId = msg.chat.id;
        const userID = await insta.getUserID(match[1]);
        await bot.sendMessage(chatId, `User ID: ${userID}`);
        return;
      },
      description: `Get user ID by username.`,
    },
    {
      name:  '/IGuserinfo <userID>',
      regexp: /\/IGuserinfo (.+)/,
      command: async (msg, match) => {
        const chatId = msg.chat.id;
        const userInfo = await insta.loadUser(match[1]);
        await bot.sendMessage(chatId, `User info: \n${JSON.stringify(userInfo)}`);
        return;
      },
      description: `Get user info`,
    },
    {
      name: '/ffmpeg',
      regexp: /\/ffmpeg/,
      command: async (msg, match) => {
        const chatId = msg.chat.id;
        const file = msg.reply_to_message
          && (msg.reply_to_message.document || msg.reply_to_message.video);
        if (file && file.mime_type) {
          const type = file.mime_type.split('/')[0];
          const format = file.mime_type.split('/')[1];
          if (type === 'video') {
            const fileID = file.file_id;
            logger.info(fileID);
            await bot.sendMessage(chatId, `Download start. FileID: ${fileID}`);
            try {
              const fileStream = await bot.getFileStream(fileID);
              const fileName = `${fileID}.${format}`;
              const sourceFile = path.join(process.cwd(), 'download-files', fileName);
              const makeFile = new Promise((res, rej) => {
                const writeStream = fs.createWriteStream(sourceFile);
                fileStream.pipe(writeStream);
                fileStream.on('end', res);
                fileStream.on('error', rej);
              });
              await makeFile;
              // await fs.writeFileSync(sourceFile, fileStream);
              await bot.sendMessage(chatId, `download complete.
  Local file name: ${fileName}`);
              logger.info(JSON.stringify(fileName));
              const convertedFile = path.join(process.cwd(), 'converted-files', `${fileID}.mp4`);
              ffmpeg.run(
                sourceFile,
                convertedFile,
                [],
              );
              const awaitStatus = async () => {
                const status = await ffmpeg.getStatus();
                if (status.end) {
                  if (status.error === null) {
                    await bot.sendMessage(chatId, `converte done`);
                    logger.info(convertedFile);
                    const streamConverted = await fs.createReadStream(convertedFile);
                    const sendDocument = bot.sendDocument(chatId, streamConverted);
                    await sendDocument;
                  } else {
                    await bot.sendMessage(chatId, `converte error: ${status.error}`);
                  }
                  await ffmpeg.processDone();
                } else {
                  if (status.progress !== null) {
                    await bot.sendMessage(chatId, `converte in progress:
  ${status.progress.percent.toString().split('.')[0]}`);
                  }
                  await setTimeout(async () => { await awaitStatus(); }, 5000);
                }
              };
              await awaitStatus();
            } catch (e) {
              bot.sendMessage(chatId, 'download error');
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

  commands.forEach((item) => {
    bot.onText(item.regexp, item.command);
  });
};

export default loadCommands;
