const neutralOutcomes = [
  // "**시안**이 당신이 구걸하는 모습을 구경한다.",
  "**@charlottetaylor**가 당신을 쓰다듬고 지나갔다.",
  "**@zero624**가 zero원을 줬다.",
  "**눈**이 흩날린다. ❄️❄️",
  "**바람**이 분다.",
  "**겨울**이었다.",
  "**@star7634**가 쓰레기를 쥐어주고 도망갔다.",
  "**@hebird1098**이 새똥을 싸고 날아갔다.",
  "**@poonggi**가 장난을 치고 갔다."
];

const goodOutcomes = [
  "**@zero624**가 돈을 줬다.",
  "**하늘**에서 돈이 떨어졌다.",
  "**땅**에서 돈을 주웠다.",
  "**@star7634**가 골동품을 쥐어주고 갔다.",
  "**지나가는 사람**의 주머니에서 돈이 떨어졌다.",
];

const calcAmount = () => {
  return Math.floor(Math.pow(1.088687, Math.random() * 100) + 99);
};

module.exports = {
  chatInput: (interaction) => {
    return new Promise((resolve, reject) => {
      const { client } = interaction;
      const { core } = client;

      const outcomeColors = {
        neutral: core.colors.gray,
        good: core.colors.accent,
      };

      core.addons.econDB.getUserWallet(interaction.user.id)
        .then((wallet) => {
          const userWallet = wallet ?? 0;
          let newWallet = userWallet;

          const outcomeType = Math.random() < 0.2 ? "neutral" : "good";
          let outcome = {};
          switch (outcomeType) {
            case "neutral":
              outcome = core.utils.math.randomArray(neutralOutcomes);
              break;
            case "good":
              outcome = core.utils.math.randomArray(goodOutcomes);
              newWallet += calcAmount();
              break;
            default:
              break;
          }
          core.addons.econDB.setUser(interaction.user.id, { wallet: newWallet }, true).then(() => {
            resolve({
              embeds: [
                {
                  title: `${interaction.user.tag}님의 구걸`,
                  description: outcome,
                  fields: [
                    {
                      name: "잔고",
                      value: `${newWallet.toLocaleString()}${outcomeType == "neutral" ? "" : `(+${Math.abs(newWallet - userWallet).toLocaleString()})`}`,
                      inline: true,
                    },
                  ],
                  color: outcomeColors[outcomeType],
                },
              ],
            });
          }).catch(reject);
        }).catch(reject);
    });
  },
};
