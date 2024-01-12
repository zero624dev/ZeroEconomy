const mongoose = require("mongoose");

module.exports = (userId, item, count) => {
  return new Promise((resolve, reject) => {
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
          count: "$inventory.count"
        }
      }
    ]).then(async([ res ]) => {
      if (!res?.count) {
        return resolve(0);
      }

      const resultCount = Math.max(res.count - count, 0);

      if (resultCount == 0) {
        mongoose.model("User").findOneAndUpdate({_id: userId}, {
          $pull: {
            inventory: {
              id: item
            }
          }
        }).then(resolve(res.count)).catch(reject);
      } else {
        mongoose.model("User").findOneAndUpdate({"_id": userId, "inventory.id": item}, {
          $set: {
            "inventory.$.count": resultCount
          }
        }).then(resolve(count)).catch(reject);
      }
    }).catch(reject);
  });
};
