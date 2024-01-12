module.exports = (client, event, ...args) => {
  const { core } = client;
  core.events[event](...args);
};
