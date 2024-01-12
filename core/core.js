const importFresh = require("import-fresh");

module.exports = {
  info: {
    name: "fulcrum-core",
    version: "1.4.4",
    description: "core files for realm's discord bots"
  },
  addons: importFresh("./../addons/addons.js"),
  colors: {
    accent: 32767,
    black: 0,
    blue: 32767,
    gray: 9807270,
    green: 5763719,
    orange: 15761185,
    pink: 15418782,
    purple: 10181046,
    red: 15548997,
    white: 16777215,
    yellow: 16705372
  },
  cmds: importFresh("./../cmds/cmds.js"),
  events: importFresh("./../events/events.js"),
  handlers: {
    autocompleteHandler: importFresh("./handlers/autocompleteHandler.js"),
    buttonHandler: importFresh("./handlers/buttonHandler.js"),
    chatInputCommandHandler: importFresh("./handlers/chatInputCommandHandler.js"),
    eventHandler: importFresh("./handlers/eventHandler.js"),
    interactionHandler: importFresh("./handlers/interactionHandler.js"),
    modalSubmitHandler: importFresh("./handlers/modalSubmitHandler.js"),
    selectMenuHandler: importFresh("./handlers/selectMenuHandler.js"),
  },
  utils: {
    log: importFresh("./utils/log.js"),
    math: importFresh("./utils/math.js"),
    reload: importFresh("./utils/reload.js"),
    reply: importFresh("./utils/reply.js"),
    string: importFresh("./utils/string.js"),
    upload: importFresh("./utils/upload.js")
  }
};
