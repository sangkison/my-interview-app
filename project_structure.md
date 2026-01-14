# 프로젝트 구조 및 기술 스펙 문서

## 📋 프로젝트 개요

**프로젝트명**: AI 면접 질문 생성기 (my-interview-app)  
**버전**: 0.1.0  
**설명**: 2026년 채용 트렌드에 맞는 직무 맞춤형 면접 질문을 즉시 생성해주는 AI 기반 면접 준비 서비스

---

## 🛠 기술 스택

### 핵심 프레임워크
- **Next.js**: 16.0.10 (App Router 사용)
- **React**: 19.2.0
- **TypeScript**: 5.x
- **Node.js**: 22.x

### 스타일링
- **Tailwind CSS**: 4.1.9 (최신 버전)
- **PostCSS**: 8.5
- **CSS Variables**: 다크모드 지원을 위한 CSS 변수 시스템
- **shadcn/ui**: New York 스타일 컴포넌트 라이브러리

### UI 컴포넌트 라이브러리
- **Radix UI**: 접근성 중심의 헤드리스 UI 컴포넌트
  - Accordion, Alert Dialog, Avatar, Checkbox, Dialog, Dropdown Menu 등
- **Lucide React**: 아이콘 라이브러리 (0.454.0)
- **class-variance-authority**: 컴포넌트 variant 관리
- **clsx & tailwind-merge**: 클래스명 유틸리티

### 폼 관리
- **React Hook Form**: 7.60.0
- **Zod**: 3.25.76 (스키마 검증)
- **@hookform/resolvers**: 3.10.0

### 기타 라이브러리
- **@vercel/analytics**: 1.3.1 (애널리틱스)
- **next-themes**: 0.4.6 (다크모드 테마 관리)
- **canvas-confetti**: 1.9.4 (축하 효과)
- **date-fns**: 4.1.0 (날짜 처리)
- **recharts**: 2.15.4 (차트 라이브러리)
- **sonner**: 1.7.4 (토스트 알림)

### 개발 도구
- **ESLint**: Next.js 코어 웹 바이탈 및 TypeScript 설정
- **TypeScript**: Strict 모드 활성화

---

## 📁 폴더 구조

```
my-interview-app/
├── public/                    # 정적 파일
│   ├── file.svg
│   ├── globe.svg
│   ├── next.svg
│   ├── vercel.svg
│   └── window.svg
│
├── src/
│   ├── app/                   # Next.js App Router
│   │   ├── favicon.ico
│   │   ├── globals.css        # 전역 스타일 (Tailwind + 테마 변수)
│   │   ├── layout.tsx         # 루트 레이아웃 (메타데이터, 폰트, Analytics)
│   │   └── page.tsx           # 홈 페이지 (InterviewDashboard 렌더링)
│   │
│   ├── components/            # React 컴포넌트
│   │   ├── interview-dashboard.tsx  # 메인 대시보드 컴포넌트
│   │   └── ui/                # shadcn/ui 컴포넌트
│   │       ├── button.tsx     # Button 컴포넌트
│   │       ├── card.tsx       # Card 컴포넌트 (Header, Title, Content, Footer 등)
│   │       └── input.tsx      # Input 컴포넌트
│   │
│   └── lib/                   # 유틸리티 함수
│       └── utils.ts           # cn() 함수 (클래스명 병합)
│
├── components.json            # shadcn/ui 설정 파일
├── eslint.config.mjs          # ESLint 설정
├── next.config.ts             # Next.js 설정
├── next-env.d.ts              # Next.js 타입 정의
├── package.json               # 프로젝트 의존성 및 스크립트
├── package-lock.json          # 의존성 잠금 파일
├── postcss.config.mjs         # PostCSS 설정
├── tsconfig.json              # TypeScript 설정
└── README.md                  # 프로젝트 README
```

---

## 🎨 주요 컴포넌트

### 1. InterviewDashboard (`src/components/interview-dashboard.tsx`)
**역할**: 메인 대시보드 컴포넌트

**주요 기능**:
- 회사명 및 직무 입력 폼
- 면접 질문 생성 기능
- 질문 표시 및 평가 포인트 표시
- Confetti 애니메이션 효과

