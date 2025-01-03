const express = require("express");
const router = express.Router();
const Goal = require("../models/Goal");
const authMiddleware = require("./authMiddleware");

// 최근 goals 데이터를 가져오는 API
router.get("/get", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.userId; // 인증된 사용자 ID
    const userGoals = await Goal.findOne({ userId }); // 사용자 ID로 최근 데이터 검색
    if (!userGoals) {
      return res.status(404).json({ msg: "저장된 목표가 없습니다." });
    }

    return res.json({ goals: userGoals.goals });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "서버 에러" });
  }
});

module.exports = router;
