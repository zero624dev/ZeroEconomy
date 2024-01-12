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
module.exports = {
  chatInput: (interaction) => {
    const { core } = interaction.client;
    return new Promise((resolve, reject) => {
      const amount = interaction.options.getInteger("amount");
      let lottoArray = [];
      for (let i = 0; i < amount; i++) {
        let lottoNumber = [];
        for (let j = 0; j < 6; j++) {
          const random = Math.floor(Math.random() * 15 + 1);
          if (lottoNumber.indexOf(random) === -1) {
            lottoNumber.push(random);
          } else {
            j--;
          }
        }
        lottoNumber = lottoNumber.sort((a, b) => {
          return a - b;
        });
        lottoArray.push(lottoNumber);
      }
    });
  }
};
