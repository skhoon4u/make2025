import React, { useState } from "react";
import axios from "../api/axiosInstance";
import "../styles/CommonStyles.css";
import "../styles/Register.css";
import emailIcon from "../assets/icons/email.svg";
import backIcon from "../assets/icons/back.svg";
import { useNavigate } from "react-router-dom";

const ForgotPasswordPage = () => {
  const [formData, setFormData] = useState({
    email: "",
  });
  const [focusedField, setFocusedField] = useState(null);
  const [successMessage, setSuccessMessage] = useState(""); // 메시지 상태 추가
  const handleChange = (field, value) => {
    console.log(`Field: ${field}, Value: ${value}`); // 디버깅
    setFormData({ ...formData, [field]: value });
  };

  const handleFocus = (field) => {
    setFocusedField(field);
  };

  const handleBlur = () => {
    setFocusedField(null);
  };

  const handleForgotPassword = async () => {
    try {
      const res = await axios.post("/auth/forgot-password", {
        email: formData.email,
      });
      setSuccessMessage("비밀번호를 메일로 발송했습니다"); // 성공 메시지 설정
    } catch (err) {
      setSuccessMessage(
        err.response?.data?.msg || "비밀번호 발송 중 문제가 발생했습니다"
      );
    }
  };

  const navigate = useNavigate();
  const handleGoBack = () => {
    navigate("/login");
  };

  return (
    <div className="page-container forgot">
      {/* 뒤로가기 버튼 */}
      <button className="back-button" onClick={handleGoBack}>
        <img src={backIcon} alt="뒤로가기" className="back-icon" />
      </button>
      <h1 className="forgot-title">비밀번호 찾기</h1>
      <p className="forgot-subtitle">
        가입시 입력한 이메일로 기존에 설정한 비밀번호를 보내드립니다
      </p>
      {/* 이메일 입력 */}
      <form className="forgot-form">
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

        <button
          type="button" // 버튼 타입 변경
          className="forgot-button"
          onClick={handleForgotPassword}
        >
          비밀번호 메일로 발송
        </button>
        <div className="forgot-footer">
          {/* 성공 메시지 */}
          {successMessage && (
            <div className="success-message">{successMessage}</div>
          )}
        </div>
      </form>
    </div>
  );
};

export default ForgotPasswordPage;
