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
import logo from "../assets/icons/logo.svg";

const KEYWORDS_EXPLANATION = {
  "오늘 놀고, 내일은 더 잘 놀 계획!\n즐거움으로 가득 채우는 2025년!":
    "2025년은 즐거움과 여유를 중요시하는 해입니다. 일을 하면서도 여가와 즐거움을 잃지 않고, 더 나은 삶의 질을 추구하는 목표입니다. 즐거운 활동을 통해 재충전하며, 에너지를 얻어 다시 목표를 향해 나아가세요. 즐거운 한 해가 되기를 기원합니다!",
  "꿈을 실현하여 모두를\n부러워하게 만드는 2025년!":
    "당신의 목표는 큰 꿈을 실현하여 다른 사람들에게 감동과 부러움을 주는 것입니다. 꿈을 이루는 과정에서 많은 도전이 있겠지만, 그 과정에서 자신감과 성취감을 얻을 수 있을 것입니다. 꾸준히 꿈을 향해 나아가며 목표를 이루는 당신을 응원합니다!",
  "계획만 보면 슈퍼히어로도\n울고 갈 완벽 추구의 2025년!":
    "당신은 목표를 실현하기 위해 치밀하고 완벽하게 준비하고 있습니다. 당신이 설정한 계획을 보면 목표를 향한 집념과 전략이 돋보입니다. 이처럼 체계적인 준비가 빛을 발할 수 있도록 조금씩 완벽을 추구하며 나아가세요. 매일 조금씩 목표를 이뤄가는 과정이 결국 큰 성과로 이어질 것입니다. 완벽을 향한 당신의 도전에 큰 응원을 보냅니다!",
  "한 해가 12개월로 부족해 보이는\n야망찬 도전의 2025년!":
    "당신의 목표는 정말 방대하고 야망이 큽니다. 한 해가 짧게 느껴지겠지만, 그만큼 많은 일을 해내기 위한 준비가 필요합니다. 다만, 목표를 작은 단위로 나누어 실현 가능한 계획을 세우고, 체계적으로 진행해 나가면 분명한 성과를 얻을 수 있을 것입니다. 당신의 도전 정신에 큰 응원을 보냅니다!",
  "하고 싶은 것도, 이뤄야 할 \n넘쳐흐르는 욕망 폭발 2025년":
    "당신은 할 일이 너무 많고, 하고 싶은 것도 너무 많습니다. 여러 가지 목표를 동시에 추구하는 당신은 늘 바쁘겠지만, 그만큼 새로운 도전이 기다리고 있겠죠. 그러나 여러 목표를 효율적으로 이루기 위해선 우선순위를 정하고, 하나씩 성취해나가는 것이 중요합니다. 충만한 욕망을 현실로 만드는 그 여정을 응원합니다!",
  "하고 싶은 것보다 필요한 것을\n우선하는 실속있는 2025년!":
    "당신은 '필요한 것'에 초점을 맞추고, 실속 있는 목표를 세우고 있습니다. 당장의 욕구보다는 장기적으로 중요한 것들을 우선시하여 목표를 달성하는 모습이 인상적입니다. 필요한 목표를 하나씩 이루어가며, 실속 있는 성과를 거두게 될 것입니다. 효율적인 목표 설정을 응원합니다!",
  "매일매일 조금씩,\n꾸준히 쌓아가는 인내의 2025년!":
    "당신은 인내와 꾸준함을 통해 목표를 이루겠다고 다짐하고 있습니다. 하루하루 쌓아가는 작은 성취들이 결국 큰 성과를 이루게 됩니다. 당장의 결과가 보이지 않아도 지속적인 노력은 반드시 결실을 맺습니다. 오늘 하루도 목표를 향해 조금씩 나아가세요. 당신의 꾸준함을 응원합니다!",
  "과정은 고통이지만 결과는 감동!\n모든 걸 갈아넣는 열정의 2025년!":
    "고통스러운 과정 속에서도 그 결과에 대한 강한 믿음을 가지고 있습니다. 당신의 열정이 결국 감동적인 결과로 이어질 것입니다. 힘든 순간이 오더라도, 그 모든 것이 더 큰 보람으로 돌아올 것입니다. 끝까지 포기하지 않고 나아가는 당신을 응원합니다!",
  "몸도 마음도 지식도 꽉 채우는\n조화로운 2025년!":
    "당신은 몸과 마음, 지식 모두를 균형 있게 채워가기를 원합니다. 건강한 신체와 정신, 그리고 성장하는 지식이 하나로 어우러져 당신을 더욱 성장시킬 것입니다. 이런 조화로운 목표를 이루려면 모든 영역에서 균형을 잡는 것이 중요합니다. 각 부분에 힘을 쏟고, 그 균형을 유지하는 힘이 당신을 완성시킬 것입니다. 이 멋진 목표에 깊은 응원의 메시지를 보냅니다!",
  "바람처럼 자유롭게 흘러가는\n유연한 2025년!":
    "당신은 규칙에 얽매이지 않고, 자유롭고 유연하게 삶을 살아가기를 원합니다. 유연한 태도로 변화하는 환경에 적응하며 살아가면, 예상치 못한 기회가 찾아올 것입니다. 자유롭게 흘러가는 대로 살아가며 성취감을 느끼세요. 당신의 유연한 목표를 응원합니다!",
};
const keywordImageMap = {
  "오늘 놀고, 내일은 더 잘 놀 계획!\n즐거움으로 가득 채우는 2025년!":
    "/assets/keywords/1.svg",
  "꿈을 실현하여 모두를\n부러워하게 만드는 2025년!": "/assets/keywords/2.svg",
  "계획만 보면 슈퍼히어로도\n울고 갈 완벽 추구의 2025년!":
    "/assets/keywords/3.svg",
  "한 해가 12개월로 부족해 보이는\n야망찬 도전의 2025년!":
    "/assets/keywords/4.svg",
  "하고 싶은 것도, 이뤄야 할 \n넘쳐흐르는 욕망 폭발 2025년":
    "/assets/keywords/5.svg",
  "하고 싶은 것보다 필요한 것을\n우선하는 실속있는 2025년!":
    "/assets/keywords/6.svg",
  "매일매일 조금씩,\n꾸준히 쌓아가는 인내의 2025년!": "/assets/keywords/7.svg",
  "과정은 고통이지만 결과는 감동!\n모든 걸 갈아넣는 열정의 2025년!":
    "/assets/keywords/8.svg",
  "몸도 마음도 지식도 꽉 채우는\n조화로운 2025년!": "/assets/keywords/9.svg",
  "바람처럼 자유롭게 흘러가는\n유연한 2025년!": "/assets/keywords/10.svg",
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
  const keywordWithLineBreaks = planData.matchedKeyword
    .split("\n")
    .map((line, index) => (
      <React.Fragment key={index}>
        {line}
        <br />
      </React.Fragment>
    ));
  const keywordExplanation =
    KEYWORDS_EXPLANATION[planData.matchedKeyword] || "설명이 없습니다.";
  const selectedImage = keywordImageMap[planData.matchedKeyword];
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
        <span className="keyword">{keywordWithLineBreaks}</span>
        <span className="quote-icon right-quote">
          <img src={rightQuoteIcon} alt="Right Quote" />
        </span>
      </div>
      {/* 사진 영역 */}
      <div className="photo-container">
        <object
          data={selectedImage}
          alt="Keyword"
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
