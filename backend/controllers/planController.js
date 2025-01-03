// backend/controllers/planController.js
const dotenv = require("dotenv");
dotenv.config();

const OpenAI = require("openai").default;

const Goal = require("../models/Goal");
const User = require("../models/User");
const nodemailer = require("nodemailer");
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});
const axios = require("axios");
const GA_MEASUREMENT_ID = "G-5DG2B81VEP"; // 측정 ID
const GA_API_SECRET = "qpQz4NnMQIqHFQHRC6B3bQ";

// 임의로 지정한 키워드 10가지 (실제로는 DB에 저장하거나 config에서 가져올 수 있음)
const PREDEFINED_KEYWORDS = [
  "오늘 놀고, 내일은 더 잘 놀 계획!\n즐거움으로 가득 채우는 2025년!",
  "꿈을 실현하여 모두를\n부러워하게 만드는 2025년!",
  "계획만 보면 슈퍼히어로도\n울고 갈 완벽 추구의 2025년!",
  "한 해가 12개월로 부족해 보이는\n야망찬 도전의 2025년!",
  "하고 싶은 것도, 이뤄야 할 것도\n넘쳐흐르는 욕망 폭발 2025년",
  "하고 싶은 것보다 필요한 것을\n우선하는 실속있는 2025년!",
  "매일매일 조금씩,\n꾸준히 쌓아가는 인내의 2025년!",
  "과정은 고통이지만 결과는 감동!\n모든 걸 갈아넣는 열정의 2025년!",
  "몸도 마음도 지식도 꽉 채우는\n조화로운 2025년!",
  "바람처럼 자유롭게 흘러가는\n유연한 2025년!",
];

// -------------------------
// 모든 목표를 통합 → 단 하나의 카테고리
// -------------------------

async function classifyMultipleGoals(goals) {
  /*
    goals: [{ goalTitle, targetMonth }, ...]
    -> "이 모든 목표를 고려했을 때, 
        아래 10개 카테고리 중 
        어떤 하나에 가장 잘 맞는지?" 
        라고 GPT에게 요청
  */
  const joinedGoals = goals
    .map((g, i) => `${i + 1}. ${g.goalTitle} (달성: ${g.targetMonth}월)`)
    .join("\n");

  const systemMessage = `
    너는 텍스트 분류 전문가 AI이다.
    이제 여러 개의 목표가 주어질 것이다.
    아래 카테고리 목록 중 "하나"만 골라라:
    ${PREDEFINED_KEYWORDS.join(", ")}.

    출력 요구사항:
    1. 반드시 아래 목록 중 하나의 카테고리를 선택해야 한다.
    2. 카테고리 이름을 변경하거나 수정하지 말라.
    3. '\n'을 포함한 모든 문자는 그대로 유지해야 한다. '\n'를 제거하거나 대체하지 말라.
    4. 가능한 카테고리 외의 값은 절대로 출력하지 말라.

    카테고리를 정확히 선택하고 그대로 출력하라.
  `;

  const userMessage = `
    목표 목록:
    ${joinedGoals}

    가능한 카테고리:
    ${PREDEFINED_KEYWORDS.join(", ")}
    
    이 전체 목표를 하나로 묶어볼 때,
    가장 적절한 카테고리 '하나'만 골라서 출력해줘.
  `;

  // ChatCompletion
  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini", // 예시
    messages: [
      { role: "system", content: systemMessage },
      { role: "user", content: userMessage },
    ],
    temperature: 0.0,
    max_tokens: 50,
  });

  // 혹시 response가 undefined/null 일 수 있으니 안전 체크
  if (!response || !response.choices || response.choices.length === 0) {
    throw new Error("OpenAI 응답이 비정상입니다 (카테고리 분류).");
  }

  // 실제 분류 결과(문자열)
  const category = response.choices[0].message.content.trim();
  return category;
}

// -------------------------
// GPT로 월별/주별 계획 JSON 생성
// 예: planController.js (일부)

