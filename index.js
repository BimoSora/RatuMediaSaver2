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
  const startTime = Date.now() // <-- see this
  if(ctx.from.id == Number(config.ADMIN) || ctx.from.id == Number(config.ADMIN1) || ctx.from.id == Number(config.ADMIN2) || ctx.from.id == Number(config.ADMIN3) || ctx.from.id == Number(config.ADMIN4)){
    const url = ctx.text.replace('/url', '').trim();
    if (!url.length) return ctx.telegram.sendMessage(ctx.chat.id, 'No valid url found ')
    await ctx.telegram.sendMessage(ctx.chat.id,'Upload start')
    const buffer = await got(url).buffer()
    const sizeFile = buffer.byteLength; // <-- see this
    const { ext, mime } = await FileType.fromBuffer(buffer)
    let filename2 = ``;
    try {
      filename2 = new URL(url).pathname.split('/').pop();
    } catch (e) {
        console.error(e);
    }
    const allowedFileFormats = ['mov', 'webp', 'm4v', 'avi, 'flv', 'mkv', 'webm', '3gp', 'mpeg', 'mp4', 'mp3', 'pdf', 'rar', '7z', 'zip', 'png', 'jpeg', 'jpg', 'gif']
    if (allowedFileFormats.includes(ext)) {
        await ctx.telegram.sendDocument(ctx.chat.id,buffer,{
          fileName : filename2
        })
        const processTime = Date.now() - startTime; // <-- see this
        await ctx.telegram.sendMessage(ctx.chat.id,`Upload successful.\nSize file: ${bytes(sizeFile)}\nProcess time: ${processTime}ms`) // <-- and this
     } else {
        ctx.reply('File type not allowed')
     }
  }
})

bot.run()
