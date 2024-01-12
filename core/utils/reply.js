module.exports = (interaction, content, replyType) => {
  return new Promise((resolve, reject) => {
    if (!interaction) {
      reject("No Interaction Provided");
    }
    if (!content) {
      reject("No Content Provided");
    }
    if (interaction.isChatInputCommand()) {
      if (interaction.replied || interaction.deferred) {
        interaction.editReply(content).then(resolve).catch(reject);
      } else {
        interaction.reply(content).then(resolve).catch(reject);
      }
    } else if (interaction.isAutocomplete()) {
      if (!interaction.responded) {
        interaction.respond(content).then(resolve).catch(reject);
      }
    } else if (interaction.isButton() || interaction.isAnySelectMenu() || interaction.isModalSubmit()) {
      if (interaction.replied || interaction.deferred) {
        interaction[replyType == "followUp" ? "followUp" : "update"](content).then(resolve).catch(reject);
      } else {
        interaction[replyType == "followUp" ? "reply" : "update"](content).then(resolve).catch(reject);
      }
    }
  });
};
