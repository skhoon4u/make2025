import axios from "../api/axiosInstance";
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../styles/CommonStyles.css";
import "../styles/Register.css";

import emailIcon from "../assets/icons/email.svg";
import lockIcon from "../assets/icons/lock.svg";
import eyeIcon from "../assets/icons/eye.svg";
import eyeOffIcon from "../assets/icons/eye-off.svg";
import logo from "../assets/icons/logo.svg";

const LoginPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [focusedField, setFocusedField] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleFocus = (field) => {
    setFocusedField(field);
  };

  const handleBlur = () => {
    setFocusedField(null);
  };
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("/auth/login", formData);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("userEmail", res.data.user.email);
      localStorage.setItem("userName", res.data.user.name);

      navigate("/plan"); // 로그인 성공 시 바로 PlanPage로 이동
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.msg || "로그인 실패");
    }
  };

  return (
    <div className="register page-container forgot">
      <p className="login-subtitle"></p>
      {/* 로고 박스 */}
      <div className="login image-box">
        <object data={logo} alt="Logo" className="logo-image" />
      </div>
      <form onSubmit={handleSubmit}>
        {/* 이메일 입력 */}
        <div
          className={`input-container ${
            focusedField === "email" ? "focused" : ""
          }`}
        >
          <object data={emailIcon} alt="Email Icon" className="input-icon" />
          <input
            type="email"
            className="dynamic-input"
            placeholder="이메일을 입력하세요"
            value={formData.email}
            onFocus={() => handleFocus("email")}
            onBlur={handleBlur}
            onChange={(e) => handleChange("email", e.target.value)}
          />
        </div>

        {/* 비밀번호 입력 */}
        <div
          className={`input-container ${
            focusedField === "password" ? "focused" : ""
          }`}
        >
          <object data={lockIcon} alt="Lock Icon" className="input-icon" />
          <input
            type={showPassword ? "text" : "password"}
            className="dynamic-input"
            placeholder="비밀번호를 입력하세요"
            value={formData.password}
            onFocus={() => handleFocus("password")}
            onBlur={handleBlur}
            onChange={(e) => handleChange("password", e.target.value)}
          />
          <img
            src={showPassword ? eyeOffIcon : eyeIcon}
            alt="비밀번호 표시 토글"
            className="password-toggle-icon"
            onClick={togglePasswordVisibility}
          />
        </div>
        {/* 비밀번호 찾기 링크 */}
        <div className="existing-user-link">
          <p>
            비밀번호를 잊으셨나요?{" "}
            <Link to="/forgot-password" className="login-link">
              비밀번호 찾기
            </Link>
          </p>
        </div>
        {/* 로그인 버튼 */}
        <button type="submit" className="form-button register-button">
          로그인
        </button>
      </form>

      {/*<div className="existing-user-link">
        <p>
          아직 회원이 아니라면?{" "}
          <Link to="/" className="login-link">
            회원가입
          </Link>
        </p>
      </div>*/}
    </div>
  );
};

export default LoginPage;
