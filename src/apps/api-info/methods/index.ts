// tslint:disable-next-line: import-name
import TelegramBot from 'node-telegram-bot-api';
import { Method, MethodHandler } from 'jayson';
import authCheck from './middlewares/authCheck';
import { Service } from '../../../services/eService';

const penis = '8===D';
const methods = (registry: any) => {

  const drawAPenis: MethodHandler = (args, callback) => {
    callback(null, penis);
  };

  const getTGUserInfo: MethodHandler = (args, callback) => {
    // @ts-ignore
    const userId = args.userId;
    const bot = registry[Service.TelegramBot] as TelegramBot;
    bot.getChat(userId).then(chat => callback(null, chat));
  };

  return {
    drawAPenis: new Method(drawAPenis),
    drawAPenisAuth: new Method(authCheck(drawAPenis)),
    getTGUserInfo: new Method(authCheck(getTGUserInfo)),
  };
};

export default methods;
