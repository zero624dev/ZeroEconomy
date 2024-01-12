const os = require("os");

module.exports = {
  chatInput: (interaction) => {
    return new Promise((resolve, reject) => {
      const { client } = interaction;
      const { core } = client;

      const { roundToDecimal, percentage } = core.utils.math;

      const memDivisor = 1_073_741_824; // MB: 1_048_576
      const memText = "GB"; // MB

      resolve({
        embeds: [
          {
            title: "ZeroEconomy",
            thumbnail: {
              url: client.user.displayAvatarURL()
            },
            url: "https://discord.com/api/oauth2/authorize?client_id=1176562320323923978&permissions=0&scope=bot+applications.commands",
            fields: [
              {
                name: "Developers",
                value: ">>> @zero624, @realm2100, @sironemo",
                inline: true
              },
              {
                name: "Using",
                value: `> discord.js v${require("discord.js").version}\n> ${core.info.name} v${core.info.version}`,
                inline: false
              },
              {
                name: "Ping",
                value: `> \`${client.ws.ping.toString().replace(-1, "?")}ms\``,
                inline: true
              },
              {
                name: "Uptime",
                value: `> <t:${roundToDecimal((Date.now() - client.uptime) / 1000)}:R>`,
                inline: true
              },
              {
                name: "Since",
                value: "> <t:1700584716:D>",
                inline: true,
              },
              {
                name: "CPU",
                value: `> \`${os.loadavg()[0]}%\``,
                inline: true
              },
              {
                name: "Memory",
                value: `> \`${roundToDecimal((os.totalmem() - os.freemem()) / memDivisor, 1)} ${memText} / ${roundToDecimal(os.totalmem() / memDivisor, 1)} ${memText} (${percentage(os.totalmem() - os.freemem(), os.totalmem(), 1)}%)\``,
                inline: true
              },
            ],
            color: core.colors.blue
          }
        ]
      });
    });
  }
};
