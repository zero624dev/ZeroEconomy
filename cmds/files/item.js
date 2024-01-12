module.exports = {
  chatInput: (interaction) => {
    const { client } = interaction;
    const { core } = client;
    return new Promise((resolve, reject) => {
      const subcommand = interaction.options.getSubcommand();
      const member = interaction.options.getUser("member");
      const item = interaction.options.getString("item");
      const amount = interaction.options.getInteger("amount");

      if (member.bot) {
        return core.utils.reply(interaction, { content: "봇은 아이템을 가질 수 없어요.", ephemeral: true });
      }

      if (item && !core.addons.data.items[item]) {
        return core.utils.reply(interaction, { content: "존재하지 않는 아이템이에요.", ephemeral: true });
      }

      if (subcommand == "clear") {
        core.addons.econDB.setUser(member.id, { inventory: [] }, true).then(() => {
          core.utils.reply(interaction, { content: `${member.username}님의 인벤토리를 초기화했어요.`, ephemeral: true });
        }).catch(reject);
      } else if (subcommand == "set") {
        if (amount == 0) {
          core.addons.econDB.setUser(member.id, {
            $pull: {
              inventory: {
                id: item
              }
            }
          }, true).then(() => {
            core.utils.reply(interaction, { content: `**${member.username}**님의 **${item}**을 **${amount}**개로 설정했어요.`, ephemeral: true });
          }).catch(reject);
        } else {
          core.addons.econDB.setUser({
            "_id": member.id,
            "inventory.id": item
          }, {
            $set: {
              "inventory.$.count": amount
            }
          }, true).then(() => {
            core.utils.reply(interaction, { content: `**${member.username}**님의 **${item}**을 **${amount}**개로 설정했어요.`, ephemeral: true });
          }).catch(reject);
        }
      } else if (subcommand == "give") {
        core.addons.econDB.addUserInventory(member.id, item, amount, true).then(() => {
          core.utils.reply(interaction, { content: `**${member.username}**님에게 **${item}**을 **${amount}**개 지급했어요.`, ephemeral: true });
        }).catch(reject);
      } else if (subcommand == "collect") {
        core.addons.econDB.subtractUserInventory(member.id, item, amount).then((subtracted) => {
          if (!subtracted) {
            return core.utils.reply(interaction, { content: `**${member.username}**님은 **${item}**을 가지고 있지 않아요.`, ephemeral: true });
          }
          core.utils.reply(interaction, { content: `**${member.username}**님에게 **${item}**을 **${subtracted}**개 회수했어요.`, ephemeral: true });
        }).catch(reject);
      }
    });
  },
  autocomplete: (interaction) => {
    return new Promise((resolve, reject) => {
      const { core } = interaction.client;
      const search = interaction.options.getString("item").trim();
      const items = Object.keys(core.addons.data.items).filter((item) => {
        return item.startsWith(search);
      }).sort().slice(0, 25);
      resolve(items.map((item) => {
        return {
          name: item,
          value: item
        };
      }));
    });
  }
};
