// backend/controllers/authController.js
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const nodemailer = require("nodemailer");

// -------------------------
// 회원가입 (name, email, password)
// -------------------------
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // 이메일 중복 체크
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ msg: "이미 가입된 이메일입니다." });
    }

    // [주의] 여기서는 평문 저장 (실무 비권장)
    //const salt = await bcrypt.genSalt(10);
    //const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      name,
      email,
      password, // 평문 저장 (주의)
    });
    await newUser.save();


    // JWT 토큰 생성
    const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    // 사용자 정보와 토큰 반환
    res.status(201).json({
      token,
      user: {
        email: newUser.email,
        name: newUser.name,
      },
      msg: "회원가입 성공",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "서버 에러" });
  }
};

// -------------------------
// 로그인
// -------------------------
// backend/controllers/authController.js

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 유저 확인
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ msg: "이메일 혹은 비밀번호가 올바르지 않습니다." });
    }

    // [주의] 평문 비교 (실무에서는 bcrypt.compare)
    if (user.password !== password) {
      return res
        .status(400)
        .json({ msg: "이메일 혹은 비밀번호가 올바르지 않습니다." });
    }

    // JWT 발급 (비밀키 일관성 유지)
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    return res.json({
      token,
      user: {
        email: user.email,
        name: user.name,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "서버 에러" });
  }
};
// -------------------------
// 비밀번호 찾기
// -------------------------
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    // 해당 이메일이 가입되어 있는지 확인
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ msg: "가입되지 않은 이메일입니다." });
    }

    // 가입되어 있다면, 저장된 비밀번호(평문)를 이메일로 전송
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER, // 예: [email protected]
        pass: process.env.EMAIL_PASS, // 앱 비밀번호
      },
    });

    const mailOptions = {
      from: `"2025만들기" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "비밀번호 찾기 안내",
      text: `가입된 비밀번호는 다음과 같습니다: ${user.password}`,
    };

    await transporter.sendMail(mailOptions);

    return res.json({ msg: "해당 이메일로 비밀번호를 전송했습니다." });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "비밀번호 전송 실패" });
  }
};
