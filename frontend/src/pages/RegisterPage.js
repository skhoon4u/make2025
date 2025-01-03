// frontend/src/pages/RegisterPage.js

import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../styles/CommonStyles.css";
import "../styles/Register.css";
import axios from "../api/axiosInstance";

import emailIcon from "../assets/icons/email.svg";
import userIcon from "../assets/icons/user.svg";
import lockIcon from "../assets/icons/lock.svg";
import logo from "../assets/icons/logo.svg";
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!termsAccepted) {
      alert("약관에 동의하셔야 합니다.");
      return;
    }

    try {
      const res = await axios.post("/auth/register", formData);

      // 서버에서 받은 토큰 저장
      const { token, user } = res.data;
      localStorage.setItem("token", token);
      localStorage.setItem("userEmail", user.email);
      localStorage.setItem("userName", user.name);

      // Axios 기본 헤더에 토큰 설정
      axios.defaults.headers.common["x-auth-token"] = token;

      // 목표 입력 페이지로 이동
      navigate("/goals");
    } catch (err) {
      console.error("회원가입 오류:", err);
      alert(err.response?.data?.msg || "회원가입 실패");
    }
  };

  const openTermsPopup = () => {
    setShowTermsPopup(true);
  };
  const closeTermsPopup = () => {
    setShowTermsPopup(false);
    setTermsAccepted(true); // 약관 동의 완료
  };
  return (
    <div className="register page-container">
      <p className="login-subtitle"></p>
      {/* 로고 박스 */}
      <div className="image-box">
        <object data={logo} alt="Logo" className="logo-image" />
      </div>
      <form onSubmit={handleSubmit}>
        {/* 이름 입력 */}
        <div
          className={`input-container ${
            focusedField === "name" ? "focused" : ""
          }`}
        >
          <object data={userIcon} alt="User Icon" className="input-icon" />
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
              <input
                type="checkbox"
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)} // 체크 상태 업데이트
              />
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
            <h2 className="terms-title">개인정보의 수집 및 이용</h2>
            <p className="terms-intro">
              &lt;2025만들기&gt; 서비스 이용과 관련하여 본인의 개인정보를
              수집·이용하고자 하는 경우에는 「개인정보 보호법」 제15조, 제17조
              등에 따라 본인의 동의를 얻어야 합니다. 이에 아래의 내용을 같이 개
              개인정보를 수집·이용하는 것에 동의가 필요합니다.
            </p>

            <div className="terms-section">
              <h3 className="terms-subtitle">1. 수집·이용에 관한 사항</h3>
              <table className="terms-table">
                <tbody>
                  <tr>
                    <th>수집·이용목적</th>
                    <td>
                      - 회원정보 관리
                      <br />
                      - 메일 발송 기능
                      <br />- 부정이용방지
                    </td>
                  </tr>
                  <tr>
                    <th>수집·이용기간</th>
                    <td>
                      서비스 가입 후 1년까지 보유되며, 이후에는 즉시 파기됩니다.
                    </td>
                  </tr>
                  <tr>
                    <th>
                      동의 거부권리<br></br>및<br></br> 거부 시 불이익
                    </th>
                    <td>
                      개인정보 수집·이용에 관한 동의는 &lt;2025 만들기&gt;
                      서비스 이용을 위한 필수적 사항이므로, 위 사항에
                      동의하셔야만 서비스 이용이 가능합니다.
                    </td>
                  </tr>
                  <tr>
                    <th>수집·이용항목</th>
                    <td>
                      일반 개인정보:
                      <br />
                      &nbsp;&nbsp;- 닉네임
                      <br />
                      &nbsp;&nbsp;- 이메일 주소
                      <br />
                      &nbsp;&nbsp;- 비밀번호
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="terms-footer">
              귀하는 본 개인정보 수집 및 이용에 동의하지 않을 권리가 있으며, 미
              동의 시, 회원가입 및 서비스 이용이 제한됩니다.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default RegisterPage;
