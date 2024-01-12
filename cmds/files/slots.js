const symbols = [
  "🍒",
  "🍋",
  "🍎",
  "🔔",
  "👑",
  "💎",
  "🏆",
  "7️⃣",
  "⭐",
  "🍇",
  "✨",
  "🍑",
  "🍍",
  "🍅",
  "🍉",
  "🍓",
  "🍈",
  "🍊",
  "🍌",
  "🍐",
];

const returns = {
  1: 100, // JACKPOT
  2: 5, // TWO
  3: 0 // NONE
};
// return percentage: 96.2%

module.exports = {
  chatInput: (interaction) => {
    return new Promise((resolve, reject) => {
      const { client } = interaction;
      const { core } = client;
      const colors = {
        1: core.colors.accent,
        2: core.colors.green,
        3: core.colors.red
      };

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
        const slots = [];
        for (let i = 0; i < 3; i++) {
          slots.push(core.utils.math.randomArray(symbols));
        }
        const matchingCount = new Set(slots).size;
        const reward = Math.floor(betAmount * returns[matchingCount]);
        const balance = wallet - betAmount + reward;
        core.addons.econDB.setUser(interaction.user.id, { wallet: balance }).then(() => {
          core.utils.reply(interaction, {
            embeds: [{
              title: `${interaction.user.tag}님의 슬롯머신`,
              description: `${matchingCount == 1 ? "**JACKPOT**\n" : ""}${slots.map((v) => {
                return `${v}`;
              }).join(" ")}${matchingCount == 1 ? "\n**JACKPOT**" : ""}`,
              fields: [
                {
                  name: "잔고",
                  value: `${balance.toLocaleString()}(${matchingCount == 3 ? "-" : "+"}${Math.abs(balance - wallet).toLocaleString()})`,
                  inline: true
                }
              ],
              color: colors[matchingCount]
            }]
          });
        }).catch(reject);
      }).catch(reject);
    });
  }
};
