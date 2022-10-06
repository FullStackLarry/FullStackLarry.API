const mongoose = require("mongoose");

exports.connect = () => {
  mongoose
    .connect(process.env.MONGODB_CONNECTION, {
      useNewUrlParser: true,
    })
    .then(() => {
      console.log("Database connection successful.");
    })
    .catch((error) => {
      console.log("Database connection failed.");
      console.error(error);
      process.exit(1);
    });
};
