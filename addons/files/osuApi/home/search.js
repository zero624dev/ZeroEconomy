module.exports = (interaction, key) => {
  return new Promise((resolve, reject) => {
    const { core } = interaction.client;

    core.addons.osuApi.request(interaction, {
      method: "get",
      url: `https://osu.ppy.sh/api/v2/search?mode=user&query=${key}`
    }).then(resolve).catch(reject);
  });
};
