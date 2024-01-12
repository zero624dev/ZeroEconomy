const { ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } = require("discord.js");
const axios = require("axios");

const subcommands = {
  profile: (interaction, args) => {
    return new Promise((resolve, reject) => {
      const { core } = interaction.client;
      const { roundToDecimal, percentage } = core.utils.math;

      const user = interaction.isChatInputCommand() ? interaction.options.getString("user") : args[1];
      const mode = (interaction.isChatInputCommand() ? interaction.options.getString("mode") : interaction.values[0]) || "";

      core.addons.osuApi.user.profile(interaction, user, mode).then((res) => {
        const userData = res;
        if (userData == "USER_NOT_FOUND") {
          core.utils.reply(interaction, {
            embeds: [{
              title: user,
              description: "User not found ;_;",
              color: core.colors.red
            }]
          });
        } else {
          core.utils.reply(interaction, {
            embeds: [{
              title: userData.username,
              url: `https://osu.ppy.sh/users/${userData.id}/${mode}`,
              thumbnail: {
                url: userData.avatar_url
              },
              description: `Performance: **${Math.round(userData.statistics.pp).toLocaleString()}pp**(#${(userData.statistics.global_rank || 0).toLocaleString()}) | :flag_${userData.country_code.toLowerCase()}:(#${(userData.statistics.country_rank || 0).toLocaleString()})`,
              fields: [
                {
                  name: "Profile",
                  value: `\`\`\`c\n👍 Accuracy: ${roundToDecimal(userData.statistics.hit_accuracy, 2)}%\n⏫ Level: ${Math.round(userData.statistics.level.current).toLocaleString()} (${userData.statistics.level.progress}%)\n\n🕥 Playtime: ${Math.floor(userData.statistics.play_time / 3600)}h\n🎮 Playcount: ${userData.statistics.play_count.toLocaleString()}\n\n➕ Joined: ${userData.join_date.split("T")[0]}\`\`\``,
                  inline: false
                },
                {
                  name: "Score",
                  value: `\`\`\`c\nTotal: ${userData.statistics.total_score.toLocaleString()}\nRanked: ${userData.statistics.ranked_score.toLocaleString()} (${percentage(userData.statistics.ranked_score, userData.statistics.total_score + userData.statistics.ranked_score, 1)}%)\`\`\``,
                  inline: false
                },
                {
                  name: "Hits",
                  value: `\`\`\`c\n300x: ${userData.statistics.count_300.toLocaleString()} (${percentage(userData.statistics.count_300, userData.statistics.total_hits, 1)}%)\n100x: ${userData.statistics.count_100.toLocaleString()} (${percentage(userData.statistics.count_100, userData.statistics.total_hits, 1)}%)\n50x: ${userData.statistics.count_50.toLocaleString()} (${percentage(userData.statistics.count_50, userData.statistics.total_hits, 1)}%)\`\`\``,
                  inline: true
                },
                {
                  name: "Ranks",
                  value: `\`\`\`c\nSS(H): ${userData.statistics.grade_counts.ss.toLocaleString()}(${userData.statistics.grade_counts.ssh.toLocaleString()})\nS(H): ${userData.statistics.grade_counts.s.toLocaleString()}(${userData.statistics.grade_counts.sh.toLocaleString()})\nA: ${userData.statistics.grade_counts.a.toLocaleString()}\`\`\``,
                  inline: false
                }
              ],
              footer: {
                text: `Using osu!api v2 • ${userData.id}`
              },
              color: core.colors.orange
            }],
            components: [
              new ActionRowBuilder().addComponents(
                new StringSelectMenuBuilder()
                  .setCustomId(`${interaction.user.id}-osu-profile-${user}`)
                  .addOptions(
                    new StringSelectMenuOptionBuilder()
                      .setLabel("osu!standard")
                      .setValue("osu")
                      .setEmoji({
                        id: "1192473801234059435",
                        name: "standard"
                      })
                      .setDefault(mode ? mode == "osu" : userData.playmode == "osu"),
                    new StringSelectMenuOptionBuilder()
                      .setLabel("osu!taiko")
                      .setValue("taiko")
                      .setEmoji({
                        id: "1192473797446619206",
                        name: "taiko"
                      })
                      .setDefault(mode ? mode == "taiko" : userData.playmode == "taiko"),
                    new StringSelectMenuOptionBuilder()
                      .setLabel("osu!catch")
                      .setValue("fruits")
                      .setEmoji({
                        id: "1192473795798253568",
                        name: "catch"
                      })
                      .setDefault(mode ? mode == "fruits" : userData.playmode == "fruits"),
                    new StringSelectMenuOptionBuilder()
                      .setLabel("osu!mania")
                      .setValue("mania")
                      .setEmoji({
                        id: "1192473792598003892",
                        name: "mania"
                      })
                      .setDefault(mode ? mode == "mania" : userData.playmode == "mania")
                  )
              )
            ]
          });
        }
      }).catch(reject);
    });
  },
  top: (interaction, args) => {
    return new Promise((resolve, reject) => {
      const { core } = interaction.client;
    });
  }
};

module.exports = {
  chatInput: (interaction) => {
    return new Promise((resolve, reject) => {
      const subcommand = interaction.options.getSubcommand();
      subcommands[subcommand](interaction).then(resolve).catch(reject);
    });
  },
  autocomplete: (interaction) => {
    return new Promise((resolve, reject) => {
      const { core } = interaction.client;

      const focused = interaction.options.getFocused(true);
      if (focused.name == "user") {
        if (focused.value.trim() !== "") {
          core.addons.osuApi.home.search(interaction, focused.value).then((res) => {
            resolve(res.user.data.slice(0, 5).map((user) => {
              return {
                name: user.username,
                value: user.username
              };
            }));
          });
        } else {
          resolve([]);
        }
      }
    });
  },
  selectMenu: (interaction, args) => {
    return new Promise((resolve, reject) => {
      const subcommand = args[0];
      subcommands[subcommand](interaction, args).then(resolve).catch(reject);
    });
  }
};
