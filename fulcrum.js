const { Client, IntentsBitField } = require("discord.js");
const { Guilds, GuildMembers, GuildModeration } = IntentsBitField.Flags;
const client = new Client({ intents: [Guilds, GuildMembers, GuildModeration], });
require("dotenv").config();

const { QuickDB } = require("quick.db");
client.db = new QuickDB();

client.cooldowns = new Map();

client.logchannel = process.env.BOT_LOGCHANNEL;

client.core = require("./core/core.js");

for (const event of Object.keys(client.core.events)) {
  client.on(event, (...args) => {
    client.core.handlers.eventHandler(client, event, ...args);
  });
}

client.once("ready", () => {
  client.user.setPresence({
    activities: [{
      name: "the stars",
      type: 3,
    }],
    status: "idle",
  });
});

console.log(process.env);
client.login(process.env.BOT_TOKEN);
