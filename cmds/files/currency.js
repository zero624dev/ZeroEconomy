module.exports = {
  chatInput: (interaction) => {
    const { client } = interaction;
    const { core } = client;
    return new Promise((resolve, reject) => {
      const subcommand = interaction.options.getSubcommand();
      const member = interaction.options.getUser("member");
      const value = interaction.options.getInteger("value");

      if (member.bot) {
        return core.utils.reply(interaction, { content: "봇은 화폐를 가질 수 없어요.", ephemeral: true });
      }

      if (subcommand == "set") {
        core.addons.econDB.setUser(member.id, { wallet: value }, true).then(() => {
          core.utils.reply(interaction, { content: `${member.tag}님의 화폐 값을 ${value.toLocaleString()}원으로 설정했어요!`, ephemeral: true });
        }).catch(reject);
      } else if (subcommand == "give") {
        core.addons.econDB.addUserWallet(member.id, value, true).then(() => {
          core.utils.reply(interaction, { content: `${member.tag}님에게 ${value.toLocaleString()}원을 지급했어요!`, ephemeral: true });
        }).catch(reject);
      } else if (subcommand == "collect") {
        core.addons.econDB.subtractUserWallet(member.id, value, true).then(() => {
          core.utils.reply(interaction, { content: `${member.tag}님의 화폐를 ${value.toLocaleString()}원 회수했어요!`, ephemeral: true });
        }).catch(reject);
      }
    });
  }
};

