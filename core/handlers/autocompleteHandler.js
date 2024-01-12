module.exports = (interaction) => {
  const { core } = interaction.client;
  const curCmd = core.cmds[interaction.commandName];
  try {
    curCmd.execute.autocomplete(interaction).then((replyData) => {
      return core.utils.reply(interaction, (replyData || []).slice(0, 25)).catch(console.error);
    }).catch(console.error);
  } catch (e) {
    console.error(e);
  }
};
