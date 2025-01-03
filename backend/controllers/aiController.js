// backend/controllers/aiController.js
require("dotenv").config();
const { Configuration, OpenAIApi } = require("openai");

// 10개 키워드 목록(예시)
const PREDEFINED_KEYWORDS = [
  "인내 Patience",
  "자기관리 Self-care",
  "도전 정신 a spirit of challenge",
  "집중력 concentration",
  "창의성  Creativity",
  "균형감각 a sense of balance",
  "열정 Passion",
  "기술  Technology",
  "소통 Communication",
  "재능 one's talent",
];

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

/**
 * 1) 목표 -> 10개 키워드 중 가장 적절한 것 분류
 *    - Zero-shot Classification 방식
 */
exports.classifyGoals = async (req, res) => {
  try {
    // 사용자가 입력한 목표 예시: [{ goalTitle: "...", targetMonth: ... }, ...]
    const { goals } = req.body;
    if (!goals || !Array.isArray(goals) || goals.length === 0) {
      return res.status(400).json({ msg: "유효한 goals 배열이 필요합니다." });
    }

    // GPT에게 분류를 요청할 prompt 생성
    // 각 goalTitle 마다 10개 키워드 중 어떤 게 가장 연관성이 높은지 판단
    const systemMessage = `
      너는 텍스트 분류 전문가 AI이다.
      사용자 목표 문장이 주어지면,
      아래 카테고리 목록 중 하나를 선택해라:
      ${PREDEFINED_KEYWORDS.join(", ")}.
      가능한 가장 관련성이 높은 카테고리를 하나만 골라야 한다.
    `;

    // goalTitle 별로 GPT에게 질의
    const classificationResults = [];
    for (const g of goals) {
      const userMessage = `
        목표 문장: "${g.goalTitle}"
        위 목표는 어떤 카테고리에 가장 어울리는가?
        카테고리 목록: ${PREDEFINED_KEYWORDS.join(", ")}.
        카테고리 이름만 정확히 출력해 줘.
      `;

      // ChatCompletion API 호출
      const response = await openai.createChatCompletion({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: systemMessage },
          { role: "user", content: userMessage },
        ],
        temperature: 0.0, // 분류는 창의성보다 정확성이 중요하므로 낮게
        max_tokens: 50,
      });

      const chosenCategory = response.data.choices[0].message.content.trim();

      classificationResults.push({
        goalTitle: g.goalTitle,
        matchedKeyword: chosenCategory,
      });
    }

    res.json({
      msg: "목표 분류 완료",
      classificationResults,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "AI 분류 중 오류 발생", error: error.message });
  }
};

/**
 * 2) 목표 + 달성 Month -> 월별/주별 계획 생성
 *    - GPT를 이용해 Text Generation (JSON 형식 등으로 정형화)
 */
exports.generatePlan = async (req, res) => {
  try {
    const { goals } = req.body;
    /*
      goals: [
        { goalTitle: "살 5kg 빼기", targetMonth: 6 },
        { goalTitle: "책 10권 읽기", targetMonth: 3 }
      ]
      이런 식으로 들어온다고 가정.
    */

    if (!goals || !Array.isArray(goals) || goals.length === 0) {
      return res.status(400).json({ msg: "유효한 goals 배열이 필요합니다." });
    }

    // 시스템 메시지 예시 (역할: 일정/목표 코치)
    const systemMessage = `
      너는 일정 관리 전문 코치 AI이다.
      사용자 목표(최대 5개)와 각 목표 달성 월을 보고,
      각 월에 무엇을 해야 할지, 그리고 1월은 주별로 상세 계획을 제시한다.
      다만, JSON 형식으로 출력해라.
    `;

    // 사용자 메시지에서 goals를 예시로 넣어줌
    // "최대 N월까지 계획"을 적절히 병합해서 작성하도록 지시
    // 1월 주별 (1~4주)
    const userMessage = `
      사용자 목표 목록:
      ${goals
        .map((g, i) => `${i + 1}. "${g.goalTitle}" (달성: ${g.targetMonth}월)`)
        .join("\n")}

      [지시사항]
      1) 월별 계획: {month: number, content: string} 배열 형태
      2) 1월 주별 계획: ["1월 1주차 내용", "1월 2주차 내용", ...]
      3) 반드시 JSON 형태만 출력. 예) 
      {
        "monthlyPlan": [
          {"month": 1, "content": "예시"},
          {"month": 2, "content": "예시"},
          ...
        ],
        "weeklyDetail": [
          "1월 1주차 계획",
          "1월 2주차 계획",
          ...
        ]
      }
    `;

    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: systemMessage },
        { role: "user", content: userMessage },
      ],
      temperature: 0.7,
      max_tokens: 800, // 월별+주별 계획이라 텍스트가 길어질 수 있음
    });

    const rawText = response.data.choices[0].message.content.trim();

    // GPT가 준 결과를 JSON.parse 시도 (오류 처리 필요)
    let planResult;
    try {
      planResult = JSON.parse(rawText);
    } catch (err) {
      // GPT가 형식을 지키지 못했을 경우 fallback
      planResult = { rawOutput: rawText };
    }

    res.json({
      msg: "월별/주별 계획 생성 완료",
      plan: planResult,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ msg: "AI 계획 생성 중 오류 발생", error: error.message });
  }
};
