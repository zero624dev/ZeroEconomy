const guildId = "1086316004382085150";
const channelId = "1086316005464211526";
const logChannelId = "1126123053928169514";

module.exports = (guildMember) => {
  const { core } = guildMember.client;
  const guildUser = guildMember.user;
  if (guildMember.guild.id == guildId) {
    guildMember.guild.channels.cache.get(channelId).send({
      embeds: [{
        title: `${guildUser.tag}님 퇴장`,
        description: "힝구...",
        color: core.colors.red
      }]
    });
    guildMember.guild.channels.cache.get(logChannelId).send({
      embeds: [{
        title: "유저 퇴장",
        description: `<@${guildUser.id}> (**${guildUser.tag}**, \`${guildMember.id}\`) 이(가) 서버를 나갔습니다.`,
        thumbnail: {
          url: guildUser.displayAvatarURL({ dynamic: true })
        },
        color: core.colors.red,
        timestamp: new Date(),
      }]
    });
  }
};
