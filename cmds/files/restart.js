module.exports = {
  chatInput: (interaction) => {
    const { client } = interaction;
    const { core } = client;
    return new Promise((resolve, reject) => {
      try {
        client.db.set("bot-restart", {
          initiated: true,
          channel: interaction.channel.id,
          time: Date.now()
        }).then(() => {
          core.utils.reply(interaction, {
            embeds: [{
              title: "Restarting...",
              color: core.colors.yellow
            }]
          }).then(() => {
            process.exit(0);
          });
        });
      } catch (e) {
        reject(e);
      }
    });
  }
};
