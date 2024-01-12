const importFresh = require("import-fresh");
const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  avatar: {
    data: new SlashCommandBuilder()
      .setName("avatar")
      .setNameLocalization("ko", "프사")
      .setDescription("Displays a user's avatar")
      .setDescriptionLocalization("ko", "유저의 프사를 보여줍니다")
      .addUserOption((option) => {
        return option.setName("user")
          .setNameLocalization("ko", "유저")
          .setDescription("Select User")
          .setDescriptionLocalization("ko", "유저를 선택하세요");
      }),
    execute: importFresh("./files/avatar.js")
  },
  bot: {
    data: new SlashCommandBuilder()
      .setName("bot")
      .setNameLocalization("ko", "봇")
      .setDescription("Displays information about the bot")
      .setDescriptionLocalization("ko", "봇에 대한 정보를 표시합니다"),
    execute: importFresh("./files/bot.js")
  },
  discordlatency: {
    data: new SlashCommandBuilder()
      .setName("discordlatency")
      .setNameLocalization("ko", "디스코드지연")
      .setDescription("Displays current Discord API latency")
      .setDescriptionLocalization("ko", "현재 디스코드 API 지연시간을 보여줍니다"),
    execute: importFresh("./files/discordlatency.js")
  },
  eval: {
    whitelist: ["285229678443102218"],
    data: new SlashCommandBuilder()
      .setName("eval")
      .setDescription("Run some code")
      .addStringOption((option) => {
        return option.setName("code")
          .setDescription("Code to run")
          .setRequired(true);
      }),
    execute: importFresh("./files/eval.js")
  },
  osu: {
    whitelist: ["285229678443102218"],
    data: new SlashCommandBuilder()
      .setName("osu")
      .setNameLocalization("ko", "오스")
      .setDescription("Shows osu! user's stats")
      .setDescriptionLocalization("ko", "osu! 유저의 스탯을 표시합니다")
      .addSubcommand((subcommand) => {
        return subcommand.setName("profile")
          .setNameLocalization("ko", "프로필")
          .setDescription("Shows user's profile")
          .setDescriptionLocalization("ko", "유저의 프로필을 표시합니다")
          .addStringOption((option) => {
            return option.setName("user")
              .setNameLocalization("ko", "유저")
              .setDescription("User to show profile")
              .setDescriptionLocalization("ko", "프로필을 표시할 유저")
              .setRequired(true)
              .setAutocomplete(true);
          })
          .addStringOption((option) => {
            return option.setName("mode")
              .setNameLocalization("ko", "모드")
              .setDescription("Gamemode")
              .setDescriptionLocalization("ko", "게임모드")
              .addChoices(
                {
                  name: "osu!standard",
                  name_localizations: {
                    ko: "스탠다드"
                  },
                  value: "osu"
                },
                {
                  name: "osu!taiko",
                  name_localizations: {
                    ko: "태고"
                  },
                  value: "taiko"
                },
                {
                  name: "osu!catch",
                  name_localizations: {
                    ko: "캐치"
                  },
                  value: "fruits"
                },
                {
                  name: "osu!mania",
                  name_localizations: {
                    ko: "매니아"
                  },
                  value: "mania"
                }
              );
          });
      })
      .addSubcommand((subcommand) => {
        return subcommand.setName("top")
          .setNameLocalization("ko", "탑")
          .setDescription("Shows user's top plays")
          .setDescriptionLocalization("ko", "유저의 탑 플레이를 표시합니다")
          .addStringOption((option) => {
            return option.setName("user")
              .setNameLocalization("ko", "유저")
              .setDescription("User to show top plays")
              .setDescriptionLocalization("ko", "탑 플레이를 표시할 유저")
              .setRequired(true);
          })
          .addIntegerOption((option) => {
            return option.setName("mode")
              .setNameLocalization("ko", "모드")
              .setDescription("Gamemode")
              .setDescriptionLocalization("ko", "게임모드")
              .addChoices(
                {
                  name: "osu!standard",
                  name_localizations: {
                    ko: "스탠다드"
                  },
                  value: 0
                },
                {
                  name: "osu!taiko",
                  name_localizations: {
                    ko: "태고"
                  },
                  value: 1
                },
                {
                  name: "osu!catch",
                  name_localizations: {
                    ko: "캐치"
                  },
                  value: 2
                },
                {
                  name: "osu!mania",
                  name_localizations: {
                    ko: "매니아"
                  },
                  value: 3
                }
              );
          });
      }),
    execute: importFresh("./files/osu.js")
  },
  reload: {
    guilds: ["1176759489366589550"],
    whitelist: ["285229678443102218"],
    data: new SlashCommandBuilder()
      .setName("reload")
      .setDescription("reload core"),
    execute: importFresh("./files/reload.js")
  },
  restart: {
    guilds: ["1176759489366589550"],
    whitelist: ["285229678443102218"],
    data: new SlashCommandBuilder()
      .setName("restart")
      .setDescription("restart the bot"),
    execute: importFresh("./files/restart.js")
  },
  test: {
    guilds: ["1176759489366589550"],
    whitelist: ["285229678443102218"],
    data: new SlashCommandBuilder()
      .setName("test")
      .setDescription("test")
      .addIntegerOption((option) => {
        return option.setName("enum")
          .setDescription("enum")
          .setRequired(true);
      }),
    execute: importFresh("./files/test.js")
  },
  upload: {
    guilds: ["1176759489366589550"],
    whitelist: ["285229678443102218"],
    data: new SlashCommandBuilder()
      .setName("upload")
      .setDescription("upload commands"),
    execute: importFresh("./files/upload.js")
  },
  whois: {
    data: new SlashCommandBuilder()
      .setName("whois")
      .setNameLocalization("ko", "누구")
      .setDescription("Displays information about a server member.")
      .setDescriptionLocalization("ko", "서버 멤버에 대한 정보를 표시합니다")
      .addUserOption((option) => {
        return option.setName("member")
          .setNameLocalization("ko", "멤버")
          .setDescription("Select Member")
          .setDescriptionLocalization("ko", "멤버를 선택하세요")
          .setRequired(true);
      }),
    execute: importFresh("./files/whois.js")
  }
};
