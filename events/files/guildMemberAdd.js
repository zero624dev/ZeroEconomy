const minAccountAge = 60 * 60 * 24 * 30 * 1000; // 30 days in milliseconds
const guildId = "1086316004382085150";
const channelId = "1086316005464211526";
const logChannelId = "1126123053928169514";
const quarantineRoleId = "1193131176391622748";
const quarantineChannelId = "1193132832671932516";

module.exports = (guildMember) => {
  const { core } = guildMember.client;
  const guildUser = guildMember.user;
  if (guildMember.guild.id == guildId) {
    let quarantined = false;
    if (!guildUser.bot) {
      if (guildUser.createdTimestamp > Date.now() - minAccountAge) {
        quarantined = true;
      }
    }
    if (quarantined == true) {
      guildMember.roles.add(quarantineRoleId);
      guildMember.guild.channels.cache.get(quarantineChannelId).send({
        content: `<@&1086317125330817084> <@${guildMember.id}>`,
        embeds: [{
          title: "입장 전 확인절차",
          description: "이 채널에서 서버에 들어온 방법/이유를 설명해주세요.",
          color: core.colors.yellow
        }]
      });
    }
    guildMember.guild.channels.cache.get(channelId).send({
      embeds: [{
        title: `${guildUser.tag}님 등장${quarantined ? "" : "!"}`,
        description: `<@${guildMember.id}>\n${quarantined ? "자동으로 격리되었습니다." : "모두 반겨주세요!"}`,
        color: quarantined ? core.colors.yellow : core.colors.blue
      }]
    });
    guildMember.guild.channels.cache.get(logChannelId).send({
      embeds: [{
        title: "새 멤버",
        description: `<@${guildUser.id}> (**${guildUser.tag}**, \`${guildMember.id}\`) 이(가) 참여했습니다.`,
        fields: [
          {
            name: "계정 생성일",
            value: `<t:${Math.floor(guildUser.createdTimestamp / 1000)}:F>`,
            inline: false
          },
          {
            name: "격리 여부",
            value: quarantined ? "**예**" : "아니오",
            inline: false
          }
        ],
        thumbnail: {
          url: guildUser.displayAvatarURL({ dynamic: true })
        },
        color: quarantined ? core.colors.yellow : core.colors.blue,
        timestamp: new Date(),
      }]
    });
  }
};
