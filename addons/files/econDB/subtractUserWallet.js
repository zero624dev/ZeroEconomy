const mongoose = require("mongoose");

module.exports = (userId, amount, upsert) => {
  return new Promise((resolve, reject) => {
    mongoose.model("User").updateOne({_id: userId}, {$inc: {wallet: -amount}}, {upsert: upsert}).then(resolve).catch(reject);
  });
};