async function generatePlanWithGPT(goals, requestDate) {
  /*
    goals: [{ goalTitle, targetMonth }, ...]
    requestDate: 요청 날짜 (YYYY-MM-DD 형식)
  */

  const request = new Date(requestDate);
  const requestMonth = request.getMonth() + 1; // 현재 월
  const requestWeek = Math.ceil(request.getDate() / 7); // 요청 날짜의 주차 계산

  // 목표 목록 생성
  const goalDescriptions = goals
    .map((g, i) => `${i + 1}. "${g.goalTitle}" (달성: ${g.targetMonth}월)`)
    .join("\n");
  const maxMonth = Math.max(...goals.map((goal) => goal.targetMonth));
  // === System Message ===
  const systemMessage = `
    너는 일정 관리 전문 코치 AI이다.
    사용자의 목표 각각에 대해, 
    각 목표별로 주차별 계획(weeklyDetail)과 월별 계획(monthlyPlan)을 작성해라.

    요구사항:
    1. 주차별 계획:
       각 목표마다 4주 동안의 주차별 계획을 작성하라.
       예: "목표 1: 살 10kg 감량", "목표 2: 책 5권 읽기"라면,
       주차별로 각각의 목표에 대해 계획을 나눠서 작성해야 한다.
    2. 월별 계획:
       요청 달 이후의 월별 계획을 작성하라.
       각 목표의 설정된 "최대 달(${maxMonth}월)"까지 월별 계획을 작성하라.
       각 목표마다 월별 계획을 나눠 작성해야 한다.
    3. 계획 내용은 구체적이어야 하며, 최대한 현실적으로 사용할 수 있는 내용을 포함하라.
    4. JSON 형식으로 출력하라. 설명이나 부가 텍스트는 포함하지 말고, 
       아래 구조를 따른다.

    JSON 구조:
    {
      "weeklyDetail": {
        "1월 2주차": ["목표 1 관련 계획", "목표 2 관련 계획"],
        "1월 3주차": ["목표 1 관련 계획", "목표 2 관련 계획"],
        ...
      },
      "monthlyPlan": {
        "2월": ["목표 1 관련 계획", "목표 2 관련 계획"],
        ...
        "${maxMonth}월": ["목표 1 관련 계획", "목표 2 관련 계획"]
      }
    }
  `;

  // === User Message ===
  const userMessage = `
    목표 목록:
    ${goalDescriptions}

    요청 날짜: ${requestMonth}월 ${requestWeek}주차 기준
    각 목표별로 4주차까지 주차계획을, 그리고 최대 달(${maxMonth}월)까지 월별 계획을 작성해라.
  `;

  // ChatCompletion 요청
  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: systemMessage },
      { role: "user", content: userMessage },
    ],
    temperature: 0.7,
    max_tokens: 1000,
  });

  // 결과 파싱
  if (!response || !response.choices || response.choices.length === 0) {
    throw new Error("OpenAI 응답이 비정상입니다.");
  }

  const rawText = response.choices[0].message.content.trim();
  let parsed;
  try {
    parsed = JSON.parse(rawText);
  } catch (err) {
    console.error("JSON 파싱 실패:", rawText);
    parsed = { weeklyDetail: {}, monthlyPlan: {}, rawOutput: rawText };
  }

  return parsed;
}
// (A) 계정별 목표 저장 & GPT 통합
// -------------------------
async function saveGoals(req, res) {
  try {
    const { userId } = req.user; // 사용자 ID 확인
    const { goals } = req.body; // [{ goalTitle, targetMonth }, ...]
    const requestDate = new Date().toISOString().split("T")[0]; // 현재 날짜 (YYYY-MM-DD)

    // 목표 배열이 유효하지 않을 경우 에러 반환
    if (!goals || !Array.isArray(goals) || goals.length === 0) {
      return res.status(400).json({ msg: "목표 배열이 유효하지 않습니다." });
    }

    // 빈 목표 제거
    const validGoals = goals.filter((goal) => goal.goalTitle.trim() !== "");
    if (validGoals.length === 0) {
      return res.status(400).json({ msg: "유효한 목표가 없습니다." });
    }

    console.log("Saving goals for user:", userId);
    console.log("Goals data:", validGoals);

    // 사용자 목표 업데이트 또는 새로 생성
    const existingGoals = await Goal.findOneAndUpdate(
      { userId },
      { goals: validGoals, updatedAt: Date.now() },
      { upsert: true, new: true }
    );

    console.log("MongoDB 저장 결과:", existingGoals);

    // GPT로 "하나의 카테고리" 산출
    const matchedKeyword = await classifyMultipleGoals(validGoals);
    // 키워드 설명 가져오기
    // GPT로 월별/주별 계획 생성
    const maxMonth = Math.max(...validGoals.map((goal) => goal.targetMonth));
    const gptPlan = await generatePlanWithGPT(
      validGoals,
      new Date().toISOString().split("T")[0]
    );
    const { monthlyPlan = [], weeklyDetail = [] } = gptPlan;

    console.log("최종 응답:", {
      matchedKeyword,
      monthlyPlan,
      weeklyDetail,
    });

    // 결과 반환
    return res.json({
      msg: "목표 저장 & GPT 처리 완료",
      createdGoals: existingGoals.goals,
      matchedKeyword,
      monthlyPlan,
      weeklyDetail,
    });
  } catch (error) {
    console.error("서버 에러 발생:", error);
    return res.status(500).json({ msg: "서버 에러", error: error.message });
  }
}

