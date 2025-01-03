// backend/routes/planRoutes.js
const express = require("express");
const router = express.Router();
const authMiddleware = require("./authMiddleware");

const {
  saveGoals,
  sendPlanEmail,
  confirmPlan,
} = require("../controllers/planController");

// 목표 저장
router.post("/goals", authMiddleware, saveGoals);

// 최종 계획 이메일 전송 (로그인된 계정으로)
router.post("/send-email", authMiddleware, sendPlanEmail);

// 최종 확정 -> DB 저장
router.post("/confirm", authMiddleware, confirmPlan);

module.exports = router;
