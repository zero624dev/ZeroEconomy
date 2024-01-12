module.exports = {
  chatInput: (interaction) => {
    const { client } = interaction;
    const { core } = client;
    return new Promise((resolve, reject) => {
      const code = interaction.options.getString("code");
      interaction.deferReply().then(async () => {
        try {
          let evaled = await eval(code);
          if (typeof evaled !== "string") {
            evaled = require("util").inspect(evaled);
          } else {
            evaled = `"${evaled}"`;
          }
          core.utils.reply(interaction, {
            ephemeral: true,
            embeds: [{
              title: "Eval Success",
              fields: [{
                name: "Input",
                value: `\`\`\`js\n${code}\`\`\``,
                inline: false
              },
              {
                name: "Output",
                value: `\`\`\`js\n${evaled.slice(0, 1000)}\`\`\``,
                inline: false
              }],
              color: core.colors.orange
            }]
          });
        } catch (e) {
          reject(e);
        }
      }).catch((e) => {
        reject(e);
      });
    });
  }
};
