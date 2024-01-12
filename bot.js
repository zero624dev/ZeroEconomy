const { Client, IntentsBitField, ActivityType } = require("discord.js");
const { Guilds, GuildMembers, GuildMessages, MessageContent } = IntentsBitField.Flags;
const client = new Client({ intents: [Guilds, GuildMembers, GuildMessages, MessageContent], });
client.mongoose = require("mongoose");
require("./addons/schema.js");
const { token, dbURL, logchannel } = require("./config.json");

const { QuickDB } = require("quick.db");
client.db = new QuickDB();

client.mongoose.connection.on("error", () => {
  client.core.utils.log(client, {
    embeds: [{
      title: "Mongoose Connection Error",
      color: client.core.colors.red
    }]
  });
});

client.mongoose.connect(dbURL);

client.kill = () => {
  process.kill(0);
};

client.cooldowns = new Map();

client.logchannel = logchannel;

client.core = require("./core/core.js");

for (const event of Object.keys(client.core.events)) {
  client.on(event, (...args) => {
    client.core.handlers.eventHandler(client, event, ...args);
  });
}

let guildCount = client.guilds.cache.size;
function checkGuildCount() {
  const curGuildCount = client.guilds.cache.size;
  if (guildCount !== curGuildCount) {
    guildCount = curGuildCount;
    client.user.setPresence({
      activities: [{
        name: `${guildCount}개의 서버 경제`,
        type: ActivityType.Watching,
      }],
      status: "online",
    });
  }
}

client.once("ready", () => {
  checkGuildCount();
  setInterval(checkGuildCount, 1000 * 30);
});

client.login(token);
