const { ActionRowBuilder, StringSelectMenuBuilder, TextInputBuilder, TextInputStyle } = require("discord.js");

module.exports = {
  chatInput: (interaction) => {
    return new Promise((resolve, reject) => {
      const { client } = interaction;
      const { core } = client;

      const subcommand = interaction.options.getSubcommand();

      if (subcommand === "items") {
        core.utils.reply(interaction, {
          embeds: [
            {
              title: "상점",
              description: "상점 카테고리를 선택해주세요.",
              color: core.colors.blue
            }
          ],
          components: [
            new ActionRowBuilder()
              .addComponents(
                new StringSelectMenuBuilder()
                  .setCustomId(`${interaction.user.id}-shop-category`)
                  .addOptions([
                    {
                      label: "농작물",
                      value: "crops",
                      description: "농작물을 판매할 수 있습니다.",
                      emoji: { name: "🌾" }
                    },
                    {
                      label: "씨앗",
                      value: "seeds",
                      description: "씨앗을 구매할 수 있습니다.",
                      emoji: { name: "🌱" }
                    }
                  ])
                  .setPlaceholder("카테고리를 선택해주세요.")
              )
          ]
        });
      } else if (subcommand === "buy") {
        const itemId = interaction.options.getString("item");
        const item = core.addons.data.items[itemId];

        if (!item) {
          return core.utils.reply(interaction, { content: "존재하지 않는 아이템이에요.", ephemeral: true });
        }

        const buy = item.shop?.buy;

        if (!buy) {
          return core.utils.reply(interaction, { content: "해당 아이템은 구매할 수 없어요.", ephemeral: true });
        }

        const amount = interaction.options.getInteger("amount");
        const price = amount * buy;

        core.addons.econDB.getUserWallet(interaction.user.id).then((wallet) => {
          if (wallet < price) {
            return core.utils.reply(interaction, { content: `${(price - wallet).toLocaleString()} 원이 부족해요.`, ephemeral: true });
          }

          core.addons.econDB.addUserInventory(interaction.user.id, itemId, amount).then(() => {
            core.addons.econDB.subtractUserWallet(interaction.user.id, price).then(() => {
              core.utils.reply(interaction, { content: `${item.name} ${amount}개를 ${price.toLocaleString()} 원에 구매했어요.`, ephemeral: true });
            }).catch(reject);
          }).catch(reject);
        }).catch(reject);
      } else if (subcommand === "sell") {
        const itemId = interaction.options.getString("item");
        const item = core.addons.data.items[itemId];

        if (!item) {
          return core.utils.reply(interaction, { content: "존재하지 않는 아이템이에요.", ephemeral: true });
        }

        const sell = item.shop?.sell;

        if (!sell) {
          return core.utils.reply(interaction, { content: "해당 아이템은 판매할 수 없어요.", ephemeral: true });
        }

        const amount = interaction.options.getInteger("amount");

        core.addons.econDB.subtractUserInventory(interaction.user.id, itemId, amount).then((subtractAmount) => {
          if (!subtractAmount) {
            return core.utils.reply(interaction, { content: "해당 아이템을 가지고 있지 않아요.", ephemeral: true });
          }

          const price = subtractAmount * sell;

          core.addons.econDB.addUserWallet(interaction.user.id, price).then(() => {
            core.utils.reply(interaction, { content: `${item.name} ${subtractAmount}개를 ${price.toLocaleString()} 원에 판매했어요.`, ephemeral: true });
          }).catch(reject);
        }).catch(reject);
      }
    });
  },
  autocomplete: (interaction) => {
    return new Promise((resolve, reject) => {
      const { core } = interaction.client;
      const subcommand = interaction.options.getSubcommand();

      if (subcommand === "buy") {
        const search = (interaction.options.getString("item") ?? "").trim();
        const isEng = (/[a-zA-Z]/).test(search);
        const items = Object.entries(core.addons.data.items).map(([id, item]) => {
          return {
            id: id, data: item, similarity: [
              core.utils.string.similarity(id, search),
              core.utils.string.similarity(item.name, search)
            ]
          };
        }).filter(({ data, similarity }) => {
          return data.shop?.buy && (!search || similarity[0] > 0 || similarity[1] > 0);
        });

        resolve(
          (!search ? items.sort((a, b) => {
            return a.data.name.localeCompare(b.data.name);
          }) : items.sort((a, b) => {
            return Math.min(
              b.similarity[0] - a.similarity[0],
              b.similarity[1] - a.similarity[1]
            );
          })).slice(0, 25).map(({ id, data }) => {
            return {
              name: isEng ?
                `${id} (${data.shop.buy.toLocaleString()} won each)` :
                `${data.name} (개당 ${data.shop.buy.toLocaleString()} 원)`,
              value: id
            };
          })
        );
      } else if (subcommand === "sell") {
        const search = (interaction.options.getString("item") ?? "").trim();
        const isEng = (/[a-zA-Z]/).test(search);
        core.addons.econDB.getUserInventory(interaction.user.id).then((inventory) => {
          const items = inventory.map((item) => {
            return {
              ...item, data: core.addons.data.items[item.id], similarity: [
                core.utils.string.similarity(item.id, search),
                core.utils.string.similarity(core.addons.data.items[item.id].name, search)
              ]
            };
          }).filter(({ data, similarity }) => {
            return data.shop?.sell && (!search || similarity[0] > 0 || similarity[1] > 0);
          });

          resolve(
            (!search ? items.sort((a, b) => {
              return a.data.name.localeCompare(b.data.name);
            }) : items.sort((a, b) => {
              return Math.min(
                b.similarity[0] - a.similarity[0],
                b.similarity[1] - a.similarity[1]
              );
            })).slice(0, 25).map((item) => {
              return {
                name: isEng ?
                  `${item.id} x${item.count} (${item.data.shop.sell.toLocaleString()} won each)` :
                  `${item.data.name} x${item.count} (개당 ${item.data.shop.sell.toLocaleString()} 원)`,
                value: item.id
              };
            })
          );
        }).catch(reject);
      }
    });
  },
  selectMenu: (interaction, args) => {
    return new Promise((resolve, reject) => {
      const { core } = interaction.client;

      if (args[0] === "category") {
        const category = interaction.values[0];
        // Object.keys(core.addons.data.items).
        const items = Object.entries(core.addons.data.items).filter(([, item]) => {
          return item.category.includes(category) && item.shop;
        });
        interaction.update({
          components: [
            new ActionRowBuilder()
              .addComponents(
                new StringSelectMenuBuilder()
                  .setCustomId(`${interaction.user.id}-shop-category`)
                  .addOptions([
                    {
                      label: "농작물",
                      value: "crops",
                      description: "농작물을 판매할 수 있습니다.",
                      emoji: { name: "🌾" }
                    },
                    {
                      label: "씨앗",
                      value: "seeds",
                      description: "씨앗을 구매할 수 있습니다.",
                      emoji: { name: "🌱" }
                    }
                  ].map((option) => {
                    return { ...option, default: option.value === category };
                  }))
                  .setPlaceholder("카테고리를 선택해주세요.")
              ),
            new ActionRowBuilder()
              .addComponents(
                new StringSelectMenuBuilder()
                  .setCustomId(`${interaction.user.id}-shop-item`)
                  .addOptions(items.map(([id, item]) => {
                    const { sell, buy } = item.shop;
                    return {
                      label: item.name,
                      value: id,
                      description: `판매가: ${sell?.toLocaleString() ?? "X"} 원 / 구매가: ${buy?.toLocaleString() ?? "X"} 원`,
                    };
                  }))
                  .setPlaceholder("아이템을 선택해주세요.")
              ),
          ]
        });
      } else if (args[0] === "item") {
        const item = interaction.values[0];
        const itemInfo = core.addons.data.items[item];

        const components = [];

        if (itemInfo.shop?.sell) {
          components.push(
            new ActionRowBuilder()
              .addComponents(
                new TextInputBuilder()
                  .setCustomId("sell")
                  .setLabel("판매 개수")
                  .setPlaceholder(`개당 ${itemInfo.shop.sell.toLocaleString()} 원`)
                  .setStyle(TextInputStyle.Short)
                  .setMinLength(1)
                  .setMaxLength(16)
                  .setRequired(false)
              )
          );
        }

        if (itemInfo.shop?.buy) {
          components.push(
            new ActionRowBuilder()
              .addComponents(
                new TextInputBuilder()
                  .setCustomId("buy")
                  .setLabel("구매 개수")
                  .setPlaceholder(`개당 ${itemInfo.shop.buy.toLocaleString()} 원`)
                  .setStyle(TextInputStyle.Short)
                  .setMinLength(1)
                  .setMaxLength(16)
                  .setRequired(false)
              )
          );
        }

        interaction.showModal({
          title: `${itemInfo.name}`, components: components, customId: `${interaction.user.id}-shop-trade-${item}`,
        }).catch(reject);
      }
    });
  },
  modalSubmit: (interaction, args) => {
    return new Promise((resolve, reject) => {
      const { core } = interaction.client;

      if (args[0] === "trade") {
        const item = args[1];
        const itemInfo = core.addons.data.items[item];

        const sell = interaction.fields.fields.has("sell") ? parseInt(interaction.fields.getTextInputValue("sell"), 10) || 0 : 0;
        const buy = interaction.fields.fields.has("buy") ? parseInt(interaction.fields.getTextInputValue("buy"), 10) || 0 : 0;

        let text = "";

        core.addons.econDB.getUserWallet(interaction.user.id).then(async (wallet) => {
          if (sell != 0) {
            if (sell < 0) {
              text += "판매 개수는 0보다 작을 수 없어요.\n";
            } else {
              const itemCount = await core.addons.econDB.getUserInventory(interaction.user.id, item).catch(reject);

              if (!itemCount) {
                text += "해당 아이템을 가지고 있지 않아요.\n";
              } else {
                const resultCount = Math.max(itemCount - sell, 0);

                const filter = resultCount ? { "_id": interaction.user.id, "inventory.id": item } : { _id: interaction.user.id };
                const data = resultCount ? { $set: { "inventory.$.count": resultCount } } : { $pull: { inventory: { id: item } } };
                await core.addons.econDB.setUser(filter, data).catch(reject);

                const count = Math.min(itemCount, sell);
                const price = count * itemInfo.shop.sell;

                await core.addons.econDB.addUserWallet(interaction.user.id, price).catch(reject);

                text += `${item} ${count}개를 ${price.toLocaleString()} 원에 판매했어요. (소지금: ${(wallet += price).toLocaleString()} 원)\n`;
              }
            }
          }

          const price = buy * itemInfo.shop.buy;
          if (buy != 0) {
            if (buy < 0) {
              text += "구매 개수는 0보다 작을 수 없어요.\n";
            } else if (wallet < price) {
              text += `${(price - wallet).toLocaleString()} 원이 부족해요. (소지금: ${wallet.toLocaleString()} 원)\n`;
            } else {
              await core.addons.econDB.addUserInventory(interaction.user.id, item, buy).catch(reject);
              await core.addons.econDB.subtractUserWallet(interaction.user.id, price).catch(reject);

              text += `${item} ${buy.toLocaleString()}개를 ${price.toLocaleString()} 원에 구매했어요. (소지금: ${(wallet - price).toLocaleString()} 원)\n`;
            }
          }

          interaction.reply({ content: text || "아무 일도 일어나지 않았어요.", ephemeral: true });
        }).catch(reject);
      }
    });
  }
};
