/* eslint-disable @typescript-eslint/no-floating-promises */
require('dotenv').config()
const { Telegraf, Markup } = require('telegraf')
const axios = require('axios')
const token = process.env.BOT_TOKEN
if (token === undefined) {
  throw new Error('BOT_TOKEN must be provided!')
}
const bot = new Telegraf(token);

const helpMessage = `
Segue a lista de comandos:

/start - inicia o bot
/help - ajuda
`;

// bot.start((ctx) => ctx.reply('Olá, digite /help para ver o que posso fazer!'))
bot.start((ctx, next) => {
    const quote = `Your limitation—it's only your imagination.`;
    // ctx.reply('Welcome ' + ctx.from.first_name + ', hope you are doing great!');
    // alternately
    bot.telegram.sendMessage(ctx.chat.id, 'Olá ' + ctx.from.first_name + ', espero que você esteja bem! 👋', { parse_mode: 'Markdown' });
    ctx.state.quote = quote;
    next(ctx); // next will basically trigger the next possible middleware (in this case, use will be triggered)
})

bot.help(ctx => {
    ctx.reply(helpMessage);
})

bot.command('frase', (ctx) => {
    bot.telegram.sendChatAction(ctx.chat.id, 'typing');
    getFrase()
    .then((result) => {
        ctx.telegram.sendMessage(ctx.chat.id, result)
    })

})

bot.command('cat', async ctx => {
    const input = ctx.message.text;
    const inputList = input.split(' ');

    if (inputList.length === 1) {
        try {
            const res = await axios.get('http://aws.random.cat/meow');
            bot.telegram.sendChatAction(ctx.chat.id, 'upload_photo');
            bot.telegram.sendPhoto(ctx.chat.id, res.data.file, { reply_to_message_id: ctx.message.message_id })
        } catch (err) {
            console.log(err);
        }
    } else {
        try {
            inputList.shift();
            const text = inputList.join(' ');
            bot.telegram.sendChatAction(ctx.chat.id, 'upload_photo');
            ctx.replyWithPhoto(`https://cataas.com/cat/says/${text}`);
        } catch (err) {
            console.log(err);
        }
    }
})

async function getFrase(){
    url = 'http://frasedodia.net/wp-json/wp/v2/posts?_fields=title&per_page=100'
    nr = Math.floor(Math.random() * 100) + 1
    let res = await axios.get(url)
    texto = res.data[nr].title.rendered
    texto = texto.replace(/<(.|\n)*?>/g, '');
    // console.log(texto)
    return texto
}

bot.command('fale', ctx => {
    const input = ctx.message.text;
    const inputList = input.split(' ');
    
    let message = '';
    // inputList - ['/echo']
    if (inputList.length === 1) message = `Eu preciso de algumas palavras para falar de volta 🌚`;
    else {
        inputList.shift();
        message = inputList.join(" ");
    }
    ctx.reply(message);
})


const keyboard = Markup.inlineKeyboard([
    // Markup.button.url('❤️', 'http://telegraf.js.org'),
    Markup.button.callback('Delete', 'delete')
  ])
  bot.on('message', (ctx) => ctx.telegram.sendCopy(ctx.message.chat.id, ctx.message, keyboard))
  bot.action('delete', (ctx) => ctx.deleteMessage())

// bot.command('simple', (ctx) => {
//     return ctx.replyWithHTML(
//       '<b>Coke</b> or <i>Pepsi?</i>',
//       Markup.keyboard(['Coke', 'Pepsi'])
//     )
//   })

//   bot.action('plain', async (ctx) => {
//     await ctx.answerCbQuery()
//     await ctx.editMessageCaption('Caption', Markup.inlineKeyboard([
//       Markup.button.callback('Plain', 'plain'),
//       Markup.button.callback('Italic', 'italic')
//     ]))
//   })

bot.launch();