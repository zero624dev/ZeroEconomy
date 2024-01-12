module.exports = {
  chatInput: (interaction) => {
    return new Promise((resolve, reject) => {
      const { core } = interaction.client;

      core.utils.reply(interaction, {
        embeds: [{
          title: "시로네 전용 테스트 커맨드",
          color: core.colors.accent
        }]
      });
    });
  }
};
