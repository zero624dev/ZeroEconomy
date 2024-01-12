const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");

const returns = {
  win: 1.9,
  neutral: 1,
  lose: 0,
};

function generateCard(interaction, excludes = []) {
  const { core } = interaction.client;

  const cardNum = core.utils.math.randomArray(["A", 2, 3, 4, 5, 6, 7, 8, 9, 10, "J", "Q", "K"]);
  const cardSymbol = core.utils.math.randomArray(["♠", "♥", "♣", "♦"]);

  for (const card of excludes) {
    if (card.num == cardNum && card.symbol == cardSymbol) {
      return generateCard(interaction, excludes);
    }
  }

  return {
    num: cardNum,
    symbol: cardSymbol,
  };
}

function getValue(arr) {
  let value = 0, numAces = 0;

  for (let card of arr) {
    if (card.num == "A") {
      value += 11;
      numAces += 1;
    } else if (["K", "Q", "J"].includes(card.num)) {
      value += 10;
    } else {
      value += card.num;
    }
  }

  while (value > 21 && numAces > 0) {
    value -= 10;
    numAces -= 1;
  }

  return value;
}

function game(interaction, bjData, action) {
  return new Promise((resolve, reject) => {
    const { core } = interaction.client;

    const outcomes = {
      win: {
        text: "승리",
        moneyText: "수익",
        color: core.colors.blue
      },
      lose: {
        text: "패배",
        moneyText: "손실",
        color: core.colors.red
      },
      neutral: {
        text: "무승부",
        moneyText: "반환",
        color: core.colors.gray
      },
    };

    if (action == "hit") {
      bjData.playerCards.push(generateCard(interaction, bjData.playerCards.concat(bjData.botCards)));
      bjData.turn += 1;
    } else if (action == "stand") {
      while (getValue(bjData.botCards) < 17) {
        bjData.botCards.push(generateCard(interaction, bjData.playerCards.concat(bjData.botCards)));
        bjData.turn += 1;
      }
    }

    const playerValue = getValue(bjData.playerCards);
    const botValue = getValue(bjData.botCards);
    let gameEnd = true;
    let gameResult = "neutral";

    if (action) {
      if (action == "hit") {
        if (playerValue > 21) {
          gameResult = "lose";
        } else if (playerValue == 21) {
          gameResult = "win";
        } else {
          gameEnd = false;
        }
      } else if (action == "stand") {
        if (botValue > 21 || playerValue > botValue) {
          gameResult = "win";
        } else if (playerValue < botValue) {
          gameResult = "lose";
        } else if (playerValue == botValue) {
          gameResult = "neutral";
        } else {
          gameEnd = false;
        }
      }
    } else {
      gameEnd = false;
    }

    const bjDataString = `${bjData.bet}-${bjData.playerCards.map((card) => {
      return `${card.num}${card.symbol}`;
    }).join(",")}-${bjData.botCards.map((card) => {
      return `${card.num}${card.symbol}`;
    }).join(",")}-${bjData.turn}`;

    const actionButtons = [new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId(`${interaction.user.id}-blackjack-hit-${bjDataString}`)
        .setLabel("⚔️ Hit")
        .setStyle(ButtonStyle.Primary),
      new ButtonBuilder()
        .setCustomId(`${interaction.user.id}-blackjack-stand-${bjDataString}`)
        .setLabel("🛡️ Stand")
        .setStyle(ButtonStyle.Danger)
    )];

    const econFunction = gameEnd ? core.addons.econDB.addUserWallet : () => {
      return new Promise((resolve) => {
        resolve();
      });
    };

    econFunction(interaction.user.id, Math.floor(bjData.bet * returns[gameResult])).then(() => {
      core.utils.reply(interaction, {
        embeds: [
          {
            title: `${interaction.user.tag}님의 블랙잭`,
            description: gameEnd ? `**${outcomes[gameResult].text}**` : null,
            fields: [
              {
                name: `플레이어 [${playerValue}]`,
                value: bjData.playerCards.map((card) => {
                  return `\`${card.num}${card.symbol}\``;
                }).join(" "),
                inline: true,
              },
              {
                name: `컴퓨터 [${gameEnd ? botValue : "?"}]`,
                value: `${gameEnd ? bjData.botCards.map((card) => {
                  return `\`${card.num}${card.symbol}\``;
                }).join(" ") : `\`${bjData.botCards[0].num}${bjData.botCards[0].symbol}\` \`?\``}`,
                inline: true,
              },
              {
                name: gameEnd ? outcomes[gameResult].moneyText : "베팅액",
                value: gameEnd ? `${Math.floor(bjData.bet * (returns[gameResult] || 1)).toLocaleString()}` : `${bjData.bet.toLocaleString()}`,
                inline: false
              }
            ],
            footer: {
              text: `A = 1 or 11, J Q K = 10 | Turn ${bjData.turn}`,
            },
            color: outcomes[gameResult].color,
          },
        ],
        components: gameEnd ? [] : actionButtons,
      });
    }).catch(reject);
  });
}

module.exports = {
  chatInput: (interaction) => {
    return new Promise((resolve, reject) => {
      const { core } = interaction.client;

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
          const bjData = {
            bet: betAmount,
            playerCards: [],
            botCards: [],
            turn: 1,
          };
          for (let i = 0; i < 2; i++) {
            bjData.playerCards.push(generateCard(interaction, bjData.playerCards.concat(bjData.botCards)));
            bjData.botCards.push(generateCard(interaction, bjData.playerCards.concat(bjData.botCards)));
          }
          game(interaction, bjData).catch(reject);
        }).catch(reject);
      }).catch(reject);
    });
  },
  button: (interaction, args) => {
    return new Promise((resolve, reject) => {
      let [action, bet, playerCards, botCards, turn] = args;
      game(interaction,
        {
          bet: parseInt(bet, 10),
          playerCards: playerCards.split(",").map((card) => {
            return { num: parseInt(card.slice(0, -1), 10) || card.slice(0, -1), symbol: card.slice(-1) };
          }),
          botCards: botCards.split(",").map((card) => {
            return { num: parseInt(card.slice(0, -1), 10) || card.slice(0, -1), symbol: card.slice(-1) };
          }),
          turn: parseInt(turn, 10),
        },
        action
      ).catch(reject);
    });
  },
};
