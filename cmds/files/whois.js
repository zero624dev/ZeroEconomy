module.exports = {
  chatInput: (interaction) => {
    const { core } = interaction.client;
    return new Promise((resolve, reject) => {
      try {
        const member = interaction.options.getMember("member");
        const { user } = member;
        if (!member) {
          reject("Cannot Find Member");
        } else {
          core.utils.reply(interaction, {
            embeds: [{
              title: `${user.tag}${user.bot ? " [BOT]" : ""}`,
              description: `<@${member.id}>`,
              thumbnail: {
                url: member.displayAvatarURL({ size: 2048 })
              },
              fields: [
                {
                  name: "디스코드 가입일",
                  value: `<t:${Math.floor(user.createdTimestamp / 1000)}:D>`,
                  inline: false
                },
                {
                  name: "서버 가입일",
                  value: `<t:${Math.floor(member.joinedTimestamp / 1000)}:D>`,
                  inline: false
                },
                {
                  name: "ID",
                  value: member.id,
                  inline: false
                }
              ],
              color: member.displayColor || core.colors.orange
            }]
          });
        }
      } catch (e) {
        reject(e);
      }
    });
  }
};
