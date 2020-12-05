const Discord = require('discord.js');
const client = new Discord.Client();

const request = require('request');
var URL = 'https://cjp.lil1.me/api';

client.on('ready', () => {
  console.log(`${client.user.tag}にログインしました`);
});

function translate(text) {
  return new Promise((data) => {
    request.get({
      uri: URL,
      headers: {
        'Content-type': 'application/json'
      },
      qs: {
        data: text
      },
      json: true
    }, function (err, res, body) {
      data(body.data);
    });
  });
}

client.on('message', async msg => {
  if (msg.author.bot) return
  if (msg.attachments.size > 0) return
  for (const [, role] of (await msg.guild.roles.fetch()).cache) {
    if (role.name === '怪レい日本语') {
      for (const [id, ] of (await role.members)) {
        if (msg.author.id === id) {

          const sendText = await translate(msg.content);
          if (!sendText || sendText === msg.content) return

          const username = (msg.member.nickname || msg.author.username) + ' (怪レい日本语)'
          const avatarURL = msg.author.avatarURL()
          const webhook = await (async () => {
            for (const [, webhook] of (await msg.channel.fetchWebhooks())) {
              if (webhook.name === '怪レい日本语') return webhook
            }
          })() || await msg.channel.createWebhook('怪レい日本语')
          await webhook.send(sendText, {
            username,
            avatarURL
          })
          await msg.delete()

          // Submarin
          if (msg.guild.id === '702430385916608592') {
            await client.channels.cache.get('747087748535681074')
              .send(msg.content)
          }

          return
        }
      }
    }
  }
})

client.login();