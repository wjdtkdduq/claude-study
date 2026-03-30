// ============================================================
// plan-review MCP 서버
// Gemini API를 활용해 구현 계획의 리스크와 누락 사항을 검토한다.
// ============================================================

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { GoogleGenerativeAI } from "@google/generative-ai";

// ============================================================
// 설정 (Configuration)
// ============================================================
const CONFIG = {
  // 서버 메타데이터
  SERVER_NAME: "plan-review",
  SERVER_VERSION: "1.0.0",

  // Gemini 모델 설정
  GEMINI_MODEL: "gemini-2.0-flash",

  // 리뷰 프롬프트 템플릿
  REVIEW_PROMPT_TEMPLATE: (plan) =>
    `다음 구현 계획의 빠진 부분이나 리스크를 지적해줘.\n\n---\n${plan}\n---`,
};

// ============================================================
// Gemini 클라이언트 초기화
// ============================================================

/**
 * 환경변수에서 API 키를 읽어 Gemini 클라이언트를 생성한다.
 * API 키가 없으면 즉시 종료한다.
 */
function createGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    // 서버 시작 전에 누락된 키를 조기에 감지
    console.error("오류: GEMINI_API_KEY 환경변수가 설정되지 않았습니다.");
    process.exit(1);
  }
  return new GoogleGenerativeAI(apiKey);
}

// ============================================================
// 비즈니스 로직 (Domain Logic — 순수 함수에 가깝게 구성)
// ============================================================
const PlanReviewService = {
  /**
   * plan 텍스트를 검증한다.
   * @param {string} plan - 검토할 계획 텍스트
   * @returns {{ valid: boolean, error?: string }}
   */
  validate(plan) {
    if (typeof plan !== "string" || plan.trim().length === 0) {
      return { valid: false, error: "plan 텍스트가 비어 있습니다." };
    }
    return { valid: true };
  },

  /**
   * Gemini 모델에 계획 리뷰를 요청하고 결과 텍스트를 반환한다.
   * @param {GoogleGenerativeAI} geminiClient
   * @param {string} plan
   * @returns {Promise<string>}
   */
  async review(geminiClient, plan) {
    const model = geminiClient.getGenerativeModel({
      model: CONFIG.GEMINI_MODEL,
    });

    const prompt = CONFIG.REVIEW_PROMPT_TEMPLATE(plan);
    const result = await model.generateContent(prompt);
    const response = result.response;

    return response.text();
  },
};

// ============================================================
// MCP 서버 설정 및 핸들러 등록
// ============================================================

/**
 * MCP 서버 인스턴스를 생성하고 tool 핸들러를 등록한다.
 * @param {GoogleGenerativeAI} geminiClient
 * @returns {Server}
 */
function createServer(geminiClient) {
  const server = new Server(
    {
      name: CONFIG.SERVER_NAME,
      version: CONFIG.SERVER_VERSION,
    },
    {
      capabilities: {
        tools: {},
      },
    }
  );

  // ── tools/list: 사용 가능한 tool 목록 반환 ──────────────────
  server.setRequestHandler(ListToolsRequestSchema, async () => {
    return {
      tools: [
        {
          name: "review_plan",
          description:
            "구현 계획 텍스트를 받아 Gemini AI가 빠진 부분이나 리스크를 분석하고 리뷰 결과를 반환합니다.",
          inputSchema: {
            type: "object",
            properties: {
              plan: {
                type: "string",
                description: "리뷰를 받을 구현 계획 텍스트",
              },
            },
            required: ["plan"],
          },
        },
      ],
    };
  });

  // ── tools/call: tool 실행 요청 처리 ────────────────────────
  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;

    // 알 수 없는 tool 요청 처리
    if (name !== "review_plan") {
      return {
        content: [
          {
            type: "text",
            text: `오류: '${name}'은(는) 존재하지 않는 tool입니다.`,
          },
        ],
        isError: true,
      };
    }

    // 입력값 검증
    const validation = PlanReviewService.validate(args?.plan);
    if (!validation.valid) {
      return {
        content: [
          {
            type: "text",
            text: `입력 오류: ${validation.error}`,
          },
        ],
        isError: true,
      };
    }

    // Gemini API 호출
    try {
      const reviewText = await PlanReviewService.review(
        geminiClient,
        args.plan
      );

      return {
        content: [
          {
            type: "text",
            text: reviewText,
          },
        ],
      };
    } catch (err) {
      // API 호출 실패 시 오류 메시지를 MCP 응답으로 반환
      const message =
        err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다.";
      return {
        content: [
          {
            type: "text",
            text: `Gemini API 호출 실패: ${message}`,
          },
        ],
        isError: true,
      };
    }
  });

  return server;
}

// ============================================================
// 진입점 (Entry Point)
// ============================================================
async function main() {
  const geminiClient = createGeminiClient();
  const server = createServer(geminiClient);

  // stdio transport 연결 — Claude Desktop 등 MCP 호스트와 표준 입출력으로 통신
  const transport = new StdioServerTransport();
  await server.connect(transport);

  // 서버 상태 로그는 stderr에 출력 (stdout은 MCP 통신 전용)
  console.error(
    `plan-review MCP 서버 시작됨 (모델: ${CONFIG.GEMINI_MODEL})`
  );
}

main().catch((err) => {
  console.error("서버 초기화 오류:", err);
  process.exit(1);
});
