import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../api/axiosInstance";
import PlanDisplay from "../components/PlanDisplay";
//import { capturePlanAsImage } from "../utils/captureImage";
import "../styles/CommonStyles.css";
import "../styles/Plan.css"; // 추가 스타일 파일
import leftQuoteIcon from "../assets/icons/left-quote.svg";
import rightQuoteIcon from "../assets/icons/right-quote.svg";
import backIcon from "../assets/icons/back.svg";
const KEYWORDS_EXPLANATION = {
  인내: "어려운 상황에서도 포기하지 않고 끝까지 노력하는 능력",
  자기관리: "자신을 잘 관리하고 조절하는 능력",
  도전정신: "어려운 일에 대해 도전하고 극복하는 능력",
  집중력: "주어진 일에 집중하고 끝까지 완수하는 능력",
  창의성: "새로운 아이디어나 방법을 찾아내는 능력",
  균형감각: "일과 생활의 균형을 유지하는 능력",
  열정: "뜨겁게 열정적으로 일하는 능력",
  기술: "특정 분야의 기술을 습득하고 응용하는 능력",
  소통: "상대방과 원활하게 의사소통하는 능력",
  재능: "특정 분야에서 뛰어난 능력을 가지고 있는 것",
};
const PlanPage = () => {
  const navigate = useNavigate();
  const [planData, setPlanData] = useState(null);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    const storedData = localStorage.getItem("planData");
    if (!storedData) {
      navigate("/goals");
      return;
    }

    const parsedPlan = JSON.parse(storedData);
    setPlanData(parsedPlan);

    axios
      .post("/plan/confirm", { plan: parsedPlan })
      .then((res) => {
        const updatedPlan = {
          ...parsedPlan,
          keywordExplanation: res.data.keywordExplanation, // 백엔드에서 받은 설명 추가
        };
        setPlanData(updatedPlan);
        localStorage.setItem("planData", JSON.stringify(updatedPlan)); // 로컬 스토리지에 저장
      })
      .catch((err) => console.error("초기 저장 실패:", err));
  }, [navigate]);

  const handleEditPlan = () => {
    setEditing(true);
  };

  const handleConfirmPlan = async () => {
    if (!planData) return;
    try {
      await axios.post("/plan/confirm", { plan: planData });
      setEditing(false);
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.msg || "계획 확정 실패");
    }
  };
  /*
  const handleCaptureImage = () => {
    const elementId = "plan-content";
    const fileName = `plan_${new Date().toISOString().slice(0, 10)}.png`;
    capturePlanAsImage(elementId, fileName);
  };
  */
  const handleSendEmail = async () => {
    if (!planData) return;
    try {
      await axios.post("/plan/send-email", {
        plan: planData,
        keywordExplanation,
      });
      navigate("/end");
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.msg || "이메일 전송 실패");
    }
  };

  const handleGoBack = () => {
    // 현재 계획 데이터를 로컬 스토리지에 저장하고 GoalPage로 이동
    localStorage.setItem("recentGoals", JSON.stringify(planData.goals));
    navigate("/goals");
  };

  if (!planData) {
    return (
      <div className="page-container">
        <p>로딩 중...</p>
      </div>
    );
  }
  const keywordExplanation =
    KEYWORDS_EXPLANATION[planData.matchedKeyword] || "설명이 없습니다.";
  return (
    <div id="plan-content" className="page-container">
      {/* 페이지 타이틀 */}
      <h1 className="page-title">
        {localStorage.getItem("userName")}의 2025년은
      </h1>
      {/* 키워드 */}
      <div className="key">
        <span className="quote-icon left-quote">
          <img src={leftQuoteIcon} alt="Left Quote" />
        </span>
        <span className="keyword">{planData.matchedKeyword}</span>
        <span className="quote-icon right-quote">
          <img src={rightQuoteIcon} alt="Right Quote" />
        </span>
      </div>
      {/* 사진 영역 */}
      <div className="photo-container">
        <img
          src="https://via.placeholder.com/150" // 예시 이미지
          alt="Placeholder"
          className="placeholder-image"
        />
      </div>

      {/* 나의 시크릿 레시피 */}
      <div className="secret-recipe">
        <p className="recipe-description">{keywordExplanation}</p>
      </div>

      {/* 계획 내용 */}
      <div className="plan-content">
        <p className="keywordex">
          키워드 예) 우여곡절 많아도 결구에는 해내는 해
        </p>
        <h2 className="plan-username">2025년 만드는 법</h2>
        <PlanDisplay
          planData={planData}
          editing={editing}
          onPlanChange={(field, index, value) => {
            const updatedPlan = { ...planData };
            if (field === "weeklyDetail") {
              updatedPlan.weeklyDetail[index] = value;
            } else if (field === "monthlyPlan") {
              updatedPlan.monthlyPlan[index].content = value;
            }
            setPlanData(updatedPlan);
          }}
        />
        <div className="plan-buttons">
          <button
            className="form-button half-button-l"
            onClick={editing ? handleConfirmPlan : handleEditPlan}
          >
            {editing ? "계획 확정하기" : "계획 수정하기"}
          </button>
          <button className="form-button half-button-r" onClick={handleGoBack}>
            목표 재설정
          </button>
        </div>
      </div>

      {/* 이미지로 저장 및 이메일로 받기 버튼 영역 (수정 중 숨기기) */}
      {!editing && (
        <div className="additional-buttons">
          {/*<button className="form-button" onClick={handleCaptureImage}>
            이미지로 저장
          </button>*/}
          <button className="email-button" onClick={handleSendEmail}>
            이메일로 받기
          </button>
        </div>
      )}
    </div>
  );
};

export default PlanPage;
