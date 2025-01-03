// backend/routes/aiRoutes.js
const express = require("express");
const router = express.Router();
const { classifyGoals, generatePlan } = require("../controllers/aiController");

// 1) 목표 -> 10개 키워드 분류
router.post("/classify-goals", classifyGoals);

// 2) 목표 + 달성 Month -> 월별/주별 계획 생성
router.post("/generate-plan", generatePlan);

module.exports = router;
