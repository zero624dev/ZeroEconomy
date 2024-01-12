const mongoose = require("mongoose");

module.exports = (userId, data) => {
  return new Promise((resolve, reject) => {
    if (data) {
      mongoose.model("User").aggregate([
        {
          $match: { _id: userId }
        },
        {
          $project: {
            _id: 0,
            data: `$${data}`
          }
        }
      ]).then(([res]) => {
        resolve(res?.data);
      }).catch(reject);
    } else {
      mongoose.model("User").findById({ _id: userId }).then(resolve).catch(reject);
    }
  });
};
