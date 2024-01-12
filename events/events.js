const importFresh = require("import-fresh");

module.exports = {
  interactionCreate: importFresh("./files/interactionCreate.js"),
  messageCreate: importFresh("./files/messageCreate.js"),
  ready: importFresh("./files/ready.js"),
};
