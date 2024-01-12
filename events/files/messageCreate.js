const minWage = 9620;
module.exports = (message) => {
  const { client } = message;

  if (message.author.bot || message.channel.type == "dm") {
    return;
  }

  if (Date.now() - (client.cooldowns.get(message.author.id) ?? 0) >= 300000) {
    client.cooldowns.set(message.author.id, Date.now());
    const reward = Math.round(minWage / 12);
    client.core.addons.econDB.addUserWallet(message.author.id, reward, true);
  }
};

