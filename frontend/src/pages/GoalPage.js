// frontend/src/pages/GoalPage.js

import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "../api/axiosInstance"; // Analytics API 호출을 위한 axios 인스턴스
import "../styles/CommonStyles.css";
import "../styles/Goal.css";
import LoadingPage from "../components/LoadingPage";

const GoalPage = () => {
  const navigate = useNavigate();
  const location = useLocation(); // React Router의 현재 위치 정보
  const [goals, setGoals] = useState(
    Array(5)
      .fill(null)
      .map(() => ({ goalTitle: "", targetMonth: "12" }))
  );
  const [focusedIndex, setFocusedIndex] = useState(null);
  const [loading, setLoading] = useState(false);

  // 데이터 로드
  useEffect(() => {
    const fetchGoals = async () => {
      try {
        const res = await axios.get("/api/goals/get");
        if (res.data.goals && res.data.goals.length > 0) {
          setGoals(res.data.goals);
        }
      } catch (err) {
        console.error("목표 데이터 로드 실패:", err);
      }
    };

    fetchGoals();
  }, [location]);

  const handleChange = (index, field, value) => {
    const newGoals = [...goals];
    newGoals[index][field] = value;
    setGoals(newGoals);
  };

  const handleSaveGoals = async () => {
    try {
      setLoading(true);
      const res = await axios.post("/plan/goals", { goals });
      const { matchedKeyword, monthlyPlan, weeklyDetail } = res.data;

      localStorage.setItem(
        "planData",
        JSON.stringify({
          matchedKeyword,
          monthlyPlan,
          weeklyDetail,
          goals,
        })
      );

      // PLAN_REQUEST 이벤트 기록

      setTimeout(() => {
        setLoading(false);
        navigate("/plan");
      }, 3000);
    } catch (err) {
      setLoading(false);
      console.error(err);
      alert(err.response?.data?.msg || "목표 저장 실패");
    }
  };

  if (loading) {
    return <LoadingPage />;
  }

  return (
    <div className="page-container goal-page">
      {/* 로고 박스 */}
      <div className="image-box">
        <span className="placeholder-text">로고</span>
      </div>
      <h2 className="page-subtitle">나의 목표를 입력하세요</h2>
      {goals.map((goal, index) => (
        <div
          key={index}
          className={`goal-item ${
            focusedIndex === index || goal.goalTitle !== "" ? "focused" : ""
          }`}
        >
          <div className="goal-header">
            <span className="goal-index">{index + 1}</span>
            <span className="goal-title">2025년 목표</span>
          </div>
          <input
            type="text"
            placeholder="내용을 입력하세요"
            value={goal.goalTitle}
            onFocus={() => setFocusedIndex(index)}
            onBlur={() => setFocusedIndex(null)}
            onChange={(e) => handleChange(index, "goalTitle", e.target.value)}
          />
          <div className="goal-footer">
            <select
              className="month-select"
              value={goal.targetMonth}
              onChange={(e) =>
                handleChange(index, "targetMonth", e.target.value)
              }
            >
              {[...Array(12).keys()].map((month) => (
                <option key={month + 1} value={month + 1}>
                  {month + 1}월
                </option>
              ))}
            </select>
            <span>까지</span>
          </div>
        </div>
      ))}
      <button className="form-button" onClick={handleSaveGoals}>
        입력 완료
      </button>
    </div>
  );
};

export default GoalPage;
