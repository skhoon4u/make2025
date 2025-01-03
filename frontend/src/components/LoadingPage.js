import React, { useState, useEffect } from "react";
import "../styles/Loading.css";

const LoadingPage = () => {
  const [activeDot, setActiveDot] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveDot((prev) => (prev + 1) % 3); // 0, 1, 2 순환
    }, 1000); // 1초마다 변경

    return () => clearInterval(interval); // 컴포넌트 언마운트 시 인터벌 정리
  }, []);

  return (
    <div className="loading-container">
      <div className="dots">
        <span className={`dot ${activeDot === 0 ? "active" : ""}`}></span>
        <span className={`dot ${activeDot === 1 ? "active" : ""}`}></span>
        <span className={`dot ${activeDot === 2 ? "active" : ""}`}></span>
      </div>
      <p className="loading-text">계획 생성중</p>
    </div>
  );
};

export default LoadingPage;
