// frontend/src/pages/TermsPage.js

import React from "react";
import { useNavigate } from "react-router-dom";
import axios from "../api/axiosInstance"; // Analytics API 호출을 위한 axios 인스턴스
import "../styles/CommonStyles.css";

const TermsPage = () => {
  const navigate = useNavigate();

  const handleAgree = async () => {
    try {
      // 로컬 스토리지에서 임시 회원가입 데이터 가져오기
      const pendingRegistration = JSON.parse(
        localStorage.getItem("pendingRegistration")
      );

      if (!pendingRegistration) {
        alert("회원가입 정보가 없습니다. 다시 시도해주세요.");
        navigate("/register"); // 회원가입 페이지로 이동
        return;
      }
      const { name, email, password } = pendingRegistration;

      // 자동 로그인 처리
      const res = await axios.post("/auth/register", { name, email, password });
      // 백엔드에서 JWT 토큰과 사용자 정보를 반환
      const { token, user } = res.data;
      localStorage.setItem("token", token);
      localStorage.setItem("userEmail", user.email);
      localStorage.setItem("userName", user.name);

      // 임시 회원가입 데이터 삭제
      localStorage.removeItem("pendingRegistration");

      alert("회원가입 및 로그인 성공");
      navigate("/goals"); // 목표 입력 페이지로 이동
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.msg || "회원가입 또는 로그인 실패");
      navigate("/register"); // 회원가입 페이지로 이동
    }
  };

  return (
    <div className="page-container">
      <h1 className="page-title">약관 동의</h1>
      <div
        style={{
          textAlign: "left",
          padding: "20px",
          backgroundColor: "#f9f9f9",
          borderRadius: "10px",
          marginBottom: "20px",
        }}
      >
        <h3>서비스 이용 약관</h3>
        <p>여기에 서비스 약관 내용을 추가하세요.</p>
        <p>
          사용자는 약관에 동의함으로써 서비스를 이용할 수 있습니다. 약관에
          동의하지 않으면 서비스를 이용할 수 없습니다.
        </p>
      </div>
      <button className="form-button" onClick={handleAgree}>
        동의합니다
      </button>
    </div>
  );
};

export default TermsPage;
