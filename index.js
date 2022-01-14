// index.js
require('dotenv').config();
const {Snake} = require("tgsnake") // mengimpor modul.
const FileType = require('file-type');
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
    const url = ctx.text.replace('/url', '').trim();
    if (!url.length) return ctx.telegram.sendMessage(ctx.chat.id, 'No valid url found ')
    await ctx.telegram.sendMessage(ctx.chat.id,'Upload start')
    const buffer = await got(url).buffer()
    const { mime } = await FileType.fromBuffer(buffer)
    let filename2 = ``;
    try {
      filename2 = new URL(url).pathname.split('/').pop();
    } catch (e) {
        console.error(e);
    }
    if (mime.startsWith('video')) {
        await ctx.telegram.sendDocument(ctx.chat.id,buffer,{
          fileName : filename2
        }, {
        })
        await ctx.telegram.sendMessage(ctx.chat.id,'Upload successful')
    } else if (mime.startsWith('image')) {
        await ctx.telegram.sendDocument(ctx.chat.id,buffer,{
          fileName : filename2
        }, {
        })
        await ctx.telegram.sendMessage(ctx.chat.id,'Upload successful')
    } else if (mime.startsWith('application')) {
        await ctx.telegram.sendDocument(ctx.chat.id,buffer,{
          fileName : filename2
        }, {
        })
        await ctx.telegram.sendMessage(ctx.chat.id,'Upload successful')
    } else {
        await ctx.telegram.sendMessage(ctx.chat.id,'File type not allowed')
    }
  }
})

bot.run()