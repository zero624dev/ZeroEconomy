module.exports = (interaction, key, mode = "osu") => {
  return new Promise((resolve, reject) => {
    const { core } = interaction.client;

    core.addons.osuApi.request(interaction, {
      method: "get",
      url: `https://osu.ppy.sh/api/v2/users/${key}/${mode}?key=username`
    }).then(resolve).catch((err) => {
      if (err.response?.status == 404) {
        resolve("USER_NOT_FOUND");
      } else {
        reject(err);
      }
    });
  });
};
