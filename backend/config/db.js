// backend/config/db.js
require("dotenv").config(); // env 파일을 읽어오는 구문
const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    // .env에 설정된 문자열 사용
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB Atlas connected...");
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
