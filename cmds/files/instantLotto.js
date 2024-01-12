const number = [
  "1️⃣",
  "2️⃣",
  "3️⃣",
  "4️⃣",
  "5️⃣",
  "6️⃣",
  "7️⃣",
  "8️⃣",
  "9️⃣"
];

const rewards = {
  1: 100000000, // 1 / 10,000 (1 장, 100000000 원)
  2: 20000000, // 1 / 2,000 (5 장, 20000000 원)
  3: 500000, // 1 / 200 (50 장, 500000 원)
  4: 100000, // 1 / 20 (500 장, 100000 원)
  5: 2000 // 1 / 2 (5,000 장, 2000 원)
};

module.exports = {
  chatInput: (interaction) => {
    const { core } = interaction.client;
    return new Promise((resolve, reject) => {
      core.addons.econDB.getUserWallet(interaction.user.id).then((wallet) => {
        if (wallet < 2000) {
          core.utils.reply(interaction, {
            embeds: [{
              title: "잔고 부족!",
              description: `현재 잔고는 ${wallet} 원입니다. 돈을 모은 이후에 다시 시도해 주십시오.`,
              color: core.colors.red
            }]
          });
        }
        core.addons.econDB.subtractUserWallet(interaction.user.id, 2000, true).then(() => {
          const random = core.utils.math.randomRange(1, 10000);
          const moneyRates = [];
          for (let i = 0; i < 6; i++) {
            const moneyRate = rewards[core.utils.math.randomRange(0, 4)];
            if (moneyRates.indexOf(moneyRate) === -1) {
              moneyRates.push(moneyRate);
            } else {
              i--;
            }
            if (i === 5) {
              const moneyRate6 = rewards[core.utils.math.randomRange(1, 4)];
              moneyRates.push(moneyRate6);
            }
          }
          const lottoNumbers = [];
          for (let i = 0; i < 6; i++) {
            const lottoNumber = core.utils.math.randomRange(0, number.length);
            if (lottoNumbers.indexOf(lottoNumber) === -1) {
              lottoNumbers.push(lottoNumber);
            } else {
              i--;
            }
          }
          let luckyNumber = null;
          let result = null;
          // 1 , 2 ~ 6, 7 ~ 56, 57 ~ 556, 557 ~ 5556
          if (random === 1) {
            luckyNumber = lottoNumbers[moneyRates.indexOf(rewards[0])];
            result = rewards[0];
          } else if (random >= 2 && random <= 6) {
            luckyNumber = lottoNumbers[moneyRates.indexOf(rewards[1])];
            result = rewards[1];
          } else if (random >= 7 && random <= 56) {
            luckyNumber = lottoNumbers[moneyRates.indexOf(rewards[2])];
            result = rewards[2];
          } else if (random >= 57 && random <= 556) {
            luckyNumber = lottoNumbers[moneyRates.indexOf(rewards[3])];
            result = rewards[3];
          } else if (random >= 557 && random <= 5556) {
            luckyNumber = lottoNumbers[moneyRates.indexOf(rewards[4])];
            result = rewards[4];
          } else {
            result = 0;
            for (let i = 0; i < number.length; i++) {
              luckyNumber = number[core.utils.math.randomRange(0, number.length)];
              if (lottoNumbers.indexOf(luckyNumber) != -1) {
                break;
              } else {
                continue;
              }
            }
          }
          const lottoFields = [];
          for (let i = 0; i < 6; i++) {
            lottoFields.push({
              name: `||${lottoNumbers[i]}||`,
              value: `||${moneyRates[i]}||`,
              inline: true
            });
          }
          const reward = wallet - 2000 + result;
          core.addons.econDB.setUser(interaction.user.id, { wallet: reward }).then(() => {
            core.utils.reply(interaction, {
              embeds: [{
                title: `행운의 숫자 : ${luckyNumber}`,
                fields: [lottoFields],
                footer: `||현재 잔고 : ||`
              }],
              color: core.colors.blue,
            });
          }).catch(reject);
        }).catch(reject);
      }).catch(reject);
    });
  }
};
