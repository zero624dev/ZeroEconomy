const mongoose = require("mongoose");

module.exports = (userId, item, amount, upsert = false) => {
  return new Promise((resolve, reject) => {
    mongoose.model("User").findOneAndUpdate({"_id": userId, "inventory.id": item}, {
      $inc: {
        "inventory.$.count": amount
      }
    }).then((res) => {
      if (!res) {
        mongoose.model("User").findOneAndUpdate({_id: userId}, {
          $push: {
            inventory: {
              id: item,
              count: amount
            }
          }
        }, {upsert: upsert}).then(resolve).catch(reject);
      } else {
        resolve(res);
      }
    }).catch(reject);
  });
};