**상태 관리**:
- `company`: 회사명 입력값
- `jobTitle`: 직무 입력값
- `questions`: 생성된 질문 배열
- `error`: 에러 메시지

**데이터 구조**:
- `QUESTION_DATA`: 하드코딩된 면접 질문 데이터
  - 3개 직무 카테고리: IT 대기업 마케터, 소프트웨어 엔지니어, 서비스 기획자
  - 각 질문은 `id`, `question`, `evaluation_focus` 포함

### 2. UI 컴포넌트 (`src/components/ui/`)

#### Button (`button.tsx`)
- Variants: default, destructive, outline, secondary, ghost, link
- Sizes: default, sm, lg, icon, icon-sm, icon-lg
- Radix UI Slot 지원 (asChild prop)

#### Card (`card.tsx`)
- Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter, CardAction
- Container queries 지원

#### Input (`input.tsx`)
- 접근성 고려 (aria-invalid 지원)
- 다크모드 스타일링
- 포커스 링 효과

---

## ⚙️ 설정 파일 상세

### TypeScript (`tsconfig.json`)
- **Target**: ES2017
- **Module**: ESNext
- **JSX**: react-jsx
- **Strict Mode**: 활성화
- **Path Alias**: `@/*` → `./src/*`
- **Module Resolution**: bundler (Next.js 최적화)

### Next.js (`next.config.ts`)
- 기본 설정 (추가 옵션 없음)

### ESLint (`eslint.config.mjs`)
- Next.js 코어 웹 바이탈 규칙
- Next.js TypeScript 규칙
- `.next/`, `out/`, `build/` 디렉토리 무시

### PostCSS (`postcss.config.mjs`)
- `@tailwindcss/postcss` 플러그인 사용

### shadcn/ui (`components.json`)
- **Style**: new-york
- **RSC**: true (React Server Components 지원)
- **Base Color**: neutral
- **CSS Variables**: 활성화
- **Icon Library**: lucide
- **Aliases**:
  - `@/components` → `./src/components`
  - `@/utils` → `./src/lib/utils`
  - `@/ui` → `./src/components/ui`
  - `@/lib` → `./src/lib`
  - `@/hooks` → `./src/hooks`

### 스타일 (`src/app/globals.css`)
- Tailwind CSS 4.x 사용
- CSS Variables 기반 테마 시스템
- Light/Dark 모드 지원
- OKLCH 색상 공간 사용
- Primary 색상: Blue 계열 (oklch(0.55 0.15 240))
- Border radius: 0.75rem

---

## 📦 주요 의존성

### 프로덕션 의존성
```json
{
  "next": "16.0.10",
  "react": "19.2.0",
  "react-dom": "19.2.0",
  "typescript": "^5",
  "@radix-ui/*": "다양한 버전",
  "tailwindcss": "^4.1.9",
  "lucide-react": "^0.454.0",
  "react-hook-form": "^7.60.0",
  "zod": "3.25.76",
  "canvas-confetti": "1.9.4",
  "@vercel/analytics": "1.3.1"
}
```

### 개발 의존성
```json
{
  "@types/node": "^22",
  "@types/react": "^19",
  "@types/react-dom": "^19",
  "@tailwindcss/postcss": "^4.1.9",
  "postcss": "^8.5"
}
```

---

## 🚀 개발 스크립트

```bash
npm run dev      # 개발 서버 실행 (localhost:3000)
npm run build    # 프로덕션 빌드
npm run start    # 프로덕션 서버 실행
npm run lint     # ESLint 실행
```

---

## 🎯 프로젝트 특징

### 1. 아키텍처
- **App Router**: Next.js 13+ App Router 사용
- **Server Components**: 기본적으로 Server Components 사용
- **Client Components**: `"use client"` 지시어로 명시적 선언

### 2. 스타일링 접근
- **Utility-First**: Tailwind CSS 클래스 기반 스타일링
- **Component Variants**: CVA를 통한 컴포넌트 variant 관리
- **CSS Variables**: 테마 시스템을 위한 CSS 변수 활용
- **Responsive Design**: 모바일 우선 반응형 디자인

