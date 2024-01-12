const importFresh = require("import-fresh");

module.exports = (client) => {
  return new Promise((resolve, reject) => {
    try {
      const core = importFresh("../core.js");
      client.core = core;
      resolve(client.core);
    } catch (e) {
      console.error(e);
      reject(e);
    }
  });
};
