const importFresh = require("import-fresh");

module.exports = {
  osuApi: {
    request: importFresh("./files/osuApi/request.js"),
    home: {
      search: importFresh("./files/osuApi/home/search.js"),
    },
    user: {
      profile: importFresh("./files/osuApi/user/profile.js"),
      recent: importFresh("./files/osuApi/user/recent.js"),
      top: importFresh("./files/osuApi/user/top.js"),
    }
  }
};
