const Discord = require('discord.js');
const client = new Discord.Client();

const fetch = require('node-fetch');
var URL = 'https://cjp.vercel.app/api/';

client.on('ready', () => {
  console.log(`${client.user.tag}にログインしました`);
  client.user.setActivity()
});

async function translate(text) {
  try {
    const data = await fetch(URL, {
      method: 'POST',
      body: JSON.stringify({
        data: text
      }),
      headers: {
        'Content-type': 'application/json'
      }
    })
    return (await data.json()).data
  } catch {
    return text
  }
}

client.on('message', async msg => {
  if (msg.author.bot) return
  if (msg.attachments.size > 0) return
  for (const [, role] of (await msg.guild.roles.fetch()).cache) {
    if (role.name === '怪レい日本语' || msg.content.startsWith('cjp>')) {
      msg.content = msg.content.replace(/cjp>|cjp> /g, "")
      for (const [id, ] of (await role.members)) {
        if (msg.author.id === id) {

          const sendText = await translate(msg.content);
          if (!sendText || sendText === msg.content) return

          const username = await translate((msg.member.nickname || msg.author.username));
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

          // 携帯bot墓場
          if (msg.guild.id === '769902624291553341') {
            await client.channels.cache.get('807516484548689930')
              .send(msg.content)
          }

          return
        }
      }
    }
  }
})

client.login();