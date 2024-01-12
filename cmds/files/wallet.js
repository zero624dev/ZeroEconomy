module.exports = {
  chatInput: (interaction) => {
    return new Promise((resolve, reject) => {
      const { core } = interaction.client;

      const member = interaction.options.getUser("member") ?? interaction.user;
      if (member.bot) {
        core.utils.reply(interaction, { content: "봇은 지갑을 가질 수 없어요.", ephemeral: true });
      } else {
        core.addons.econDB.getUserWallet(member.id).then((wallet) => {
          core.utils.reply(interaction, {
            embeds: [
              {
                title: `${member.tag}님의 지갑`,
                fields: [
                  { name: "현금", value: `${(wallet ?? 0).toLocaleString()} 원`, inline: false },
                ],
                color: core.colors.accent
              }
            ]
          });
        }).catch(reject);
      }
    });
  }
};
