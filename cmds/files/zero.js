const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");

function stringSimilarity(str1, str2) {
  const m = str1.length;
  const n = str2.length;

  const dp = new Array(m + 1).fill(null).map(() => {
    return new Array(n + 1).fill(0);
  });

  for (let i = 0; i <= m; i++) {
    dp[i][0] = i;
  }
  for (let j = 0; j <= n; j++) {
    dp[0][j] = j;
  }

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (str1[i - 1] === str2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1];
      } else {
        dp[i][j] = 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
      }
    }
  }

  return dp[m][n] / Math.max(m, n);
}

const items = new Array(10000).fill(0).map(() => {
  return Math.random().toString(36).substring(2, 15);
});

module.exports = {
  chatInput: (interaction) => {
    return new Promise((resolve, reject) => {
      const { core } = interaction.client;
      core.utils.reply(interaction, {
        content: stringSimilarity(interaction.options.getString("a"), interaction.options.getString("b")).toString(),
      });
    });
  },
  autocomplete: (interaction) => {
    return new Promise((resolve, reject) => {
      const search = interaction.options.getString("test");
      resolve(items.sort((a, b) => {
        return Math.min(
          stringSimilarity(a, search) - stringSimilarity(b, search),
          stringSimilarity(a, search) - stringSimilarity(b, search)
        );
      }).slice(0, 25).map((item) => {
        return { name: item, value: item };
      }));
    });
  }
};
