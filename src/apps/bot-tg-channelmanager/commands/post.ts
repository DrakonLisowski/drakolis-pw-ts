// tslint:disable-next-line: import-name
import TelegramBot, { InlineKeyboardButton, InlineKeyboardMarkup } from 'node-telegram-bot-api';
import lodash from 'lodash';
import config from '../../../config';
import { RepostedPhoto } from '../../../entity/RepostedPhoto';

const likeIcon = '❤️';
const commandPost = (bot: TelegramBot) => {

  bot.on('photo', (msg) => {
    if (
      msg.caption &&
      msg.caption.startsWith('/post') &&
      msg.chat.type === 'private' &&
      config.telegramConfig.superAdminIds.includes(msg.from.id)
    ) {
      // Dragons ass channel id should be moved somehow?
      const bestPhotoSize = Math.max(...msg.photo.map(p => p.file_size));
      const fileId = msg.photo.find(p => p.file_size === bestPhotoSize).file_id;

      const photo = new RepostedPhoto();
      photo.fileId = fileId;
      photo.likes = 0;
      photo.voted = [];

      photo.save().then(savedPhoto => {
        const keyboard: InlineKeyboardButton[][] = [[{
          text: `${likeIcon} 0`,
          callback_data: JSON.stringify({
            type: 'likeButtonClick',
            pwId: savedPhoto.id,
            voted: [],
          }),
        }]];
        const markup: InlineKeyboardMarkup = {
          inline_keyboard: keyboard,
        };

        bot.sendPhoto(
          config.telegramConfig.channelManagerChannel,
          fileId,
          { reply_markup: markup, caption: msg.caption.replace('/post', '').trim() },
        );
      });
    }
  });
  bot.on('callback_query', (q) => {
    const data = JSON.parse(q.data);
    if (data.type === 'likeButtonClick') {
      const pwId = data.pwId;

      RepostedPhoto.findOne(pwId).then(
        (photoFromDB) => {
          if (!photoFromDB) {
            throw new Error('Wat?');
          }
          let voted = photoFromDB.voted;
          if (voted.includes(q.from.id)) {
            voted = voted.filter((e: number) => e !== q.from.id);
          } else {
            voted = [...voted, q.from.id];
          }
          photoFromDB.likes = voted.length;
          photoFromDB.voted = voted;

          photoFromDB.save().then(() => {
            const newMarkup = {
              inline_keyboard: [[{
                text: `${likeIcon} ${voted.length}`,
                callback_data: JSON.stringify({
                  voted, // TODO: It should be moved from here
                  type: 'likeButtonClick',
                  pwId: photoFromDB.id,
                }),
              }]],
            };

            bot.editMessageReplyMarkup(newMarkup, {
              chat_id: q.message.chat.id,
              message_id: q.message.message_id,
            }).then(() => {
              bot.answerCallbackQuery(q.id, { text: 'Your vote was processed!' });
            });
          });
        },
      );
    }
  });

  bot.onText(/\/getChat (.+)/, (msg, match) => {
    const chatId = msg.chat.id;
    const resp = match[1];

    bot.getChat(resp).then(chat =>  bot.sendMessage(chatId, JSON.stringify(chat)));
  });

  bot.onText(/\/getPhoto (.+)/, (msg, match) => {
    const chatId = msg.chat.id;
    const resp = match[1];

    bot.sendPhoto(chatId, resp);
  });
};

export default commandPost;
