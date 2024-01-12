const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const { fetch } = require("undici");

module.exports = {
  chatInput: (interaction) => {
    const { client } = interaction;
    const { core } = client;
    return new Promise((resolve, reject) => {
      fetch(`https://koreanbots.dev/api/v2/bots/910024774904840232/vote?userID=${interaction.user.id}`, {
        headers: {
          "Authorization": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjkxMDAyNDc3NDkwNDg0MDIzMiIsImlhdCI6MTcwNDY5MzI1OH0.AOB21uPeQhR1f_3Qk7LOstZKDxm8E_vt8ac0R7QpYmV7zh7I14YOFvrwysA3rgAqLCQ-BgYbi6MIqrQv6KuIPv7G7ZEw5kExDaDY6p4ENTHdDCUk7TaB2ws0Io9ETbdup0CGtKCTEE0PpPIguYzi-VIwUPtcUue-dvJzhkffjXk",
          "Content-Type": "application/json"
        }
      }).then((res) => {
        return res.json();
      }).then(({ data }) => {
        if (!data.lastVote) {
          return resolve({
            embeds: [
              {
                title: "하트를 눌러주세요",
                description: "하트를 누른 후 다시 명령어를 실행해주세요.",
                url: "https://koreanbots.dev/bots/910024774904840232/vote",
                image: {
                  url: "https://cdn.discordapp.com/attachments/843156045865418752/848215715239690290/comp.gif"
                },
                color: core.colors.red
              }
            ],
            components: [
              new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                //   .setLabel("하트 누르기")
                  .setEmoji("💖")
                  .setStyle(ButtonStyle.Link)
                  .setURL("https://koreanbots.dev/bots/910024774904840232/vote")
              )
            ]
          });
        }

        core.addons.econDB.getUser(interaction.user.id, "lastVote").then((lastVote) => {
          if (data.voted) {
            if (data.lastVote != lastVote) {
              const reward = Math.randomRange(150_000, 100_000);
              core.addons.econDB.setUser(interaction.user.id, {
                lastVote: data.lastVote
              }).then(() => {
                resolve({
                  embeds: [
                    {
                      title: "출석 보상",
                      description: "> {0}원".format(reward.toLocaleString()),
                      color: core.colors.blue
                    }
                  ]
                });
              });
            } else {
              resolve({
                embeds: [
                  {
                    title: "12시간마다 한 번씩 받을 수 있습니다.",
                    description: `<t:${Math.round((43200000 + lastVote) / 1000)}:R> 가능합니다.`,
                    color: core.colors.red
                  }
                ]
              });
            }
          } else {
            resolve({
              embeds: [
                {
                  title: "하트를 다시 눌러주세요",
                  description: "하트를 누른 후 다시 명령어를 실행해주세요.",
                  url: "https://koreanbots.dev/bots/910024774904840232/vote",
                  image: {
                    url: "https://cdn.discordapp.com/attachments/843156045865418752/848215715239690290/comp.gif"
                  },
                  color: core.colors.red
                }
              ],
              components: [
                new ActionRowBuilder().addComponents(
                  new ButtonBuilder()
                    .setCustomId("vote")
                    //   .setLabel("하트 누르기")
                    .setEmoji("💖")
                    .setStyle(ButtonStyle.Link)
                    .setURL("https://koreanbots.dev/bots/910024774904840232/vote")
                )
              ]
            });
          }
        });
      }).catch(() => {
        resolve({
          embeds: [
            {
              title: "서버에 문제가 있습니다.",
              description: "나중에 다시 시도해주세요.",
              url: "https://koreanbots.dev/bots/910024774904840232",
              color: core.colors.red
            }
          ]
        });
      });
    });
  }
};
