const axios = require("axios");

module.exports = {
  chatInput: (interaction) => {
    const { core } = interaction.client;
    return new Promise((resolve, reject) => {
      try {
        interaction.deferReply().then(() => {
          axios({
            method: "get",
            url: "https://discordstatus.com/metrics-display/5k2rt9f7pmny/day.json"
          }).then((res) => {
            const latest = res.data.metrics[0].data.pop();
            core.utils.reply(interaction, {
              embeds: [{
                title: "Discord API Latency",
                description: `<t:${latest.timestamp}:R>`,
                fields: [
                  {
                    name: "Latest | 최근",
                    value: latest.value > 149 ? `**${latest.value}ms**` : `${latest.value}ms`,
                    inline: true
                  },
                  {
                    name: "Average | 평균",
                    value: `${Math.round(res.data.metrics[0].summary.mean)}ms`,
                    inline: true
                  }
                ],
                color: latest.value > 99 ? latest.value > 119 ? latest.value > 149 ? core.colors.red : core.colors.yellow : core.colors.green : core.colors.blue
              }]
            });
          }).catch(reject);
        }).catch(reject);
      } catch (e) {
        reject(e);
      }
    });
  }
};
