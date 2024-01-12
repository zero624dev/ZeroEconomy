const mongoose = require("mongoose");

module.exports = (userId, item) => {
  return new Promise((resolve, reject) => {
    if (!item) {
      mongoose.model("User").aggregate([
        {
          $match: { _id: userId }
        },
        {
          $project: {
            _id: 0,
            inventory: "$inventory"
          }
        }
      ]).then(([res]) => {
        resolve(res?.inventory ?? []);
      }).catch(reject);
    } else {
      mongoose.model("User").aggregate([
        {
          $match: {
            _id: userId
          }
        },
        {
          $unwind: "$inventory"
        },
        {
          $match: {
            "inventory.id": item
          }
        },
        {
          $project: {
            _id: 0,
            count: "$inventory.count",
          }
        }
      ]).then(([res]) => {
        return resolve(res?.count ?? 0);
      }).catch(reject);
    }
  });
};
