// backend/routes/authMiddleware.js
const jwt = require("jsonwebtoken");
require("dotenv").config(); // 환경 변수 로드

module.exports = (req, res, next) => {
  const token = req.header("x-auth-token");

  if (!token) {
    return res.status(401).json({ msg: "토큰이 없습니다." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // 환경 변수에서 JWT_SECRET 가져오기
    req.user = decoded;
    next();
  } catch (error) {
    console.error("토큰 검증 실패:", error.message); // 에러 로그 추가
    return res.status(401).json({ msg: "토큰이 유효하지 않습니다." });
  }
};
