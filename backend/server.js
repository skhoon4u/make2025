// backend/server.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const planRoutes = require("./routes/planRoutes");
const goalRoutes = require("./routes/goalRoutes");

const app = express();

// DB 연결
connectDB();

// 미들웨어
app.use(cors());
app.use(express.json());

// 2) 메인 페이지 라우트 ("/") 추가
const path = require("path");

// 라우트
app.use("/api/auth", authRoutes);
app.use("/api/plan", planRoutes);
app.use("/api/goals", goalRoutes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
