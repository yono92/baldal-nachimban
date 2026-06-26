import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { SYSTEM_PROMPT, buildUserPrompt } from "@/lib/consultation/prompt";
import { checkConsultationRateLimit, getRateLimitHeaders } from "@/lib/consultation/rate-limit";
import { validateConsultationRequest, validateRawBody } from "@/lib/consultation/validation";

export const maxDuration = 30;

function getOpenAI() {
  return new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
}

function getClientKey(request: NextRequest) {
  const forwardedFor = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  return (
    forwardedFor ||
    request.headers.get("x-real-ip") ||
    request.headers.get("cf-connecting-ip") ||
    "unknown"
  );
}

export async function POST(request: NextRequest) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: "AI 상담 설정이 완료되지 않았습니다. 관리자에게 문의해주세요." },
        { status: 503 }
      );
    }

    const rateLimit = checkConsultationRateLimit(getClientKey(request));
    const rateLimitHeaders = getRateLimitHeaders(rateLimit);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: "요청이 너무 많습니다. 잠시 후 다시 시도해주세요." },
        { status: 429, headers: rateLimitHeaders }
      );
    }

    const rawBody = await request.text();
    const bodySize = validateRawBody(rawBody);
    if (!bodySize.ok) {
      return NextResponse.json(
        { error: bodySize.message },
        { status: bodySize.status, headers: rateLimitHeaders }
      );
    }

    let parsedBody: unknown;
    try {
      parsedBody = JSON.parse(rawBody);
    } catch {
      return NextResponse.json(
        { error: "요청 형식이 올바르지 않습니다." },
        { status: 400, headers: rateLimitHeaders }
      );
    }

    const validation = validateConsultationRequest(parsedBody);
    if (!validation.ok) {
      return NextResponse.json(
        { error: validation.message },
        { status: validation.status, headers: rateLimitHeaders }
      );
    }

    const userPrompt = buildUserPrompt(validation.value);

    const openai = getOpenAI();
    const stream = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: userPrompt },
      ],
      response_format: { type: "json_object" },
      max_completion_tokens: 1800,
      stream: true,
    });

    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        for await (const chunk of stream) {
          const text = chunk.choices[0]?.delta?.content ?? "";
          if (text) {
            controller.enqueue(encoder.encode(`data: ${JSON.stringify(text)}\n\n`));
          }
        }
        controller.enqueue(encoder.encode("data: [DONE]\n\n"));
        controller.close();
      },
    });

    return new Response(readable, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
        ...rateLimitHeaders,
      },
    });
  } catch (error) {
    console.error("Consultation API error:", error);
    return NextResponse.json(
      { error: "AI 상담 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요." },
      { status: 500 }
    );
  }
}
