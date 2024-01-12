const { createCanvas, loadImage } = require("canvas");
const path = require("path");
const fs = require("fs");

const sprites = new Map();
const spriteDir = path.join(__dirname, "../../media/farm_sprites");
fs.readdirSync(spriteDir, { withFileTypes: true }).forEach((spr) => {
  if (spr.isDirectory()) {
    fs.readdirSync(`${spriteDir}/${spr.name}`).forEach((file, i) => {
      loadImage(`${spriteDir}/${spr.name}/${file}`).then((img) => {
        sprites.set(`${spr.name}${i}`, img);
      });
    });
  } else {
    loadImage(`${spriteDir}/${spr.name}`).then((img) => {
      sprites.set(spr.name.split(".")[0], img);
    });
  }
});

const seeds = [
  "beetroot_seeds",
  "carrot",
  "melon_seeds",
  "potato",
  "pumpkin_seeds",
  "wheat_seeds",
];

const seedsInfo = {
  wheat_seeds: {
    sprite: "wheat",
    time: 15 * 60 * 1000,
    harvest: { name: "wheat", min: 1, max: 1 },
  },
  pumpkin_seeds: {
    sprite: "pumpkin",
    time: 30 * 60 * 1000,
    harvest: { name: "pumpkin", min: 1, max: 1 },
  },
  melon_seeds: {
    sprite: "melon",
    time: 30 * 60 * 1000,
    harvest: { name: "melon", min: 1, max: 1 },
  },
  carrot: {
    sprite: "carrot",
    time: 15 * 60 * 1000,
    harvest: { name: "carrot", min: 2, max: 4 },
  },
  potato: {
    sprite: "potato",
    time: 15 * 60 * 1000,
    harvest: { name: "potato", min: 2, max: 4 },
  },
  beetroot_seeds: {
    sprite: "beetroot",
    time: 20 * 60 * 1000,
    harvest: { name: "beetroot", min: 2, max: 4 },
  }
};

