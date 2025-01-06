import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/CommonStyles.css";
import "../styles/Main.css";
import logo from "../assets/icons/logo.svg";
import character from "../assets/icons/c.svg";

const EndPage = () => {
  const navigate = useNavigate();
  const [view2025ButtonText, setView2025ButtonText] =
    useState("시작화면 돌아가기");

  const handleView2025 = () => {
    setView2025ButtonText("시작화면 돌아가기");
    setTimeout(() => {
      navigate("/"); // 나의 2025 조회하기 버튼 클릭 시 로그인 페이지로 이동
    }, 1000); // Optional delay to show the text change
  };

  return (
    <div className="page-container">
      <h2 className="end-subtitle">메일 발송 완료!</h2>

      {/* 로고 박스 */}
      <div className="image-box end">
        <object data={logo} alt="Logo" className="logo-image" />
      </div>

      {/* 캐릭터 박스 */}
      <div className="image-box end">
        <object data={character} alt="Character" className="character-image" />
      </div>

      {/* 버튼 영역 */}
      <button className="end-button" onClick={handleView2025}>
        {view2025ButtonText}
      </button>
    </div>
  );
};

export default EndPage;
