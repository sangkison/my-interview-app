import { NextRequest, NextResponse } from "next/server"

interface GenerateRequest {
  company: string
  jobTitle: string
}

interface Question {
  id: string
  question: string
  evaluation_focus: string[]
}

export async function POST(request: NextRequest) {
  try {
    // 요청 본문 파싱
    const body: GenerateRequest = await request.json()
    const { company, jobTitle } = body

    // 입력 검증
    if (!company || !jobTitle) {
      return NextResponse.json(
        { error: "회사명과 직무를 모두 입력해주세요." },
        { status: 400 }
      )
    }

    // OpenAI API 키 확인
    const apiKey = process.env.OPENAI_API_KEY
    if (!apiKey) {
      console.error("OPENAI_API_KEY가 설정되지 않았습니다.")
      return NextResponse.json(
        { error: "서버 설정 오류가 발생했습니다." },
        { status: 500 }
      )
    }

    // OpenAI API 호출
    const prompt = `당신은 2026년 채용 트렌드에 맞는 면접 질문을 생성하는 전문가입니다.

회사명: ${company}
지원 직무: ${jobTitle}

위 정보를 바탕으로 ${company}의 기업 문화와 ${jobTitle} 직무의 핵심 역량을 날카롭게 파고드는 면접 질문 1개를 생성해주세요.
질문은 다음 형식의 JSON 객체로 응답해주세요:

{
  "id": "Q1",
  "question": "질문 내용",
  "evaluation_focus": ["평가 포인트1", "평가 포인트2", "평가 포인트3"]
}

요구사항:
- ${company}의 실제 기업 문화, 가치관, 비즈니스 모델을 깊이 있게 이해한 후 질문을 생성해야 합니다
- ${jobTitle} 직무에서 요구되는 핵심 역량과 실제 업무 상황을 반영한 질문이어야 합니다
- 단순한 일반적인 질문이 아닌, 해당 기업과 직무에 특화된 날카롭고 구체적인 질문이어야 합니다
- 지원자의 사고력, 문제 해결 능력, 기업 이해도, 직무 역량을 종합적으로 평가할 수 있는 질문이어야 합니다
- 평가 포인트는 2-3개 정도로 구체적으로 작성해주세요
- JSON 형식만 응답하고, 다른 설명은 포함하지 마세요`

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content:
              "당신은 기업 문화와 직무 역량을 깊이 있게 분석하여 날카로운 면접 질문을 생성하는 전문가입니다. 항상 유효한 JSON 형식으로만 응답합니다.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.8,
        max_tokens: 1000,
        response_format: { type: "json_object" },
      }),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      console.error("OpenAI API 오류:", errorData)
      return NextResponse.json(
        { error: "면접 질문 생성에 실패했습니다. 잠시 후 다시 시도해주세요." },
        { status: 500 }
      )
    }

    const data = await response.json()
    const content = data.choices?.[0]?.message?.content

    if (!content) {
      return NextResponse.json(
        { error: "응답을 받을 수 없습니다." },
        { status: 500 }
      )
    }

    // JSON 파싱 시도
    let question: Question
    try {
      // content가 JSON 객체로 감싸져 있을 수 있으므로 파싱
      const parsed = JSON.parse(content)
      
      // 단일 질문 객체 추출
      if (parsed.id && parsed.question) {
        // 직접 질문 객체인 경우
        question = {
          id: parsed.id || "Q1",
          question: parsed.question || "",
          evaluation_focus: Array.isArray(parsed.evaluation_focus)
            ? parsed.evaluation_focus
            : [],
        }
      } else if (parsed.question) {
        // question 속성이 있는 경우
        question = {
          id: parsed.id || "Q1",
          question: parsed.question,
          evaluation_focus: Array.isArray(parsed.evaluation_focus)
            ? parsed.evaluation_focus
            : [],
        }
      } else {
        throw new Error("유효한 질문 객체를 찾을 수 없습니다.")
      }

      // 질문 내용 검증
      if (!question.question || question.question.trim() === "") {
        throw new Error("질문 내용이 비어있습니다.")
      }
    } catch (parseError) {
      console.error("JSON 파싱 오류:", parseError)
      console.error("원본 응답:", content)
      
      // 파싱 실패 시 대체 질문 생성
      question = {
        id: "Q1",
        question: `${company}의 ${jobTitle} 직무에서 요구되는 핵심 역량과 ${company}의 기업 문화가 어떻게 연결되는지, 그리고 이를 바탕으로 당신이 이 직무에서 어떤 가치를 창출할 수 있다고 생각하시나요?`,
        evaluation_focus: ["기업 문화 이해도", "직무 역량 분석", "가치 창출 사고"],
      }
    }

    return NextResponse.json({ question }, { status: 200 })
  } catch (error) {
    console.error("API 오류:", error)
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.",
      },
      { status: 500 }
    )
  }
}