module.exports = {
  chatInput: (interaction) => {
    const { client } = interaction;
    const { core } = client;
    return new Promise((resolve, reject) => {
      const subcommand = interaction.options.getSubcommand();

      if (subcommand === "status") {
        const member = interaction.options.getUser("member") ?? interaction.user;

        if (member.bot) {
          return core.utils.reply(interaction, { content: "봇은 농장을 가질 수 없어요.", ephemeral: true });
        }

        client.mongoose.model("Farm").findById(member?.id).then((res) => {
          return res ?? { slots: [] };
        }).then((farm) => {
          const value = !farm ? 0 : farm.slots.length;
          const canvas = createCanvas(200, 200);
          const { height, width } = canvas;
          const ctx = canvas.getContext("2d");

          const width_arr = [
              0, -22, 22, -42, 42, -22, 22, 0,
              0, -22, 22, -42, 42, -62, 62, -82, 82,
              -62, 62, -42, 42, -22, 22, 0],
            height_arr = [-21, -10, -10, 0, 0, 10, 10, 21,
              -42, -31, -31, -21, -21, -10, -10, 0, 0,
              10, 10, 21, 21, 31, 31, 41];

          const farmland = sprites.get("farmland");

          for (let i = 8; i < Math.min(16, value); i++) {
            ctx.drawImage(farmland, 75 + width_arr[i], 75 + height_arr[i], 50, 50);
            if (farm.slots[i].crop != "none") {
              const cropInfo = seedsInfo[farm.slots[i].crop];
              let per = Math.floor(Math.min((Date.now() - farm.slots[i].plantedAt) / cropInfo.time, 1) / 0.142);
              ctx.drawImage(sprites.get(`${cropInfo.sprite}${per}`), 75 + width_arr[i], 75 + height_arr[i] - 27, 50, 50);
            }
          }
          for (let i = 0; i < Math.min(3, value); i++) {
            ctx.drawImage(farmland, 75 + width_arr[i], 75 + height_arr[i], 50, 50);
            if (farm.slots[i].crop != "none") {
              const cropInfo = seedsInfo[farm.slots[i].crop];
              let per = Math.floor(Math.min((Date.now() - farm.slots[i].plantedAt) / cropInfo.time, 1) / 0.142);
              ctx.drawImage(sprites.get(`${cropInfo.sprite}${per}`), 75 + width_arr[i], 75 + height_arr[i] - 27, 50, 50);
            }
          }
          ctx.drawImage(sprites.get("water"), width / 2 - 25, height / 2 - 25, 50, 50);
          for (let i = 3; i < Math.min(8, value); i++) {
            ctx.drawImage(farmland, 75 + width_arr[i], 75 + height_arr[i], 50, 50);
            if (farm.slots[i].crop != "none") {
              const cropInfo = seedsInfo[farm.slots[i].crop];
              let per = Math.floor(Math.min((Date.now() - farm.slots[i].plantedAt) / cropInfo.time, 1) / 0.142);
              ctx.drawImage(sprites.get(`${cropInfo.sprite}${per}`), 75 + width_arr[i], 75 + height_arr[i] - 27, 50, 50);
            }
          }
          for (let i = 16; i < Math.min(24, value); i++) {
            ctx.drawImage(farmland, 75 + width_arr[i], 75 + height_arr[i], 50, 50);
            if (farm.slots[i].crop != "none") {
              const cropInfo = seedsInfo[farm.slots[i].crop];
              let per = Math.floor(Math.min((Date.now() - farm.slots[i].plantedAt) / cropInfo.time, 1) / 0.142);
              ctx.drawImage(sprites.get(`${cropInfo.sprite}${per}`), 75 + width_arr[i], 75 + height_arr[i] - 27, 50, 50);
            }
          }

          const cropText = farm.slots.filter((slot) => {
            return slot.crop != "none";
          }).reduce((acc, cur) => {
            if (!acc[0]) {
              acc.push({ crop: cur.crop, time: cur.plantedAt + seedsInfo[cur.crop].time, count: 1 });
            } else if (acc[acc.length - 1].crop != cur.crop) {
              acc.push({ crop: cur.crop, time: cur.plantedAt + seedsInfo[cur.crop].time, count: 1 });
            } else {
              const time = cur.plantedAt + seedsInfo[cur.crop].time;
              if (Math.abs(acc[acc.length - 1].time - time) < 1000) {
                acc[acc.length - 1].count++;
              } else {
                acc.push({ crop: cur.crop, time: time, count: 1 });
              }
            }
            return acc;
          }, []).map((slot) => {
            return `${slot.crop}(x${slot.count}) <t:${Math.floor(slot.time / 1000)}:R>`;
          }).join("\n");

          core.utils.reply(interaction, {
            embeds: [
              {
                title: `${member.username}님의 농장`,
                description: farm.slots[0] ? cropText : `가지고 있는 땅이 없어요.\n</farm expand:${client.application.commands.cache.find((c) => {
                  return c.name == "farm";
                }).id}>로 농장을 확장할 수 있어요.`,
                image: { url: "attachment://farm.png" },
                color: core.colors.blue
              }
            ],
            files: [{
              attachment: canvas.createPNGStream(),
              name: "farm.png"
            }]
          });
        }).catch(reject);
      } else if (subcommand === "expand") {
        client.mongoose.model("Farm").aggregate([
          {
            $match: {
              _id: interaction.user.id
            }
          },
          {
            $project: {
              _id: 0,
              landCount: {
                $size: "$slots"
              }
            }
          }
        ]).then(([res]) => {
          return res?.landCount ?? 0;
        }).then((landCount) => {
          const maxLandCount = 24;

          if (landCount >= maxLandCount) {
            return core.utils.reply(interaction, {
              content: "농장을 더 이상 확장할 수 없어요.",
              ephemeral: true
            });
          }

          core.addons.econDB.getUserWallet(interaction.user.id).then((wallet) => {
            const amount = Math.min(interaction.options.getInteger("amount") ?? 1, maxLandCount - landCount);
            const price = 100_000 * amount;

            if (wallet < price) {
              return core.utils.reply(interaction, {
                content: `${(price - wallet).toLocaleString()}원이 부족해요. (소지금: ${wallet.toLocaleString()} 원)`,
                ephemeral: true
              });
            }

            core.addons.econDB.subtractUserWallet(interaction.user.id, price).then(() => {
              client.mongoose.model("Farm").findByIdAndUpdate(interaction.user.id, {
                $push: {
                  slots: new Array(amount).fill({ crop: "none", plantedAt: 0 })
                }
              }, { upsert: true }).then(() => {
                core.utils.reply(interaction, {
                  content: `농장을 ${amount}번 확장했어요.`,
                  ephemeral: true
                });
              }).catch(reject);
            }).catch(reject);
          }).catch(reject);
        }).catch(reject);
      } else if (subcommand == "plant") {
        const crop = interaction.options.getString("crop");

        if (crop == "none") {
          return core.utils.reply(interaction, {
            content: "가지고 있는 씨앗이 없어요.",
            ephemeral: true
          });
        }

        if (!seeds.includes(crop)) {
          return core.utils.reply(interaction, {
            content: "씨앗이 아니에요.",
            ephemeral: true
          });
        }

        core.addons.econDB.getUserInventory(interaction.user.id, crop).then((hasCount) => {
          if (!hasCount) {
            return core.utils.reply(interaction, { content: `**${interaction.user.username}**님은 **${crop}**을 가지고 있지 않아요.`, ephemeral: true });
          }

          client.mongoose.model("Farm").findById(interaction.user.id).then((farm) => {
            const count = Math.min(interaction.options.getInteger("amount") ?? 1, hasCount);
            const plantedAt = Date.now();
            let plantedCount = 0;

            for (let i = 0; i < farm.slots.length; i++) {
              if (plantedCount == count) {
                break;
              }
              if (farm.slots[i].crop == "none") {
                farm.slots[i] = { crop: crop, plantedAt: plantedAt };
                plantedCount++;
              }
            }

            farm.save();

            const resultCount = hasCount - plantedCount;

            const filter = resultCount ? { "_id": interaction.user.id, "inventory.id": crop } : { _id: interaction.user.id };
            const data = resultCount ? { $set: { "inventory.$.count": resultCount } } : { $pull: { inventory: { id: crop } } };
            core.addons.econDB.setUser(filter, data).then(() => {
              core.utils.reply(interaction, { content: `**${crop}**을 **${plantedCount}**개 심었어요.`, ephemeral: true });
            }).catch(reject);
          });
        });
      } else if (subcommand === "harvest") {
        client.mongoose.model("Farm").findById(interaction.user.id).then((farm) => {
          if (!farm) {
            return core.utils.reply(interaction, { content: "가지고 있는 땅이 없어요.", ephemeral: true });
          }

          const harvests = {};

          for (let i = 0; i < farm.slots.length; i++) {
            const slot = farm.slots[i];
            if (slot.crop != "none") {
              const cropInfo = seedsInfo[slot.crop];
              if (Date.now() - slot.plantedAt >= cropInfo.time) {
                if (!harvests[cropInfo.harvest.name]) {
                  harvests[cropInfo.harvest.name] = 0;
                }
                harvests[cropInfo.harvest.name] += Math.floor(Math.random() * (cropInfo.harvest.max - cropInfo.harvest.min + 1)) + cropInfo.harvest.min;
                farm.slots[i] = { crop: "none", plantedAt: 0 };
              }
            }
          }

          const harvestCrops = Object.keys(harvests);

          harvestCrops.forEach((crop) => {
            core.addons.econDB.addUserInventory(interaction.user.id, crop, harvests[crop], true).then(() => { }).catch(reject);
          });

          if (harvestCrops.length > 0) {
            farm.save();
          }

          const cropText = farm.slots.filter((slot) => {
            return slot.crop != "none";
          }).reduce((acc, cur) => {
            if (!acc[0]) {
              acc.push({ crop: cur.crop, time: cur.plantedAt + seedsInfo[cur.crop].time, count: 1 });
            } else if (acc[acc.length - 1].crop != cur.crop) {
              acc.push({ crop: cur.crop, time: cur.plantedAt + seedsInfo[cur.crop].time, count: 1 });
            } else {
              const time = cur.plantedAt + seedsInfo[cur.crop].time;
              if (Math.abs(acc[acc.length - 1].time - time) < 1000) {
                acc[acc.length - 1].count++;
              } else {
                acc.push({ crop: cur.crop, time: time, count: 1 });
              }
            }
            return acc;
          }, []).map((slot) => {
            return `> ${slot.crop}(x${slot.count}) <t:${Math.floor(slot.time / 1000)}:R>`;
          }).join("\n");

          core.utils.reply(interaction, {
            content: `${harvestCrops.map((crop) => {
              return `**${crop}**: ${harvests[crop]}개`;
            }).join("\n") || "수확할 작물이 없어요."}\n${cropText}`, ephemeral: true
          });
        }).catch(reject);
      } else {
        core.utils.reply(interaction, { content: "soon:tm:", ephemeral: true });
      }
    });
  },
  autocomplete: (interaction) => {
    return new Promise((resolve, reject) => {
      const subcommand = interaction.options.getSubcommand();

      if (subcommand == "plant") {
        interaction.client.mongoose.model("User").aggregate([
          {
            $match: {
              _id: interaction.user.id
            }
          },
          {
            $project: {
              _id: 0,
              inventory: {
                $filter: {
                  input: "$inventory",
                  cond: {
                    $in: ["$$this.id", seeds]
                  }
                }
              }
            }
          }
        ]).then(([res]) => {
          return res?.inventory;
        }).then((existSeeds) => {
          if (!existSeeds) {
            return resolve([{ name: "가지고 있는 씨앗이 없어요.", value: "none" }]);
          }
          resolve(existSeeds.map((seed) => {
            return { name: `${seed.id} (${seed.count})`, value: seed.id };
          }));
        }).catch(reject);
      }
    });
  }
};
