import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/CommonStyles.css";
import "../styles/Main.css";

const MainPage = () => {
  const navigate = useNavigate();
  const [startButtonText, setStartButtonText] = useState("시작하기");
  const [view2025ButtonText, setView2025ButtonText] =
    useState("나의 2025 조회하기");

  const handleStart = () => {
    setStartButtonText("2025 만들기");
    setTimeout(() => {
      navigate("/register"); // 시작하기 버튼 클릭 시 회원가입 페이지로 이동
    }, 1000); // Optional delay to show the text change
  };

  const handleView2025 = () => {
    setView2025ButtonText("계획 수정하기");
    setTimeout(() => {
      navigate("/login"); // 나의 2025 조회하기 버튼 클릭 시 로그인 페이지로 이동
    }, 1000); // Optional delay to show the text change
  };

  return (
    <div className="page-container">
      <h2 className="page-subtitle">
        맞춤형 계획 생성으로
        <br />
        목표 달성을 도와드려요
      </h2>

      {/* 로고 박스 */}
      <div className="image-box">
        <span className="placeholder-text">로고</span>
      </div>

      {/* 캐릭터 박스 */}
      <div className="image-box">
        <span className="placeholder-text">캐릭터</span>
      </div>

      {/* 버튼 영역 */}
      <button className="first-button" onClick={handleStart}>
        {startButtonText}
      </button>
      <button className="secondary-button" onClick={handleView2025}>
        {view2025ButtonText}
      </button>
    </div>
  );
};

export default MainPage;
