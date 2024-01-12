const mongoose = require("mongoose");

module.exports = (filter, data, upsert = false) => {
  return new Promise((resolve, reject) => {
    if (typeof filter == "string") {
      filter = { _id: filter };
    }
    mongoose.model("User").updateOne(filter, data, { upsert: upsert }).then(resolve).catch(reject);
  });
};
