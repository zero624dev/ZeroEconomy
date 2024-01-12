const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  guilds: ["1127549263598059530"],
  whitelist: ["285229678443102218"],
  perms: [],
  data: new SlashCommandBuilder()
    .setName("reload")
    .setDescription("reload everything"),
  chatInput: (interaction) => {
    const { core } = interaction.client;
    return new Promise((resolve, reject) => {
      core.utils.reload(interaction.client).then((reloaded) => {
        core.utils.reply(interaction, {
          ephemeral: true,
          embeds: [{
            title: `Reloaded ${reloaded.info.name}`,
            fields: [
              {
                name: `commands [${Object.keys(reloaded.cmds).length}]`,
                value: `\`\`\`\n${Object.keys(reloaded.cmds).join("\n")}\`\`\``,
                inline: true
              },
              {
                name: `colors [${Object.keys(reloaded.colors).length}]`,
                value: `\`\`\`\n${Object.keys(reloaded.colors).join("\n")}\`\`\``,
                inline: true
              },
              {
                name: `events [${Object.keys(reloaded.events).length}]`,
                value: `\`\`\`\n${Object.keys(reloaded.events).join("\n")}\`\`\``,
                inline: true
              },
              {
                name: `handlers [${Object.keys(reloaded.handlers).length}]`,
                value: `\`\`\`\n${Object.keys(reloaded.handlers).join("\n")}\`\`\``,
                inline: true
              },
              {
                name: `utils [${Object.keys(reloaded.utils).length}]`,
                value: `\`\`\`\n${Object.keys(reloaded.utils).join("\n")}\`\`\``,
                inline: true
              },
              {
                name: `addons [${Object.keys(reloaded.addons).length}]`,
                value: `\`\`\`\n${Object.keys(reloaded.addons).join("\n")}\`\`\``,
                inline: true
              }
            ],
            color: core.colors.orange
          }]
        });
      }).catch(reject);
    });
  }
};
