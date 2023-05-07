const mongoose = require("mongoose");

const RunDB = async () => {
  return await mongoose
    .connect(process.env.ATLSCONNECTION)
    .then((result) => {
      console.log(`DB Connction Work`);
    })
    .catch((err) => {
      console.log(`Connection error ${err}`);
    });
};

module.exports = RunDB;
