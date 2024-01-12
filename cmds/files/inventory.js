module.exports = {
  chatInput: (interaction) => {
    const { client } = interaction;
    const { core } = client;
    return new Promise((resolve, reject) => {
      const member = interaction.options.getUser("member") ?? interaction.user;
      if (member.bot) {
        return core.utils.reply(interaction, { content: "봇은 인벤토리를 가질 수 없어요.", ephemeral: true });
      }

      core.addons.econDB.getUserInventory(member.id).then((inventory) => {
        core.utils.reply(interaction, {
          embeds: [
            {
              title: `${member.tag}님의 인벤토리`,
              description: inventory.length ? undefined : "인벤토리가 비어있습니다.",
              fields: inventory.map((item) => {
                return { name: core.addons.data.items[item.id].name, value: `${item.count} 개`, inline: false };
              }),
              color: core.colors.blue
            }
          ]
        });
      }).catch(reject);
    });
  }
};
