// backend/server.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const planRoutes = require("./routes/planRoutes");
const goalRoutes = require("./routes/goalRoutes");
const {
  trackEmailView,
  sendPlanEmail,
} = require("./controllers/planController");
const app = express();

// DB 연결
connectDB();
const allowedOrigins = [
  "http://localhost:3000",
  "http://10.0.1.40:3000",
  "http://make2025.click",
  "http://www.make2025.click",
  "http://make2025.click.s3-website.ap-northeast-2.amazonaws.com",
  "http://www.make2025.click.s3-website.ap-northeast-2.amazonaws.com",
];
// 미들웨어
app.use(
  cors({
    origin: (origin, callback) => {
      // 요청 Origin이 허용된 Origin 리스트에 있으면 허용
      if (allowedOrigins.includes(origin) || !origin) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
app.use(express.json());

// 2) 메인 페이지 라우트 ("/") 추가
const path = require("path");

// 라우트
app.use("/api/auth", authRoutes);
app.use("/api/plan", planRoutes);
app.use("/api/goals", goalRoutes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
