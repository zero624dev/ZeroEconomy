module.exports = (client) => {
  const { core } = client;
  return new Promise((resolve) => {
    const cmdList = {};
    for (const cmd of Object.keys(core.cmds)) {
      const curCmd = core.cmds[cmd];
      if (!curCmd.guilds) {
        if (!cmdList.global) {
          cmdList.global = [];
        }
        cmdList.global.push(curCmd.data.setDMPermission(false).toJSON());
      } else {
        for (const guild of curCmd.guilds) {
          if (!cmdList[guild]) {
            cmdList[guild] = [];
          }
          cmdList[guild].push(curCmd.data.toJSON());
        }
      }
    }
    const status = {};
    for (const guild of Object.keys(cmdList)) {
      client.application.commands.set(cmdList[guild], guild == "global" ? undefined : guild).then(() => {
        status[guild] = true;
        if (Object.keys(status).length == Object.keys(cmdList).length) {
          resolve({ cmdList: cmdList, status: status });
        }
      }).catch(() => {
        status[guild] = false;
        if (Object.keys(status).length == Object.keys(cmdList).length) {
          resolve({ cmdList: cmdList, status: status });
        }
      });
    }
  });
};
