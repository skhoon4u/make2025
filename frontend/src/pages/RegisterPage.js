// frontend/src/pages/RegisterPage.js

import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../styles/CommonStyles.css";
import "../styles/Register.css";

import emailIcon from "../assets/icons/email.svg";
import userIcon from "../assets/icons/user.svg";
import lockIcon from "../assets/icons/lock.svg";

const RegisterPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [focusedField, setFocusedField] = useState(null);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [showTermsPopup, setShowTermsPopup] = useState(false); // 약관 팝업 상태

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleFocus = (field) => {
    setFocusedField(field);
  };

  const handleBlur = () => {
    setFocusedField(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!termsAccepted) {
      alert("약관에 동의하셔야 합니다.");
      return;
    }
    localStorage.setItem("pendingRegistration", JSON.stringify(formData));
    navigate("/goals");
  };
  const openTermsPopup = () => {
    setShowTermsPopup(true);
  };
  const closeTermsPopup = () => {
    setShowTermsPopup(false);
    setTermsAccepted(true); // 약관 동의 완료
  };
  return (
    <div className="page-container">
      <h1 className="register-title">
        나만의 목표로<br></br>후회 없는
      </h1>
      {/* 로고 박스 */}
      <div className="image-box">
        <span className="placeholder-text">로고</span>
      </div>
      <form onSubmit={handleSubmit}>
        {/* 이름 입력 */}
        <div
          className={`input-container ${
            focusedField === "name" ? "focused" : ""
          }`}
        >
          <img src={userIcon} alt="User Icon" className="input-icon" />
          <input
            type="text"
            className="dynamic-input"
            placeholder="닉네임을 입력하세요"
            value={formData.name}
            onFocus={() => handleFocus("name")}
            onBlur={handleBlur}
            onChange={(e) => handleChange("name", e.target.value)}
          />
        </div>

        {/* 이메일 입력 */}
        <div
          className={`input-container ${
            focusedField === "email" ? "focused" : ""
          }`}
        >
          <img src={emailIcon} alt="Email Icon" className="input-icon" />
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
          <img src={lockIcon} alt="Lock Icon" className="input-icon" />
          <input
            type="text"
            className="dynamic-input"
            placeholder="비밀번호를 입력하세요"
            value={formData.password}
            onFocus={() => handleFocus("password")}
            onBlur={handleBlur}
            onChange={(e) => handleChange("password", e.target.value)}
          />
        </div>
        {/* 약관 동의 */}
        <div className="terms-section">
          <p>
            서비스 이용을 위해 아래의{" "}
            <span className="terms-link" onClick={openTermsPopup}>
              약관 동의
            </span>{" "}
            및 회원 가입이 필요해요.
            <br />
            수집된 정보는 계획 제공 외에는 다른 곳에 활용하지 않아요.
          </p>
          <div className="terms-checkbox">
            <label>
              개인정보 수집 및 이용 동의
              <input type="checkbox" checked={termsAccepted} readOnly />
            </label>
          </div>
        </div>

        {/* 회원가입 버튼 */}
        <button type="submit" className="form-button register-button">
          2025 만들기
        </button>
      </form>
      {/*
      <div className="existing-user-link">
        <p>
          이미 회원이라면?{" "}
          <Link to="/login" className="login-link">
            로그인
          </Link>
        </p>
      </div>*/}
      {/* 약관 팝업 */}
      {showTermsPopup && (
        <div className="terms-popup">
          <div className="terms-content">
            <button className="close-button" onClick={closeTermsPopup}>
              X
            </button>
            <h2>개인정보 수집 및 이용 동의</h2>
            <p>약관 내용이 여기에 들어갑니다...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default RegisterPage;
