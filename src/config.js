const mongoose = require("mongoose");

const connection = async () => {
  try {
    const connected = await mongoose.connect(
      "mongodb+srv://sharukhbabushaik:Sharukh%402004@cluster0.cg73tev.mongodb.net/Login-tut"
    );
    if (connected) {
      console.log("Dastabase connected Sucessfullly");
    } else {
      console.log("DB connected fail");
    }
  } catch (error) {
    console.log(error);
  }
};
module.exports = connection;
