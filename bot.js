const Discord = require('discord.js');
const client = new Discord.Client();

const request = require('request');
var URL = 'https://cjp.lil1.me/api';

client.on('ready', () => {
  console.log(`${client.user.tag}にログインしました`);
});

client.on('message', msg => {
  if (msg.author.bot || !msg.member.roles.cache.find(r => r.name === "怪レい者")) return;
  request.get({
    uri: URL,
    headers: {
      'Content-type': 'application/json'
    },
    qs: {
      data: msg.content
    },
    json: true
  }, function (err, req, data) {
    msg.channel.send(data.data);
  });
});

client.login();