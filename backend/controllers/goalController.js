const Goal = require("../models/Goal");

// 계정별 목표 저장
async function saveGoals(req, res) {
  try {
    const { userId } = req.user; // 로그인한 사용자 ID
    const { goals } = req.body;

    if (!goals || !Array.isArray(goals) || goals.length === 0) {
      return res.status(400).json({ msg: "유효한 목표 데이터가 없습니다." });
    }

    // 기존 데이터 삭제 후 업데이트
    await Goal.findOneAndUpdate(
      { userId },
      { goals, updatedAt: Date.now() },
      { upsert: true, new: true } // 없으면 생성
    );

    res.json({ msg: "목표가 성공적으로 저장되었습니다." });
  } catch (error) {
    console.error("목표 저장 에러:", error);
    res.status(500).json({ msg: "목표 저장 실패", error: error.message });
  }
}

// 계정별 목표 불러오기
async function getGoals(req, res) {
  try {
    const { userId } = req.user;

    const userGoals = await Goal.findOne({ userId });

    if (!userGoals) {
      return res.status(200).json({ goals: [] }); // 초기 데이터 반환
    }

    res.json({ goals: userGoals.goals });
  } catch (error) {
    console.error("목표 불러오기 에러:", error);
    res.status(500).json({ msg: "목표 불러오기 실패", error: error.message });
  }
}

module.exports = { saveGoals, getGoals };