### 3. 접근성
- **Radix UI**: ARIA 속성 자동 적용
- **키보드 네비게이션**: 포커스 관리 및 키보드 이벤트 지원
- **시맨틱 HTML**: 적절한 HTML 태그 사용

### 4. 타입 안정성
- **TypeScript Strict Mode**: 엄격한 타입 검사
- **타입 정의**: 인터페이스 및 타입 명시적 정의

### 5. 성능 최적화
- **Next.js 최적화**: 자동 코드 스플리팅, 이미지 최적화
- **폰트 최적화**: next/font를 통한 Geist 폰트 최적화
- **Analytics**: Vercel Analytics 통합

---

## 📝 현재 구현 상태

### 구현된 기능
✅ 회사명 및 직무 입력 폼  
✅ 면접 질문 랜덤 생성 (하드코딩된 데이터 기반)  
✅ 질문 표시 및 평가 포인트 표시  
✅ Confetti 애니메이션 효과  
✅ 반응형 디자인  
✅ 에러 처리 (입력 검증)  

### 미구현 기능
❌ 실제 AI API 연동  
❌ 질문 저장/히스토리 기능  
❌ 사용자 인증  
❌ 데이터베이스 연동  
❌ 질문 커스터마이징 옵션  

---

## 🔄 개발 가이드라인

### 컴포넌트 작성 규칙
1. **Server Component 우선**: 기본적으로 Server Component로 작성
2. **Client Component 명시**: 상태 관리나 이벤트 핸들러가 필요한 경우에만 `"use client"` 사용
3. **타입 정의**: 모든 props와 상태에 타입 명시
4. **컴포넌트 분리**: 재사용 가능한 컴포넌트는 `src/components/`에 분리

### 스타일링 규칙
1. **Tailwind 우선**: 가능한 한 Tailwind 클래스 사용
2. **CSS Variables**: 테마 색상은 CSS 변수 사용
3. **반응형**: 모바일 우선 접근 (sm:, md:, lg: 브레이크포인트)
4. **cn() 유틸리티**: 클래스명 병합 시 `cn()` 함수 사용

### 파일 구조 규칙
1. **경로 별칭**: `@/` 별칭 사용 (절대 경로)
2. **컴포넌트 위치**: 
   - 페이지 컴포넌트: `src/app/`
   - 재사용 컴포넌트: `src/components/`
   - UI 컴포넌트: `src/components/ui/`
3. **유틸리티**: `src/lib/`에 유틸리티 함수 배치

### 코드 스타일
1. **ESLint 규칙 준수**: Next.js 코어 웹 바이탈 규칙 적용
2. **TypeScript Strict**: 엄격한 타입 검사 유지
3. **명명 규칙**: 
   - 컴포넌트: PascalCase
   - 함수/변수: camelCase
   - 상수: UPPER_SNAKE_CASE

---

## 🔮 향후 확장 가능성

### 기능 확장
- AI API 연동 (OpenAI, Anthropic 등)
- 질문 히스토리 및 즐겨찾기
- 답변 작성 및 피드백 기능
- 사용자 프로필 및 설정
- 질문 카테고리 확장

### 기술적 개선
- 상태 관리 라이브러리 도입 (Zustand, Jotai 등)
- 데이터베이스 연동 (Prisma + PostgreSQL/MySQL)
- 인증 시스템 (NextAuth.js, Clerk 등)
- API Routes 구현
- 테스트 코드 작성 (Jest, React Testing Library)

---

## 📌 참고 사항

1. **Next.js 16**: 최신 버전 사용 중
2. **React 19**: 최신 React 버전 사용
3. **Tailwind CSS 4**: 최신 Tailwind 버전 (PostCSS 플러그인 방식)
4. **shadcn/ui**: 컴포넌트를 직접 수정 가능한 구조
5. **한국어 지원**: 메타데이터 및 UI 텍스트가 한국어로 작성됨

---

**마지막 업데이트**: 2026-01-14  
**문서 버전**: 1.0.0
