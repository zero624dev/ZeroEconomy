const mongoose = require("mongoose");

module.exports = (userId) => {
  return new Promise((resolve, reject) => {
    mongoose.model("User").aggregate([
      {
        $match: { _id: userId }
      },
      {
        $project: {
          _id: 0,
          wallet: "$wallet"
        }
      }
    ]).then(([res]) => {
      resolve(res?.wallet ?? 0);
    }).catch(reject);
  });
};

