const importFresh = require("import-fresh");

module.exports = {
  guildAuditLogEntryCreate: importFresh("./files/guildAuditLogEntryCreate.js"),
  guildMemberAdd: importFresh("./files/guildMemberAdd.js"),
  guildMemberRemove: importFresh("./files/guildMemberRemove.js"),
  interactionCreate: importFresh("./files/interactionCreate.js"),
  ready: importFresh("./files/ready.js"),
};
