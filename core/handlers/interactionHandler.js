module.exports = (interaction) => {
  const { core } = interaction.client;
  if (interaction.isChatInputCommand()) {
    core.handlers.chatInputCommandHandler(interaction);
  } else if (interaction.isAutocomplete()) {
    core.handlers.autocompleteHandler(interaction);
  } else if (interaction.isButton()) {
    core.handlers.buttonHandler(interaction);
  } else if (interaction.isAnySelectMenu()) {
    core.handlers.selectMenuHandler(interaction);
  } else if (interaction.isModalSubmit()) {
    core.handlers.modalSubmitHandler(interaction);
  }
};
