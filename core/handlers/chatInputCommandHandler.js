module.exports = (interaction) => {
  const { client } = interaction;
  const { core } = client;
  if (!Object.hasOwn(core.cmds, interaction.commandName)) {
    return core.utils.reply(interaction, {
      embeds: [{
        title: "Error",
        description: "존재하지 않는 커맨드입니다.",
        color: core.colors.red
      }]
    });
  }
  const curCmd = core.cmds[interaction.commandName];
  if (curCmd.whitelist) {
    if (!curCmd.whitelist.includes(interaction.user.id)) {
      return core.utils.reply(interaction, {
        embeds: [{
          title: "Error",
          description: "이 커맨드를 사용할 권한이 없습니다.",
          color: core.colors.red
        }]
      });
    }
  }
  if (curCmd.perms) {
    if (!interaction.member.permissions.has(curCmd.perms)) {
      return core.utils.reply(interaction, {
        embeds: [{
          title: "Error",
          description: "이 커맨드를 사용할 권한이 없습니다.",
          color: core.colors.red
        }]
      });
    }
  }
  if (curCmd.cooldown) {
    const cooldown = client.cooldowns.get(`${interaction.commandName}-${interaction.user.id}`);
    if (Date.now() < cooldown) {
      return core.utils.reply(interaction, {
        ephemeral: true, embeds: [{
          title: "쿨다운",
          description: `<t:${Math.ceil(cooldown / 1000)}:R>에 다시 시도해주세요.`,
          color: core.colors.yellow
        }]
      });
    }
    client.cooldowns.set(`${interaction.commandName}-${interaction.user.id}`, Date.now() + curCmd.cooldown);
  }
  try {
    curCmd.execute.chatInput(interaction).then((res) => {
      return core.utils.reply(interaction, res);
    }).catch((e) => {
      core.utils.reply(interaction, {
        embeds: [{
          title: `Error -> ${interaction.commandName}`,
          description: `\`\`\`js\n${e.toString().slice(0, 2000)}\`\`\``,
          color: core.colors.red
        }],
        components: []
      });
      console.error(interaction.commandName, e);
    });
  } catch (e) {
    core.utils.reply(interaction, {
      embeds: [{
        title: `Error -> ${interaction.commandName}`,
        description: `\`\`\`js\n${e.toString().slice(0, 2000)}\`\`\``,
        color: core.colors.red
      }],
      components: []
    });
    console.error(interaction.commandName, e);
  }
};
