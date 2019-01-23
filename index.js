//Import modules
const Discord = require('discord.js')
const config = require('./config.json')
const prefix = config.prefix

//Create instant of a discord client
const bot = new Discord.Client();
bot.commands = new Discord.Collection();

bot.on('ready', () => {
  console.log(`Velo is ready!`);
});

//Event listener for messages
bot.on('message', async message => {
  //If the author is a bot, return
  if(message.author.bot) return;
  //If the message is in a dm, return
  if(message.channel.type === 'dm') return;

  //Let command be the first "word" of the message
  let messageArray = message.content.split(' ');
  let command = messageArray[0];
  let args = messageArray.slice(1);
  //If the command doesn't start with prefix, return
  if(command.startsWith(prefix) == false) return;

  if(command === `${prefix}help`) {
    const helpEmbed = new Discord.RichEmbed()
      .setTitle('List of commands')
      .setAuthor('Velo 0.1.0')
      .setColor('#ffbc1a')
      .setDescription('Here\'s a list of commands. Keep in mind that I\'m still in development \
so you only have a few commands to choose from right now.')
      .addField('Moderation', 'ban\nunban\nkick\ndeafen\nundeafen\nmute\nunmute')
      .setTimestamp()
    message.channel.send(helpEmbed)
  }
  //$ping: If the message is $ping send the ping of the server
  if(command === `${prefix}ping`) {
    message.channel.send(`Pong! Your ping is ${Math.round(bot.ping)} ms.`);
  }
  //$mute: mute targeted user
  if(command === `${prefix}mute`) {
    if(message.member.hasPermission("MUTE_MEMBERS") == false) return message.channel.send("You do not have perms.");
    //Let toMute be the user mentioned
    let toMute = message.guild.member(message.mentions.users.first())
    if(!toMute) return message.channel.send("User not specified.");

    if(toMute.id === message.author.id) return message.channel.send("You can't mute yourself.");
    if(toMute.highestRole.position >= message.member.highestRole.position) return message.channel.send("You can't mute someone with a higher role than you.");

    if(toMute.mute == true) return message.channel.send("This user is already muted.");

    toMute.setMute(true);
    message.channel.send(`${toMute} has been muted.`);
    console.log(`${toMute.user.id} has been muted.`);
  }
  if(command === `${prefix}unmute`) {
    if(message.member.hasPermission("MUTE_MEMBERS") == false) return message.channel.send("You do not have perms.");
    //Let toMute be the user mentioned
    let toMute = message.guild.member(message.mentions.users.first())
    if(!toMute) return message.channel.send("User not specified.");

    if(toMute.highestRole.position >= message.member.highestRole.position) return message.channel.send("You can't unmute someone with a higher role than you.");

    if(toMute.mute == false) return message.channel.send("This user is not muted.");

    toMute.setMute(false)
      .catch(error => message.channel.send(`Sorry, I can't mute the user because: ${error}`))
    message.channel.send("User has been unmuted.");
    console.log(`${toMute.user.id} has been unmuted.`);
  }
  if(command === `${prefix}ban`) {
    if(message.member.hasPermission("BAN_MEMBERS") == false) return message.channel.send("You do not have perms.");
    //Let toMute be the user mentioned
    let toBan = message.guild.member(message.mentions.users.first())
    if(!toBan) return message.channel.send("User not specified.");

    if(toBan.highestRole.position >= message.member.highestRole.position) return message.channel.send("You can't ban someone with a higher role than you.");

    if(toBan.bannable == false) return message.channel.send("This user cannot be banned.");

    let banReason = args.slice(1);
    if(!banReason) return message.channel.send('You must provide a reason.')

    await toBan.ban(banReason.join(' '))
      .catch(error => message.channel.send(`Sorry, I can\'t ban the user because: ${error}`));
    message.channel.send(`${toBan} has been banned by ${message.author} because: ${banReason.join(' ')}`);
    console.log(`${toBan.user.id} has been banned because: ${banReason.join(' ')}.`);
  }
  if(command === `${prefix}purge`) {
    if(message.member.hasPermission("MANAGE_MESSAGES") == false) return message.channel.send("You do not have perms.");
    //Let toMute be the user mentioned
    let toMute = message.guild.member(message.mentions.users.first())
    if(!toMute) return message.channel.send("User not specified.");

    if(toMute.id === message.author.id) return message.channel.send("You can't mute yourself.");
    if(toMute.highestRole.position >= message.member.highestRole.position) return message.channel.send("You can't mute someone with a higher role than you.");

    if(toMute.mute == true) return message.channel.send("This user is already muted.");

    await toMute.setMute(true)
      .catch(error => message.channel.send(`Sorry, I can't purge the channel because: ${error}`));
    message.channel.send(`${toMute} has been muted.`);
    console.log(`${toMute} has been muted.`);
  }
  if(command === `${prefix}kick`) {
    if(message.member.hasPermission("MUTE_MEMBERS") == false) return message.channel.send("You do not have perms.");
    //Let toMute be the user mentioned
    let toKick = message.guild.member(message.mentions.users.first())
    if(!toKick) return message.channel.send("User not specified.");

    if(toKick.id === message.author.id) return message.channel.send('You can\'t kick yourself.');
    if(toKick.highestRole.position >= message.member.highestRole.position) return message.channel.send('You can\'t kick someone with a higher role than you.');
    if(toKick.kickable == false) return message.channel.send('Sorry, this user cannot be kicked.');

    let kickReason = args.slice(1);
    if(!kickReason) return message.channel.send('You must provide a reason.');

    await toKick.kick(kickReason.join(' '))
      .catch(error => message.channel.send(`Sorry, I can't kick the user because: ${error}`));
    message.channel.send(`${toKick} has been kicked by ${message.author} because: ${kickReason.join(' ')}`);
    console.log(`${toKick.user.id} has been kicked because: ${kickReason.join(' ')}.`);
  }
  if(command === `${prefix}deafen`) {
    if(message.member.hasPermission("DEAFEN_MEMBERS") == false) return message.channel.send("You do not have perms.");
    //Let toMute be the user mentioned
    let toDeafen = message.guild.member(message.mentions.users.first());
    if(!toDeafen) return message.channel.send("User not specified.");

    if(toDeafen.id === message.author.id) return message.channel.send("You can't deafen yourself.");
    if(toDeafen.highestRole.position >= message.member.highestRole.position) return message.channel.send("You can't deafen someone with a higher role than you.");

    if(toDeafen.deaf == true) return message.channel.send("This user is already deafened.");

    await toDeafen.setDeaf(true)
      .catch(error => message.channel.send(`Sorry, I can't deafen the user because: ${error}`));
    message.channel.send(`${toDeafen} has been deafened by ${message.author}.`);
    console.log(`${toDeafen.user.id} has been deafened.`);
  }
  if(command === `${prefix}undeafen`) {
    if(message.member.hasPermission("DEAFEN_MEMBERS") == false) return message.channel.send("You do not have perms.");
    //Let toMute be the user mentioned
    let toDeafen = message.guild.member(message.mentions.users.first());
    if(!toDeafen) return message.channel.send("User not specified.");

    if(toDeafen.id === message.author.id) return message.channel.send("You can't undeafen yourself.");
    if(toDeafen.highestRole.position >= message.member.highestRole.position) return message.channel.send("You can't undeafen someone with a higher role than you.");

    if(toDeafen.deaf == false) return message.channel.send("This user is already undeafened.");

    await toDeafen.setDeaf(false)
      .catch(error => message.channel.send(`Sorry, I can't undeafen the user because: ${error}`));
    message.channel.send(`${toDeafen} has been undeafened by ${message.author}.`);
    console.log(`${toDeafen.user.id} has been undeafened.`);
  }
  if(command === `${prefix}say`) {
    await message.channel.send(args.join(' '))
      .catch(error => message.channel.send(`Sorry, I can't say this because: ${error}`))
  }
});

bot.login(config.token);
