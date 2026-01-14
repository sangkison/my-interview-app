"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Sparkles, Briefcase, FileText, AlertCircle, Loader2 } from "lucide-react"
import confetti from "canvas-confetti"

interface Question {
  id: string
  question: string
  evaluation_focus: string[]
}

export function InterviewDashboard() {
  const [company, setCompany] = useState("")
  const [jobTitle, setJobTitle] = useState("")
  const [questions, setQuestions] = useState<Question[]>([])
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const triggerConfetti = () => {
    const count = 200
    const defaults = {
      origin: { y: 0.7 },
      zIndex: 9999,
    }

    function fire(particleRatio: number, opts: confetti.Options) {
      confetti({
        ...defaults,
        ...opts,
        particleCount: Math.floor(count * particleRatio),
      })
    }

    fire(0.25, {
      spread: 26,
      startVelocity: 55,
    })

    fire(0.2, {
      spread: 60,
    })

    fire(0.35, {
      spread: 100,
      decay: 0.91,
      scalar: 0.8,
    })

    fire(0.1, {
      spread: 120,
      startVelocity: 25,
      decay: 0.92,
      scalar: 1.2,
    })

    fire(0.1, {
      spread: 120,
      startVelocity: 45,
    })
  }

  const handleGenerate = async () => {
    // Clear previous error and questions
    setError("")
    setQuestions([])

    // Validate inputs
    if (!company.trim() || !jobTitle.trim()) {
      setError("회사명과 직무를 모두 입력해주세요.")
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          company: company.trim(),
          jobTitle: jobTitle.trim(),
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "면접 질문 생성에 실패했습니다.")
      }

      // API 응답은 { question: Question } 형식이므로 배열로 변환
      if (data.question) {
        setQuestions([data.question])
        setTimeout(() => {
          triggerConfetti()
        }, 100)
      } else {
        throw new Error("질문 데이터를 받을 수 없습니다.")
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "면접 질문 생성에 실패했습니다. 잠시 후 다시 시도해주세요."
      setError(errorMessage)
      console.error("질문 생성 오류:", err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-accent/20">
      {/* Header Section */}
      <header className="border-b border-border/40 bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary">
              <Sparkles className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground sm:text-2xl">AI 면접 질문 생성기</h1>
              <p className="text-sm text-muted-foreground">2026 취업 시장 맞춤형 면접 준비</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
        {/* Input Section */}
        <div className="mx-auto max-w-3xl">
          <div className="mb-8 text-center">
            <h2 className="mb-3 text-3xl font-bold text-balance text-foreground sm:text-4xl">
              직무 맞춤형 면접 질문을 생성하세요
            </h2>
            <p className="text-pretty text-muted-foreground leading-relaxed">
              회사명과 지원 직무를 입력하면 실제 면접에서 사용되는
              <br className="hidden sm:block" />
              사고력 중심의 질문들을 즉시 확인할 수 있습니다
            </p>
          </div>

          <Card className="p-8 shadow-2xl border-2 border-primary/20 bg-gradient-to-br from-card via-card to-primary/5 backdrop-blur-sm">
            <div className="space-y-5">
              <div className="relative">
                <label htmlFor="company-input" className="mb-2 block text-sm font-semibold text-foreground">
                  회사명
                </label>
                <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center pt-8">
                  <Briefcase className="h-5 w-5 text-primary" />
                </div>
                <Input
                  id="company-input"
                  placeholder="예: 카카오"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className="pl-11 h-14 text-base bg-background border-2 border-primary/30 focus:border-primary shadow-sm transition-all focus:shadow-md"
                />
              </div>

              <div className="relative">
                <label htmlFor="job-input" className="mb-2 block text-sm font-semibold text-foreground">
                  지원 직무
                </label>
                <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center pt-8">
                  <FileText className="h-5 w-5 text-primary" />
                </div>
                <Input
                  id="job-input"
                  placeholder="예: 서비스 기획자"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
                  className="pl-11 h-14 text-base bg-background border-2 border-primary/30 focus:border-primary shadow-sm transition-all focus:shadow-md"
                />
              </div>

              {error && (
                <div className="flex items-center gap-2 rounded-lg bg-destructive/10 border border-destructive/30 px-4 py-3">
                  <AlertCircle className="h-5 w-5 text-destructive shrink-0" />
                  <p className="text-sm text-destructive font-medium">{error}</p>
                </div>
              )}

              <Button
                onClick={handleGenerate}
                disabled={isLoading}
                className="h-14 w-full text-lg font-bold shadow-lg hover:shadow-xl transition-all bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary disabled:opacity-50 disabled:cursor-not-allowed"
                size="lg"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-6 w-6 animate-spin" />
                    질문 생성 중...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-6 w-6" />
                    질문 생성하기
                  </>
                )}
              </Button>
            </div>
          </Card>
        </div>

        {/* Results Section */}
        {questions.length > 0 && (
          <div className="mx-auto mt-16 max-w-4xl animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="mb-8 rounded-xl bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 border-2 border-primary/20 p-6 shadow-md">
              <div className="flex items-start gap-3">
                <FileText className="h-6 w-6 text-primary shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-bold text-foreground text-lg mb-1">면접 질문지</h3>
                  <p className="text-sm text-pretty text-foreground/80 leading-relaxed">
                    이 질문들은 실제 면접에서 <span className="font-semibold text-primary">사고력을 평가</span>하기 위해
                    자주 활용됩니다. 각 질문에 대해 구조화된 답변을 준비해보세요.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-5">
              {questions.map((q, index) => (
                <Card
                  key={q.id}
                  className="p-6 transition-all hover:shadow-lg border-2 border-border/60 bg-card shadow-md hover:border-primary/30 animate-in fade-in slide-in-from-bottom-4 duration-700"
                >
                  <div className="flex gap-5">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary font-bold text-primary-foreground shadow-sm">
                      Q{index + 1}
                    </div>
                    <div className="flex-1 space-y-4">
                      <p className="text-pretty text-foreground leading-relaxed font-medium text-[15px]">
                        {q.question}
                      </p>
                      {q.evaluation_focus && q.evaluation_focus.length > 0 && (
                        <div className="rounded-lg bg-accent/60 border border-accent/80 px-4 py-3">
                          <p className="text-sm text-muted-foreground leading-relaxed">
                            <span className="font-semibold text-foreground">평가 포인트:</span>{" "}
                            {q.evaluation_focus.join(", ")}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-border/40 bg-card/30 mt-20">
        <div className="container mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-muted-foreground">
            © 2026 AI 면접 질문 생성기. 함께 준비하는 면접 파트너
          </p>
        </div>
      </footer>
    </div>
  )
}
