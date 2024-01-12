module.exports = (client) => {
  const { core } = client;
  client.application.commands.fetch({ guildId: "1176759489366589550" }).then((cmds) => {
    if (cmds.filter((cmd) => {
      return cmd.name == "upload";
    }).size == 0) {
      core.utils.upload(client).then((returned) => {
        const { cmdList, status } = returned;
        core.utils.log(client, {
          embeds: [{
            title: "Auto-Uploaded",
            fields: (() => {
              const fields = [];
              for (const guild of Object.keys(status)) {
                fields.push({
                  name: `${guild == "global" ? "Global" : guild}${status[guild] ? " [Success]" : " [Failed]"}`,
                  value: `\`\`\`\n${cmdList[guild].map((cmd) => {
                    return cmd.name;
                  }).join("\n")}\`\`\``,
                  inline: true
                });
              }
              return fields;
            })(),
            color: (() => {
              let errored = false;
              for (const guild of Object.keys(status)) {
                if (status[guild] == false) {
                  errored = true;
                }
              }
              return errored ? core.colors.red : core.colors.orange;
            })()
          }]
        });
      }).catch(() => {
        return;
      });
    }
  });
  client.db.get("bot-restart").then((restart) => {
    if (!restart) {
      client.core.utils.log(client, {
        embeds: [{
          title: "First Startup",
          description: "Welcome!",
          color: client.core.colors.orange
        }]
      });
      client.db.set("bot-restart", {
        initiated: false,
        channel: client.logchannel,
        time: Date.now()
      });
    } else if (restart.initiated) {
      client.db.set("bot-restart.initiated", false);
      client.channels.cache.get(restart.channel).send({
        embeds: [{
          title: "Online",
          description: `took \`${((Date.now() - restart.time) / 1000).toFixed(2)}\`s`,
          color: client.core.colors.orange,
        }]
      });
    } else {
      client.core.utils.log(client, {
        embeds: [{
          title: "Bot Online after Crash",
          description: `<t:${Math.floor(Date.now() / 1000)}:R>`,
          color: client.core.colors.red
        }]
      });
    }
  }).catch(() => { });
};
