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

bot.on('url', async ctx => {
  const url = ctx.message.text.replace('/url', '').trim()
  const buffer = await got(url).buffer()
  let filename2 = ``;
  try {
    filename2 = new URL(url).pathname.split('/').pop();
  } catch (e) {
      console.error(e);
  }
  await ctx.telegram.sendDocument(ctx.chat.id,buffer,{
    fileName : filename2
  })
  await ctx.telegram.sendMessage(ctx.chat.id,`Upload successful.`);
})

bot.run()
