import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/CommonStyles.css"; // 공통 스타일 적용

const SelectGoalPage = () => {
  const navigate = useNavigate();

  const handleNewGoal = () => {
    navigate("/goals");
  };

  const handleOldGoal = () => {
    navigate("/plan");
  };

  return (
    <div className="page-container">
      <h1 className="page-title">무엇을 하시겠습니까?</h1>
      <button className="form-button" onClick={handleNewGoal}>
        새로 목표 설정하기
      </button>
      <button className="form-button" onClick={handleOldGoal}>
        기존 목표 확인하기
      </button>
    </div>
  );
};

export default SelectGoalPage;
