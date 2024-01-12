const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");

async function setUsername(client, users) {
  for (let i = 0; i < users.length; i++) {
    users[i].username = await client.users.fetch(users[i].id).then((user) => {
      return user.tag;
    });
  }
}

function getWalletRank(client, page = 1) {
  return new Promise((resolve, reject) => {
    client.mongoose.model("User").countDocuments({}).then((count) => {
      client.mongoose.model("User").aggregate([
        {
          $sort: { wallet: -1 }
        },
        {
          $limit: page * 15
        },
        {
          $skip: (page - 1) * 15
        },
        {
          $project: {
            _id: 0, id: "$_id", wallet: 1
          }
        }
      ]).then(async(users) => {
        await setUsername(client, users);
        resolve({
          users: users,
          count: count
        });
      }).catch(reject);
    }).catch(reject);
  });
}

function getCompRank(client, date, page = 1) {
  return new Promise((resolve, reject) => {
    client.mongoose.model("Comp").aggregate([
      {
        $match: { _id: date }
      },
      {
        $project: {
          _id: 0, order: { $slice: ["$order", (page - 1) * 15, page * 15] }, size : { $size: "$order" }
        }
      },
    ]).then(async([data]) => {
      await setUsername(client, data.order);
      resolve({
        users: data.order,
        count: data.size
      });
    }).catch(reject);
  });
}

module.exports = {
  chatInput: (interaction) => {
    return new Promise((resolve, reject) => {
      const { client } = interaction;
      const { core } = client;
      const type = interaction.options.getString("type");

      let title = null, value = null, data = null;

      if (type == "comp") {
        const nowDate = new Date(Date.now() + 9 * 60 * 60 * 1000);
        const nowDateId = nowDate.toISOString().slice(0, 10);
        const start = new Date(nowDateId).getTime() - 32400000;
        title = "출석";
        value = (v) => {
          const dist = v.timestamps - start;
          const hour = Math.floor(dist / 3600000);
          const min = Math.floor(dist % 3600000 / 60000);
          const sec = hour ? 0 : min ? Math.floor(dist % 60000 / 1000) : (dist % 60000 / 1000).toFixed(2);
          return `**@${v.username}**\n> ${hour ? `${hour} 시간 ` : ""}${min ? `${min} 분 ` : ""}${sec ? `${sec} 초` : ""}`;
        };
        data = getCompRank(client, nowDateId);
      } else if (type == "wallet") {
        title = "지갑";
        value = (v) => {
          return `**@${v.username}**\n> ${v.wallet.toLocaleString()} 원`;
        };
        data = getWalletRank(client);
      }

      data.then(({ users, count }) => {
        core.utils.reply(interaction, {
          embeds: [
            {
              title: `${title} 순위 (1-${Math.min(15, count)}위)`,
              fields: users.map((v, i) => {
                return {
                  name: ["🥇", "🥈", "🥉"][i] ?? `${i + 1}위`,
                  value: value(v),
                  inline: true
                };
              }),
              color: core.colors.accent
            }
          ],
          components: [
            new ActionRowBuilder()
              .addComponents(
                new ButtonBuilder()
                  .setCustomId("disabled1")
                  .setLabel("◀")
                  .setStyle(ButtonStyle.Primary)
                  .setDisabled(true),
                new ButtonBuilder()
                  .setCustomId("disabled2")
                  .setLabel(`1 / ${Math.ceil(count / 15)}`)
                  .setStyle(ButtonStyle.Secondary)
                  .setDisabled(true),
                new ButtonBuilder()
                  .setCustomId(`${interaction.user.id}-rank-2`)
                  .setLabel("▶")
                  .setStyle(ButtonStyle.Primary)
                  .setDisabled(count <= 15),
              )
          ]
        });
      }).catch(reject);
    });
  },
  button: (interaction, args) => {
    return new Promise((resolve, reject) => {
      const page = parseInt(args[0], 10);
      const { client } = interaction;
      const { core } = client;
      interaction.deferUpdate().then(() => {
        getWalletRank(client, page).then(({ users, count }) => {
          const maxPage = Math.ceil(count / 15);
          // core.utils.reply(interaction, {
          interaction.message.edit({
            embeds: [{
              title: `화폐 순위 (${(page - 1) * 15 + 1}-${page == maxPage ? count : page * 15}위)`,
              fields: users.map((v, i) => {
                return {
                  name: ["🥇", "🥈", "🥉"][i + (page - 1) * 15] ?? `${i + 1 + (page - 1) * 15}위`,
                  value: `**@${v.username}**\n> ${v.wallet.toLocaleString()} 원`,
                  inline: true
                };
              }),
              color: core.colors.accent
            }],
            components: [
              new ActionRowBuilder()
                .addComponents(
                  new ButtonBuilder()
                    .setCustomId(`${interaction.user.id}-rank-${page - 1}`)
                    .setLabel("◀")
                    .setStyle(ButtonStyle.Primary)
                    .setDisabled(page == 1),
                  new ButtonBuilder()
                    .setCustomId("disabled2")
                    .setLabel(`${page} / ${maxPage}`)
                    .setStyle(ButtonStyle.Secondary)
                    .setDisabled(true),
                  new ButtonBuilder()
                    .setCustomId(`${interaction.user.id}-rank-${page + 1}`)
                    .setLabel("▶")
                    .setStyle(ButtonStyle.Primary)
                    .setDisabled(page == maxPage)
                )
            ]
          });
        }).catch(reject);
      }).catch(reject);
    });
  },
};
