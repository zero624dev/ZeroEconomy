const importFresh = require("import-fresh");

module.exports = {
  econDB: {
    addUserInventory: importFresh("./files/econDB/addUserInventory.js"),
    addUserWallet: importFresh("./files/econDB/addUserWallet.js"),
    getUser: importFresh("./files/econDB/getUser.js"),
    getUserInventory: importFresh("./files/econDB/getUserInventory.js"),
    getUserWallet: importFresh("./files/econDB/getUserWallet.js"),
    setUser: importFresh("./files/econDB/setUser.js"),
    subtractUserInventory: importFresh("./files/econDB/subtractUserInventory.js"),
    subtractUserWallet: importFresh("./files/econDB/subtractUserWallet.js"),
  },
  data: {
    items: importFresh("./files/data/items.js"),
  }
};
