// tslint:disable-next-line: import-name
import TelegramBot, { InlineKeyboardButton, InlineKeyboardMarkup } from 'node-telegram-bot-api';
import lodash from 'lodash';
import config from '../../../config';

const commandPost = (bot: TelegramBot) => {

  // Works like GET arguments for now (should have several steps)
  // text= - sets the text of message (combine all, linebreaks)
  // button= - sets the buttons (combine all)
  // timeout= - sets the message timeout (min, only first works)
  // attachedImage - sends it
  // attachedMessage - sends it
  bot.on('photo', (msg) => {
    if (msg.chat.type === 'private' && config.telegramConfig.superAdminIds.includes(msg.from.id)) {
      console.log(msg);
      // Dragons ass channel id should be moved somehow?
      const bestPhotoSize = Math.max(...msg.photo.map(p => p.file_size));
      bot.sendPhoto(
        -1001315453164,
        msg.photo.find(p => p.file_size === bestPhotoSize).file_id,
        { },
      );
    }
  });
  // , (msg, match) => {

  //   const requestRaw = match[1];
  //   const requestArray = requestRaw.split('&');
  //   const request = {
  //     text: requestArray
  //       .filter(p => p.startsWith('text='))
  //       .map(p => p.replace('text=', ''))
  //       .join('\n'),
  //     buttons: lodash.uniq(
  //       requestArray
  //         .filter(p => p.startsWith('button='))
  //         .map(p => p.replace('button=', '')),
  //     ),
  //   };
  //   console.log(msg);
  //   const chatId = msg.chat.id;

  //   const keyboard: InlineKeyboardButton[][] = [request.buttons.map(s => ({
  //     text: `${s} 0`,
  //     callback_data: JSON.stringify({ type: 'addToButton', button: s, voted: [] }),
  //   }))];
  //   const markup: InlineKeyboardMarkup = {
  //     inline_keyboard: keyboard,
  //   };

  //   // send back the matched "whatever" to the chat
  //   bot.sendMessage(chatId, request.text, { reply_markup: markup });
  // });
  bot.on('callback_query', (q) => {
    const data = JSON.parse(q.data);
    if (data.type === 'addToButton') {
      const button = data.button;
      const voted = data.voted;
      if (voted.includes(q.from.id)) {
        return;
      }

      // @ts-ignore
      const oldMarkup = q.message.reply_markup || null;
      const newMarkup = {
        inline_keyboard: [oldMarkup.inline_keyboard[0]
          .map((b: InlineKeyboardButton) => {
            if (b.text.startsWith(button)) {
              return {
                text: `${button} ${parseInt(b.text.split(' ')[1], 10) + 1}`,
                callback_data: JSON.stringify({
                  button,
                  type: data.type,
                  voted: [...voted, q.from.id],
                }),
              };
            }
            return b;
          },
          )],
      };
      bot.editMessageReplyMarkup(newMarkup, {
        chat_id: q.message.chat.id,
        message_id: q.message.message_id,
      });
    }
  });
};

export default commandPost;
