module.exports = {
  chatInput: (interaction) => {
    const { core } = interaction.client;
    return new Promise((resolve, reject) => {
      try {
        const member = interaction.options.getMember("user") || interaction.member;
        core.utils.reply(interaction, {
          embeds: [{
            title: member.displayName,
            image: {
              url: member.displayAvatarURL({ size: 2048 })
            },
            color: member.displayColor || core.colors.orange
          }]
        });
      } catch (e) {
        reject(e);
      }
    });
  }
};
