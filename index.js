// index.js
require('dotenv').config();
const {Snake} = require("tgsnake");
const got = require('got');
const config = require('./config.js');

const youtubedl = require('youtube-dl-exec');

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
    const regex = /youtube.com|youtu.be/g;
    const found = url.match(regex);
    
    if (found == 'youtube.com' || found == 'youtu.be'){
      let message_id = ctx.id;
      let args =  ctx.text.split(' ');
      let url = args[1];
      let mention = `@${ctx.from.username}`;
      var dq = "2160";
      let allowed_qualities = ['144','240','360','480','720','1080','1440','2160'];
      if(!url.match(/^(?:https?:)?(?:\/\/)?(?:youtu\.be\/|(?:www\.|m\.)?youtube\.com\/(?:watch|v|embed)(?:\.php)?(?:\?.*v=|\/))([a-zA-Z0-9\_-]{7,15})(?:[\?&][a-zA-Z0-9\_-]+=[a-zA-Z0-9\_-]+)*(?:[&\/\#].*)?$/)) return ctx.telegram.sendMessage(ctx.chat.id,"Enter a valid youtube url",{ replyToMsgId: message_id , parse_mode: 'Markdown'})
      if(args[2] && allowed_qualities.includes(args[2])){
        var dq = `${args[2]}`
        ctx.telegram.sendMessage(ctx.chat.id,"Processing your video with the chosen quality",{ replyToMsgId: message_id , parse_mode: 'Markdown'})
      }else if(!args[2]){
        ctx.telegram.sendMessage(ctx.chat.id,"Processing your video with max quality",{ replyToMsgId: message_id , parse_mode: 'Markdown'})
      }else if(args[2] && !allowed_qualities.includes(args[2])){
        ctx.telegram.sendMessage(ctx.chat.id,"Invalid quality settings chosen , video will be downloaded with highest possible quality",{ replyToMsgId: message_id , parse_mode: 'Markdown'})
      }
      if(ctx.from.username == undefined){
        mention = ctx.from.first_name
      }
      try{
        youtubedl(url, {
          format: `bestvideo[height<=${dq}]+bestaudio/best[height<=${dq}]`,
          dumpSingleJson: true,
          noWarnings: true,
          noCallHome: true,
          noCheckCertificate: true,
          preferFreeFormats: true,
          youtubeSkipDashManifest: true,
        }).then(async output => {
            const filename = `${output.title}.mp4`
            await ctx.telegram.sendMessage(ctx.chat.id,`Upload start!`)
            const buffer = []
            const stream = got.stream(output.requested_formats[0].url)
            stream
            .on('error', () => ctx.telegram.sendMessage(ctx.chat.id, 'An error has occurred'))
            .on('progress', p => console.log(p))
            .on('data', chunk => buffer.push(chunk))
            .on('end', async () => {
              await ctx.telegram.sendDocument(ctx.chat.id,Buffer.concat(buffer),{
                fileName : filename
              })
              await ctx.telegram.sendMessage(ctx.chat.id,filename)
              await ctx.telegram.sendMessage(ctx.chat.id,`Upload successful`)
            })
          })
        }catch (error) {
          console.error(error);
          ctx.telegram.sendMessage(ctx.chat.id,"***Error occurred, Make sure your sent a correct URL***",{ replyToMsgId: message_id , parse_mode: 'Markdown'})
      }

    }else{

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
          await ctx.telegram.sendDocument(ctx.chat.id,Buffer.concat(buffer),{
            fileName : filename
          })
          await ctx.telegram.sendMessage(ctx.chat.id,filename)
          await ctx.telegram.sendMessage(ctx.chat.id,`Upload successful`)
        })

      }
    }
  }
})

bot.run()