// -------------------------
// (B) 최종 계획 확정
// -------------------------
async function confirmPlan(req, res) {
  try {
    const { userId } = req.user;
    const { plan } = req.body; // { goals, matchedKeyword, monthlyPlan, weeklyDetail, ... }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(401).json({ msg: "유효하지 않은 사용자" });
    }

    // user 스키마에 finalPlan 필드가 있다고 가정
    user.finalPlan = plan;
    await user.save();

    return res.json({ msg: "최종 계획 저장 완료", finalPlan: user.finalPlan });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "서버 에러", error: error.message });
  }
}

// -------------------------
// 추적 픽셀 라우트
// -------------------------
/*
const trackEmailView = async (req, res) => {
  try {
    const { userId } = req.query;

    // 구글 애널리틱스에 이벤트 전송
    const payload = {
      client_id: userId || "anonymous", // 익명 사용자 또는 실제 사용자 ID
      events: [
        {
          name: "email_open",
          params: {
            user_id: userId || "anonymous",
            timestamp: new Date().toISOString(),
          },
        },
      ],
    };
    await axios.post(
      `https://www.google-analytics.com/mp/collect?measurement_id=${GA_MEASUREMENT_ID}&api_secret=${GA_API_SECRET}`,
      payload
    );

    // 서버 로그 기록
    console.log(
      `Email viewed by user: ${userId} at ${new Date().toISOString()}`
    );

    // 투명 1x1 픽셀 이미지 반환
    const pixelBuffer = Buffer.from(
      "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/wcAAgEBgHtIOq0AAAAASUVORK5CYII=",
      "base64"
    );
    res.writeHead(200, {
      "Content-Type": "image/png",
      "Content-Length": pixelBuffer.length,
    });
    res.end(pixelBuffer);
  } catch (error) {
    console.error("Error tracking email view:", error);
    res.status(500).send("Error tracking email view.");
  }
};
*/
// Helper function: Generate HTML Email Content
function generateEmailHTML(planData, userName) {
  return `
    <!DOCTYPE html>
    <html lang="ko">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>2025 만들기 계획</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          background-color: #f9f9f9;
          color: #333;
          margin: 0;
          padding: 0;
        }
        .container {
          max-width: 600px;
          margin: 20px auto;
          background-color: #ffffff;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        .header {
          background-color: #4f8f8d;
          padding: 20px;
          text-align: center;
          color: #ffffff;
        }
        .header h1 {
          margin: 0;
          font-size: 24px;
        }
        .content {
          padding: 20px;
        }
        .secret-recipe {
          margin: 20px 0;
          text-align: center;
          position: relative;
          padding: 20px;
          background-color: #edaa8e;
          border-radius: 15px;
          color: #ffffff;
        }
        .secret-recipe img {
          width: 20px;
          height: 20px;
          position: absolute;
          top: 10px;
        }
        .secret-recipe .keyword {
          font-size: 28px;
          font-weight: bold;
          display: block;
          margin-top: 10px;
        }
        .photo-container {
          text-align: center;
          margin: 20px 0;
        }
        .keyword-explanation {
          font-size: 16px;
          color: #4f8f8d;
          margin-top: 10px;
          text-align: center;
        }
        .plan-section {
          margin-bottom: 20px;
        }
        .plan-title {
          font-size: 20px;
          font-weight: bold;
          margin-bottom: 10px;
          color: #4f8f8d;
        }
        .plan-item-container {
          margin-bottom: 15px;
        }
        .plan-item-box {
          font-weight: bold;
          background-color: #e3e8e2;
          border-radius: 5px;
          padding: 10px;
          text-align: center;
          margin-bottom: 5px;
        }
        .plan-item-content {
          background-color: #f5f5f5;
          padding: 10px;
          border-radius: 5px;
          margin-bottom: 5px;
          font-size: 14px;
        }
        .button-container {
          text-align: center;
          margin: 20px 0;
        }
        .button {
          display: inline-block;
          padding: 10px 20px;
          color: #ffffff;
          background-color: #4caf50;
          text-decoration: none;
          border-radius: 4px;
          margin: 5px;
          font-size: 16px;
        }
        .button:hover {
          background-color: #45a049;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <!-- 헤더 -->
        <div class="header">
          <h1>${userName}의 2025 만들기</h1>
        </div>
        
        <!-- 컨텐츠 -->
        <div class="content">
          <!-- 시크릿 레시피 -->
          <div class="secret-recipe">
            <span class="keyword">${planData.matchedKeyword}</span>
          </div>

          <!-- 주차별 계획 -->
          <div class="plan-section">
            <div class="plan-title">주차별 계획</div>
            ${Object.entries(planData.weeklyDetail || {})
              .map(
                ([week, plans], idx) => `
              <div class="plan-item-container">
                <div class="plan-item-box">${week}</div>
                ${plans
                  .map(
                    (plan) => `
                  <div class="plan-item-content">${plan}</div>
                `
                  )
                  .join("")}
              </div>
            `
              )
              .join("")}
          </div>

          <!-- 월별 계획 -->
          <div class="plan-section">
            <div class="plan-title">월별 계획</div>
            ${Object.entries(planData.monthlyPlan || {})
              .map(
                ([month, plans], idx) => `
              <div class="plan-item-container">
                <div class="plan-item-box">${month}</div>
                ${plans
                  .map(
                    (plan) => `
                  <div class="plan-item-content">${plan}</div>
                `
                  )
                  .join("")}
              </div>
            `
              )
              .join("")}
          </div>
        </div>

        <!-- 버튼 -->
        <div class="button-container">
          <a href="www.make2025.click/login" class="button">계획 수정하기</a>
        </div>
      </div>
    </body>
    </html>
  `;
}
// -------------------------
// (C) 계획 이메일 전송
// -------------------------
async function sendPlanEmail(req, res) {
  try {
    const { userId } = req.user;
    const { plan } = req.body; // { matchedKeyword, monthlyPlan, weeklyDetail, ... }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(401).json({ msg: "유효하지 않은 사용자" });
    }
    const pixelUrl = `ec2-54-85-202-170.compute-1.amazonaws.com/track-email?userId=${userId}`;
    const htmlContent = generateEmailHTML(plan, user.name);

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"2025만들기" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: "[2025만들기] 최종 계획 안내",
      html: htmlContent, // HTML 이메일 본문
    };

    await transporter.sendMail(mailOptions);
    return res.json({ msg: "이메일 전송 완료" });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ msg: "이메일 전송 실패", error: error.message });
  }
}

// -------------------------
// 모듈 export
// -------------------------
module.exports = {
  /*trackEmailView,*/
  saveGoals,
  confirmPlan,
  sendPlanEmail,
};
