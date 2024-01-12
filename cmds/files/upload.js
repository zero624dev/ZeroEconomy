module.exports = {
  chatInput: (interaction) => {
    const { core } = interaction.client;
    return new Promise((resolve, reject) => {
      try {
        interaction.deferReply({
          ephemeral: true
        }).then(() => {
          core.utils.upload(interaction.client).then((returned) => {
            const { cmdList, status } = returned;
            core.utils.reply(interaction, {
              embeds: [{
                title: "Uploaded",
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
          }).catch(reject);
        }).catch(reject);
      } catch (e) {
        reject(e);
      }
    });
  }
};
