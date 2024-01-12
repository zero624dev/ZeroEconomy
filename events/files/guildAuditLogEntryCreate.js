const guildId = "1086316004382085150";
const channelId = "1086316005464211526";
const logChannelId = "1126123053928169514";
const allowedLogTypes = [
  1, // GuildUpdate
  10, // ChannelCreate
  // 11, // ChannelUpdate, doesn't work for some reason
  12, // ChannelDelete
  20, // MemberKick
  22, // MemberBanAdd
  23, // MemberBanRemove
  24, // MemberUpdate
  25, // MemberRoleUpdate
  /* 30, // RoleCreate
  31, // RoleUpdate
  32, // RoleDelete */
];

const formatUser = (user) => {
  return `<@${user.id}> (**${user.tag}**, \`${user.id}\`)`;
};
const formatUserFromNameId = (name, id) => {
  return `<@${id}> (**${name}**, \`${id}\`)`;
};
const formatRole = (role) => {
  return `<@&${role.id}> (**${role.name}**, \`${role.id}\`)`;
};
const formatRoleFromNameId = (name, id) => {
  return `<@&${id}> (**${name}**, \`${id}\`)`;
};

module.exports = (guildAuditLogsEntry, guild) => {
  const { core } = guild.client;
  const entry = guildAuditLogsEntry;
  const entryType = entry.action;
  const entryChanges = entry.changes;
  if (guild.id == guildId && allowedLogTypes.includes(entryType)) {
    const embed = {
      fields: [{
        name: "ID",
        value: entryType,
      }],
      timestamp: new Date(),
    };
    if (entryType == 1) {
      embed.title = "서버 설정 변경";
      embed.fields = [];
      embed.fields.push({
        name: "수행",
        value: entry.executor ? formatUser(entry.executor) : formatUserFromNameId("?", entry.executorId),
        inline: false
      });
      for (const change of entryChanges) {
        if (change.key == "name") {
          embed.fields.push({
            name: "서버 이름 변경",
            value: `**전**: ${change.old || "*(없음)*"}\n**후**: ${change.new || "*(없음)*"}`,
            inline: true
          });
        }
        if (change.key == "description") {
          embed.fields.push({
            name: "서버 설명 변경",
            value: `**전**: ${change.old}\n**후**: ${change.new}`,
            inline: true
          });
        }
        if (change.key == "system_channel_id") {
          embed.fields.push({
            name: "시스템 채널 변경",
            value: `**전**: ${change.old ? `<#${change.old}>` : "*(없음)*"}\n**후**: ${change.new ? `<#${change.new}>` : "*(없음)*"}`,
            inline: true
          });
        }
        if (change.key == "afk_channel_id") {
          embed.fields.push({
            name: "AFK 채널 변경",
            value: `**전**: ${change.old ? `<#${change.old}>` : "*(없음)*"}\n**후**: ${change.new ? `<#${change.new}>` : "*(없음)*"}`,
            inline: true
          });
        }
        if (change.key == "afk_timeout") {
          embed.fields.push({
            name: "AFK 시간 변경",
            value: `**전**: ${change.old / 60}분\n**후**: ${change.new / 60}분`,
            inline: true
          });
        }
        if (change.key == "rules_channel_id") {
          embed.fields.push({
            name: "규칙 채널 변경",
            value: `**전**: <#${change.old}>\n**후**: <#${change.new}>`,
            inline: true
          });
        }
        if (change.key == "public_updates_channel_id") {
          embed.fields.push({
            name: "공지 채널 변경",
            value: `**전**: <#${change.old}>\n**후**: <#${change.new}>`,
            inline: true
          });
        }
        if (change.key == "premium_progress_bar_enabled") {
          embed.fields.push({
            name: "서버 부스트 진행바",
            value: `**전**: ${change.old ? "사용" : "사용 안 함"}\n**후**: ${change.new ? "사용" : "사용 안 함"}`,
            inline: true
          });
        }
        if (change.key == "preferred_locale") {
          embed.fields.push({
            name: "서버 언어 변경",
            value: `**전**: ${change.old}\n**후**: ${change.new}`,
            inline: true
          });
        }
        if (change.key == "widget_enabled") {
          embed.fields.push({
            name: "서버 위젯",
            value: `**전**: ${change.old ? "사용" : "사용 안 함"}\n**후**: ${change.new ? "사용" : "사용 안 함"}`,
            inline: true
          });
        }
      }
      embed.color = core.colors.blue;
    } else if (entryType == 10) {
      embed.title = "채널 생성";
      embed.fields = [];
      embed.fields.push(
        {
          name: "수행",
          value: entry.executor ? formatUser(entry.executor) : formatUserFromNameId("?", entry.executorId),
          inline: false
        },
        {
          name: "채널",
          value: `<#${entry.targetId}>`,
          inline: true
        },
        {
          name: "채널 아이디",
          value: entry.targetId,
          inline: true
        }
      );
      embed.color = core.colors.blue;
    } else if (entryType == 12) {
      embed.title = "채널 삭제";
      embed.fields = [];
      embed.fields.push(
        {
          name: "수행",
          value: entry.executor ? formatUser(entry.executor) : formatUserFromNameId("?", entry.executorId),
          inline: true
        },
        {
          name: "채널 아이디",
          value: entry.targetId,
          inline: false
        }
      );
      embed.color = core.colors.red;
    } else if (entryType == 20) {
      embed.title = "멤버 추방";
      embed.fields = [];
      embed.fields.push(
        {
          name: "수행",
          value: entry.executor ? formatUser(entry.executor) : formatUserFromNameId("?", entry.executorId),
          inline: true
        },
        {
          name: "대상",
          value: entry.target ? formatUser(entry.target) : formatUserFromNameId("?", entry.targetId),
          inline: true
        }
      );
      embed.color = core.colors.red;
    } else if (entryType == 22) {
      embed.title = "멤버 차단";
      embed.fields = [];
      embed.fields.push(
        {
          name: "수행",
          value: entry.executor ? formatUser(entry.executor) : formatUserFromNameId("?", entry.executorId),
          inline: true
        },
        {
          name: "대상",
          value: entry.target ? formatUser(entry.target) : formatUserFromNameId("?", entry.targetId),
          inline: true
        }
      );
      embed.color = core.colors.red;
    } else if (entryType == 23) {
      embed.title = "멤버 차단해제";
      embed.fields = [];
      embed.fields.push(
        {
          name: "수행",
          value: entry.executor ? formatUser(entry.executor) : formatUserFromNameId("?", entry.executorId),
          inline: true
        },
        {
          name: "대상",
          value: entry.target ? formatUser(entry.target) : formatUserFromNameId("?", entry.targetId),
          inline: true
        }
      );
      embed.color = core.colors.yellow;
    } else if (entryType == 24) {
      if (entryChanges[0].key == "nick") {
        embed.title = "멤버 닉네임 변경";
        embed.fields = [];
        if (entry.executorId == entry.targetId) {
          embed.fields.push({
            name: "수행 & 대상",
            value: entry.executor ? formatUser(entry.executor) : formatUserFromNameId("?", entry.executorId),
            inline: false
          });
        } else {
          embed.fields.push(
            {
              name: "수행",
              value: entry.executor ? formatUser(entry.executor) : formatUserFromNameId("?", entry.executorId),
              inline: true
            },
            {
              name: "대상",
              value: entry.target ? formatUser(entry.target) : formatUserFromNameId("?", entry.targetId),
              inline: false
            }
          );
        }
        embed.fields.push(
          {
            name: "변경 전",
            value: entryChanges[0].old || "*(없음)*",
            inline: true
          },
          {
            name: "변경 후",
            value: entryChanges[0].new || "*(없음)*",
            inline: true
          }
        );
        embed.color = core.colors.blue;
      }
    } else if (entryType == 25) {
      embed.title = "멤버 역할 변경";
      embed.fields = [];
      if (entry.executorId == entry.targetId) {
        embed.fields.push({
          name: "수행 & 대상",
          value: entry.executor ? formatUser(entry.executor) : formatUserFromNameId("?", entry.executorId),
          inline: false
        });
      } else {
        embed.fields.push(
          {
            name: "수행",
            value: entry.executor ? formatUser(entry.executor) : formatUserFromNameId("?", entry.executorId),
            inline: true
          },
          {
            name: "대상",
            value: entry.target ? formatUser(entry.target) : formatUserFromNameId("?", entry.targetId),
            inline: false
          }
        );
      }
      for (const change of entryChanges) {
        if (change.key == "$add") {
          embed.fields.push({
            name: "추가된 역할",
            value: change.new.map((role) => {
              return formatRoleFromNameId(role.name, role.id);
            }).join("\n"),
            inline: true
          });
          embed.color = core.colors.blue;
        }
        if (change.key == "$remove") {
          embed.fields.push({
            name: "제거된 역할",
            value: change.new.map((role) => {
              return formatRoleFromNameId(role.name, role.id);
            }).join("\n"),
            inline: true
          });
          embed.color = core.colors.red;
        }
        if (embed.fields.length == 2) {
          embed.color = core.colors.yellow;
        }
      }
    } else if (entryType == 30) {

    } else if (entryType == 31) {

    } else if (entryType == 32) {

    }
    if ([30, 31, 32].includes(entryType)) {
      console.log(entryType, JSON.stringify(entry, null, 2));
    }
    guild.channels.cache.get(logChannelId).send({
      embeds: [embed]
    });
  }
};
