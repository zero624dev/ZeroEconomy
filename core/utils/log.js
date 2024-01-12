module.exports = (client, content) => {
  if (!client) {
    return;
  }
  if (!content) {
    content = "No Content provided to log.js";
  }
  client.channels.cache.get(client.logchannel).send(content);
};
