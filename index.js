// index.js
require('dotenv').config();
const {Snake} = require("tgsnake");
const got = require('got');
const config = require('./config.js');

const bot = new Snake({
  apiHash : `${config.apiHash}`,
  apiId : `${config.apiId}`,
  botToken : `${config.botToken}`,
  tgSnakeLog : true,
  logger: `info`
})

//Function
function first_name(ctx){
  return `${ctx.from.firstName ? ctx.from.firstName : ""}`;
}
function last_name(ctx){
  return `${ctx.from.lastName ? ctx.from.lastName : ""}`;
}
function username(ctx){
  return ctx.from.username ? `@${ctx.from.username}` : "";
}
function fromid(ctx){
  return ctx.from.id ? `[${ctx.from.id}]` : "";
}

// bot.generateSession() // aktifkan ini untuk menghasilkan sesi dan nonaktifkan bot.run().

bot.hears(new RegExp(`^[${bot.prefix}](url) (https?:\/\/.*)`,""),async (ctx) => {
  if(ctx.from.id == Number(config.ADMIN) || ctx.from.id == Number(config.ADMIN1) || ctx.from.id == Number(config.ADMIN2) || ctx.from.id == Number(config.ADMIN3) || ctx.from.id == Number(config.ADMIN4)){
    const url = ctx.text.replace('/url', '').trim()
    //if (!url) return ctx.telegram.sendMessage(chatId, 'No valid url found')
    const filename = url.split('/').pop()

    var regex3 = /\.[A-Za-z0-9]+$/gm
    var doctext3 = filename.replace(regex3, '');
    var doctext4 = filename.replace(regex3, 'null');

    if(doctext3 == doctext4){
      await ctx.telegram.sendMessage(ctx.chat.id,`Exstension not found`)
    }else{
      await ctx.telegram.sendMessage(ctx.chat.id,`Upload start!`)
      const buffer = []
      const stream = got.stream(url)
      stream
      .on('error', () => ctx.telegram.sendMessage(ctx.chat.id, 'An error has occurred'))
      .on('progress', p => console.log(p))
      .on('data', chunk => buffer.push(chunk))
      .on('end', async () => {
        await ctx.telegram.sendDocument(ctx.chat.id, Buffer.concat(buffer),{
          fileName : filename
        })
        await ctx.telegram.sendMessage(ctx.chat.id,`Name: ${filename}`)
        await ctx.telegram.sendMessage(ctx.chat.id,`Upload successful`)
      })
    }
  }
})

bot.run()
