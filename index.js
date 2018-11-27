//Contect to Discord
const Discord = require('discord.js');
const client = new Discord.Client();
const token = process.env.DISCORD_BOT_SECRET;

//Used to keep bot running on Repl.it website
const keep_alive = require('./keep_alive.js')

//Required for HS API token
const unirest = require('unirest');

//Confirmation that bot has succesfully connected to Discord Server
client.on('ready', () => {
  console.log("I'm alive");
  console.log(client.user.username);
});

//Checks for '!hscard' command as well as parameter for card search
client.on('message', msg => {
  if (msg.content.startsWith('!hscard')) {
    var command = msg.content.split('!hscard ');
    var cardSelected = command[1];

    unirest.get("https://omgvamp-hearthstone-v1.p.mashape.com/cards/"+cardSelected)
      .header("X-Mashape-Key", process.env.HS_TOKEN)
      .end(function (res) {
        console.log(res.body[0])
        var cardInfo = res.body[0];

        if (cardInfo === undefined) {
          return msg.channel.send("Card not found")
        }

        msg.channel.send("Name: "+cardInfo.name);
        msg.channel.send("Cost: "+cardInfo.cost);
        msg.channel.send("Player Class: "+cardInfo.playerClass);
        msg.channel.send("Card Text: "+cardInfo.text);
        msg.channel.send("https://raw.githubusercontent.com/schmich/hearthstone-card-images/4.10.0/rel/"+cardInfo.dbfId+".png")

      });
  }
});

client.login(token);