const rewards = [
  50_000,
  30_000,
  25_000,
];

module.exports = {
  chatInput: (interaction) => {
    const { client } = interaction;
    const { core } = client;
    return new Promise((resolve, reject) => {
      const nowDate = new Date(Date.now() + 9 * 60 * 60 * 1000);
      const nowDateId = nowDate.toISOString().slice(0, 10);
      const hours = nowDate.getHours();
      client.mongoose.model("Comp").aggregate([{ $match: { _id: nowDateId }, }, { $project: { match: { $in: [interaction.user.id, "$order.id"] } } }]).then(([res]) => {
        if (res?.match) {
          return resolve({ content: "이미 출석을 했어요!", ephemeral: true });
        }
        client.mongoose.model("Comp").updateOne({ _id: nowDateId }, { $push: { order: { id: interaction.user.id, timestamps: Date.now() } } }, { upsert: true }).then(() => {
          client.mongoose.model("Comp").aggregate([{ $match: { _id: nowDateId }, }, { $project: { _id: 0, size: { $size: "$order" } } }]).then(([comp]) => {
            const order = comp?.size ?? 1, reward = rewards[hours] ?? 20_000;
            core.addons.econDB.addUserWallet(interaction.user.id, reward, true).then(() => {
              resolve({ content: `${order}위) ${hours}시 출석 보상(${reward.toLocaleString()}원)을 지급했어요!` });
            });
          });
        });
      }).catch(reject);
    });
  }
};
