import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/CommonStyles.css";
import "../styles/Main.css";
import logo from "../assets/icons/logo.svg";
import character from "../assets/icons/c.svg";
import ReactGA from "react-ga4"; // GA4 라이브러리 추가
const MainPage = () => {
  function setScreenSize() {
    let vh = window.innerHeight * 0.01;

    document.documentElement.style.setProperty("--vh", `${vh}px`);
  }

  setScreenSize();
  const navigate = useNavigate();
  const [startButtonText, setStartButtonText] = useState("시작하기");
  const [view2025ButtonText, setView2025ButtonText] =
    useState("나의 2025 조회하기");
  // GA4 페이지뷰 트래킹 추가
  useEffect(() => {
    ReactGA.send({ hitType: "pageview", page: "/main", title: "Main Page" });
  }, []);
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
        <object data={logo} alt="Logo" className="logo-image" />
      </div>

      {/* 캐릭터 박스 */}
      <div className="image-box">
        <object data={character} alt="Character" className="character-image" />
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
