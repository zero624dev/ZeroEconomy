module.exports = (interaction) => {
  const { core } = interaction.client;
  const [id, commandName, ...args] = interaction.customId.split("-");
  const curCmd = core.cmds[commandName];
  if (id !== interaction.user.id) {
    interaction.reply({
      ephemeral: true, embeds: [{
        title: "다른 사람의 상호작용입니다.",
        color: core.colors.red
      }]
    });
  } else {
    try {
      curCmd.execute.selectMenu(interaction, args).then((replyData) => {
        return core.utils.reply(interaction, replyData);
      }).catch((e) => {
        core.utils.reply(interaction, {
          embeds: [{
            title: `Error -> ${commandName}`,
            description: `\`\`\`js\n${e.toString().slice(0, 2000)}\`\`\``,
            color: core.colors.red
          }]
        });
      });
    } catch (e) {
      core.utils.reply(interaction, {
        embeds: [{
          title: `Error -> ${commandName}`,
          description: `\`\`\`js\n${e.toString().slice(0, 2000)}\`\`\``,
          color: core.colors.red
        }]
      });
    }
  }
};
