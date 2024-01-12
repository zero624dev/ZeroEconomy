const returns = {
  1: 1.9, // CORRECT
  0: 0 // WRONG
};
// return percentage: 95%

module.exports = {
  chatInput: (interaction) => {
    return new Promise((resolve, reject) => {
      const { core } = interaction.client;

      let betAmount = interaction.options.getInteger("bet");
      const guess = interaction.options.getInteger("guess");

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
        const evenodd = core.utils.math.randomRange(0, 1);
        let matching = guess == evenodd ? 1 : 0;

        const reward = Math.floor(betAmount * returns[matching]);
        const balance = wallet - betAmount + reward;
        core.addons.econDB.setUser(interaction.user.id, { wallet: balance }).then(() => {
          core.utils.reply(interaction, {
            embeds: [{
              title: `${interaction.user.tag}님의 홀짝`,
              description: `${matching ? "맞췄습니다!" : "틀렸습니다."}`,
              fields: [
                {
                  name: "잔고",
                  value: `${balance.toLocaleString()}(${matching ? "+" : "-"}${Math.abs(balance - wallet).toLocaleString()})`,
                  inline: true
                }
              ],
              color: matching ? core.colors.blue : core.colors.red
            }]
          });
        }).catch(reject);
      }).catch(reject);
    });
  }
};
