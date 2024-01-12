const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");

const symbol = ["♣️", "♥️", "♦️", "♠️"];
const num2txt = { 1: "A", 11: "J", 12: "Q", 13: "K" };
const symbolName = ["clubs", "hearts", "diamonds", "spades"];

module.exports = {
  chatInput: (interaction) => {
    const { client } = interaction;
    const { core } = client;
    return new Promise((resolve, reject) => {
      let betAmount = interaction.options.getInteger("bet");
      core.addons.econDB.getUserWallet(interaction.user.id).then((wallet) => {
        if (wallet < betAmount) {
          betAmount = wallet;
        }
        if (betAmount < 1000) {
          return core.utils.reply(interaction, {
            content: "최소 베팅액은 **1,000**원입니다.",
            ephemeral: true
          });
        }
        core.addons.econDB.subtractUserWallet(interaction.user.id, betAmount).then(() => {
          const bot = [core.utils.math.randomRange(0, 3), core.utils.math.randomRange(1, 13)];
          core.utils.reply(interaction, {
            embeds: [
              {
                title: "인디언 포커",
                description: `도전(Go)할지 포기(Die)할지 고르세요.\n상대 카드 (\`${symbol[bot[0]]}${num2txt[bot[1]] ?? bot[1]}\`)`,
                fields: [
                  {
                    name: "베팅금",
                    value: `> ${betAmount.toLocaleString()} 원`
                  }
                ],
                image: {
                  url: `https://raw.githubusercontent.com/zero624dev/ZeroBotPlayingCard/main/playingCards/${symbolName[bot[0]]}${bot[1]}.png`
                },
                thumbnail: {
                  url: "https://raw.githubusercontent.com/zero624dev/ZeroBotPlayingCard/main/playingCards/backside.png"
                },
                footer: { text: "A < 2-10 < J < Q < K" },
                color: core.colors.accent
              }
            ],
            components: [
              new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                  .setCustomId(`${interaction.user.id}-indian_poker-${betAmount}-go-${bot.join("-")}`)
                  .setLabel("⚔️ Go")
                  .setStyle(ButtonStyle.Primary),
                new ButtonBuilder()
                  .setCustomId(`${interaction.user.id}-indian_poker-${betAmount}-die-${bot.join("-")}`)
                  .setLabel("🛡️ Die")
                  .setStyle(ButtonStyle.Danger)
              )
            ]
          });
        }).catch(reject);
      }).catch(reject);
    });
  },
  button: (interaction, args) => {
    return new Promise((resolve, reject) => {
      const { core } = interaction.client;

      const betAmount = parseInt(args[0], 10);
      const reward = Math.round(betAmount * 1.8);

      const bot = [Number(args[2]), Number(args[3])], user = [core.utils.math.randomRange(0, 3), 0];
      if (bot[0] == user[0]) {
        user[1] = [core.utils.math.randomRange(1, bot[1] - 1), core.utils.math.randomRange(bot[1] + 1, 13)][bot[1] == 1 ? 1 : bot[1] == 13 ? 0 : core.utils.math.randomRange(0, 1)];
      } else {
        user[1] = core.utils.math.randomRange(1, 13);
      }

      const embed = {
        title: "인디언 포커",
        fields: [
          {
            name: "베팅금",
            value: `> ${betAmount.toLocaleString()} 원`
          }
        ],
        image: {
          url: `https://raw.githubusercontent.com/zero624dev/ZeroBotPlayingCard/main/playingCards/${symbolName[bot[0]]}${bot[1]}.png`
        },
        thumbnail: {
          url: `https://raw.githubusercontent.com/zero624dev/ZeroBotPlayingCard/main/playingCards/${symbolName[user[0]]}${user[1]}.png`
        },
        footer: { text: "A < 2-10 < J < Q < K" },
        color: core.colors.accent,
      };

      if (args[1] === "die") {
        core.addons.econDB.addUserWallet(interaction.user.id, Math.round(betAmount / 2)).then(() => {
          core.utils.reply(interaction, {
            embeds: [
              {
                ...embed,
                description: `포기했습니다.\n상대는 \`${symbol[bot[0]]}${num2txt[bot[1]] || bot[1]}\`, 당신은 \`${symbol[user[0]]}${num2txt[user[1]] || user[1]}\`로 ${bot[1] > user[1] ? "`패배`" : bot[1] == user[1] ? "`무승부`" : "`승리`"}였습니다.\n**${Math.round(betAmount / 2).toLocaleString()} 원**을 돌려받았습니다.`,
                color: core.colors.orange
              }
            ], components: []
          });
        }).catch(reject);
      } else if (args[1] === "go") {
        if (bot[1] < user[1]) {
          core.addons.econDB.addUserWallet(interaction.user.id, reward).then(() => {
            core.utils.reply(interaction, {
              embeds: [
                {
                  ...embed,
                  description: `승리했습니다.\n보상으로 **${reward.toLocaleString()} 원**를 지급받았습니다.`
                }
              ], components: []
            });
          }).catch(reject);
        } else if (bot[1] == user[1]) {
          core.addons.econDB.addUserWallet(interaction.user.id, betAmount).then(() => {
            core.utils.reply(interaction, {
              embeds: [
                {
                  ...embed,
                  description: `비겼습니다.\n **${betAmount.toLocaleString()} 원**을 돌려받았습니다.`,
                  color: core.colors.orange
                }
              ], components: []
            });
          }).catch(reject);
        } else {
          core.utils.reply(interaction, {
            embeds: [
              {
                ...embed,
                description: `상대는 \`${symbol[bot[0]]}${num2txt[bot[1]] || bot[1]}\`, 당신은 \`${symbol[user[0]]}${num2txt[user[1]] || user[1]}\`입니다.\n**${betAmount.toLocaleString()} 원**을 잃으셨습니다.`,
                color: core.colors.red
              }
            ], components: []
          });
        }
      }
    });
  }
};

