# [Design] soccer4 — 축구4 콘텐츠 허브

---
feature: soccer4
created: 2026-03-29
phase: design
architecture: option-a (독립 파일 방식)
---

## Context Anchor

| 항목 | 내용 |
|------|------|
| **WHY** | 축구4 팬 참여형 웹 콘텐츠 — 퀴즈·게임을 허브에서 원클릭 접근 |
| **WHO** | EPL·유럽 축구 커뮤니티 팬 |
| **RISK** | 파일 간 디자인 불일치 (인라인 CSS 중복), 모바일 대응 누락 |
| **SUCCESS** | 허브 4카드 + 퀴즈 10문항 완주 + 결과 표시 |
| **SCOPE** | soccer4.html + soccer4-quiz.html (구현 완료); 나머지는 단계별 추가 |

---

## 1. 아키텍처 선택: Option A — 독립 파일

```
C:/claude/study/
├── soccer4.html            허브 메인 (구현 완료 ✅)
├── soccer4-quiz.html       제1회 TMI 모의고사 (구현 완료 ✅)
├── soccer4-quiz-N.html     제2~5회 모의고사 (예정)
├── soccer4-worldcup.html   이상형 월드컵 (예정)
├── soccer4-best11.html     베스트 11 (예정)
└── soccer4-quizshow.html   이스타 퀴즈쇼 (예정)
```

**선택 이유**:
- `file://` 프로토콜 직접 실행 완전 지원 (CORS 없음)
- 기능별 독립 개발/수정 가능
- 빌드 도구 불필요, 기존 패턴과 일관성

---

## 2. 공통 디자인 시스템 (파일마다 인라인 적용)

모든 HTML 파일이 동일한 CSS 변수 세트를 인라인으로 포함한다.

```css
:root {
  --bg:        #0a0a0f;
  --accent:    #5b40ff;
  --correct:   #34c759;
  --wrong:     #ff453a;
  --card:      rgba(16, 16, 26, 0.95);
  --border:    rgba(255, 255, 255, 0.07);
  --text:      #f5f5f7;
  --text-sub:  rgba(255, 255, 255, 0.45);
  --r-sm:      12px;
  --r-lg:      20px;
  --font:      -apple-system, BlinkMacSystemFont, 'Inter', 'Segoe UI', sans-serif;
}
```

**배경 조명 효과 (공통)**:
```css
body::before {
  content: '';
  position: fixed;
  width: 600~700px; height: 600~700px;
  background: radial-gradient(circle, rgba(91,64,255,0.10) 0%, transparent 70%);
  top: 50%; left: 50%;
  transform: translate(-50%, -50%);
  pointer-events: none;
}
```

---

## 3. 파일별 컴포넌트 설계

### 3.1 soccer4.html — 허브 (현재 구현)

```
[body]
  ├── body::before        배경 조명
  └── .container
       ├── header
       │    ├── .logo     "⚽ 축구4"
       │    └── .tagline
       └── .grid (2×2)
            ├── a.card.active  → soccer4-quiz.html
            ├── div.card.disabled  (이상형 월드컵)
            ├── div.card.disabled  (베스트 11)
            └── div.card.disabled  (이스타 퀴즈쇼)
```

**카드 상태별 스타일**:
- `active`: `border-color: rgba(91,64,255,0.4)`, 호버 글로우
- `disabled`: `opacity: 0.42`, 클릭 불가

### 3.2 soccer4-quiz.html — 모의고사 (현재 구현)

```
[body]
  ├── body::before
  └── .wrap
       ├── nav              "← 목록으로" 링크
       ├── .progress-wrap
       │    ├── .progress-info (레이블 + 진행 카운트)
       │    └── .bar-track > .bar-fill
       ├── #quizView
       │    └── .card#qCard
       │         ├── .q-num
       │         ├── .q-text
       │         ├── .choices > button.choice × 4
       │         ├── .explanation
       │         └── button#nextBtn
       └── .result-screen#resultScreen
            └── .result-card
                 ├── .result-emoji
                 ├── .result-score
                 ├── .result-grade
                 ├── .result-msg
                 └── button.restart-btn
```

**상태 흐름**:
```
초기화
  → render() — 문제 표시
  → pick(i) — 답변 선택
      ├── 정답: .correct 클래스 + score++
      └── 오답: .wrong + .correct(정답 강조)
  → .explanation 표시 + #nextBtn 표시
  → [다음 문제] → idx++ → render()
  → [마지막 문제 후] → showResult()
  → [다시 도전] → restart() → render()
```

### 3.3 soccer4-worldcup.html — 이상형 월드컵 (설계)

```
[body]
  └── .wrap
       ├── nav              "← 목록으로"
       ├── .theme-select    주제 선택 (10가지)
       └── .bracket-view
            ├── .round-label  "32강 / 16강 / ..."
            ├── .matchup
            │    ├── .player-card (왼쪽)
            │    └── .player-card (오른쪽)
            └── .vs-badge
```

**상태 구조** (예정):
```javascript
let theme = null;         // 선택된 주제
let players = [...];      // 128명 선수 배열
let currentRound = [];    // 현재 라운드 대진
let roundIndex = 0;       // 현재 매치 인덱스
let winners = [];         // 라운드 승자 배열
```

### 3.4 soccer4-best11.html — 베스트 11 (설계)

```
[body]
  └── .wrap
       ├── nav
       ├── .theme-select    컨셉 선택 (10가지)
       └── .formation
            ├── .pitch-bg   축구장 배경 SVG
            └── .player-slots (4-3-3 or 4-4-2)
                 └── .slot × 11
```

---

## 4. 네비게이션 흐름

```
soccer4.html (허브)
  │
  ├──[모의고사 카드]──→ soccer4-quiz.html
  │                         └──[← 목록으로]──→ soccer4.html
  │
  ├──[이상형 월드컵]──→ soccer4-worldcup.html (예정)
  │
  ├──[베스트 11]──→ soccer4-best11.html (예정)
  │
  └──[이스타 퀴즈쇼]──→ soccer4-quizshow.html (예정)
```

**허브 카드 오픈 트리거**: 새 기능 파일 구현 완료 시 해당 카드의 `disabled` 클래스 제거 + `href` 추가

---

## 5. 퀴즈 문제 데이터 구조 (표준화)

모든 퀴즈 파일에서 동일한 형태를 사용한다:

```javascript
const questions = [
  {
    q: '문제 텍스트',
    choices: ['선택지A', '선택지B', '선택지C', '선택지D'],
    answer: 0,           // 정답 인덱스 (0-based)
    exp: '해설 텍스트'
  },
  // ...
];
```

**등급 기준 (공통)**:
```javascript
const GRADES = [
  { min: 9, emoji: '🏆', grade: '축구 신',    msg: '...' },
  { min: 7, emoji: '⚽', grade: '수준급 덕후', msg: '...' },
  { min: 5, emoji: '👟', grade: '평균 이상',  msg: '...' },
  { min: 3, emoji: '📚', grade: '공부 필요',  msg: '...' },
  { min: 0, emoji: '😅', grade: '입문자',     msg: '...' },
];
```

---

## 6. 반응형 기준

| 브레이크포인트 | 변화 |
|---------------|------|
| `> 560px` | 2열 그리드 |
| `≤ 560px` | 1열 그리드 |

```css
@media (max-width: 560px) {
  .grid { grid-template-columns: 1fr; }
}
```

---

## 7. 애니메이션 패턴

**문제 전환 애니메이션**:
```css
@keyframes fadeUp {
  from { opacity: 0; transform: translateY(10px); }
  to   { opacity: 1; transform: translateY(0); }
}
.card { animation: fadeUp 0.22s ease; }
```

**재실행 트릭** (JS):
```javascript
card.style.animation = 'none';
void card.offsetWidth; // reflow 강제
card.style.animation = '';
```

---

## 8. 허브 카드 오픈 패턴

새 기능 구현 완료 시 `soccer4.html`의 해당 카드 수정:

**Before (준비 중)**:
```html
<div class="card disabled">
  <div class="card-icon">🏆</div>
  <div class="card-title">이상형 월드컵</div>
  ...
  <div class="card-footer">
    <span class="badge badge-soon">COMING SOON</span>
  </div>
</div>
```

**After (오픈)**:
```html
<a class="card active" href="soccer4-worldcup.html">
  <div class="card-icon">🏆</div>
  <div class="card-title">이상형 월드컵</div>
  ...
  <div class="card-footer">
    <span class="badge badge-open">OPEN</span>
  </div>
  <span class="arrow">→</span>
</a>
```

---

## 11. Implementation Guide

### 11.1 구현 순서

1. ✅ soccer4.html — 허브 (완료)
2. ✅ soccer4-quiz.html — 제1회 TMI (완료)
3. ⬜ soccer4-quiz-2.html — 제2회 귀화 모의고사
4. ⬜ soccer4-worldcup.html — 이상형 월드컵 (복잡도 높음)
5. ⬜ soccer4-best11.html — 베스트 11
6. ⬜ soccer4-quizshow.html — 이스타 퀴즈쇼

### 11.2 각 기능 구현 시 체크리스트

- [ ] CSS 변수 `:root` 동일하게 적용
- [ ] `body::before` 배경 조명 효과 포함
- [ ] `nav` → "← 목록으로" (href="soccer4.html")
- [ ] 모바일 반응형 (560px 브레이크포인트)
- [ ] `fadeUp` 애니메이션 적용
- [ ] 구현 완료 후 허브 카드 활성화

### 11.3 Session Guide

| 모듈 | 파일 | 예상 난이도 | 우선순위 |
|------|------|-------------|--------|
| module-1 | soccer4-quiz-2.html | 낮음 | 1 |
| module-2 | soccer4-worldcup.html | 높음 | 2 |
| module-3 | soccer4-best11.html | 중간 | 3 |
| module-4 | soccer4-quizshow.html | 중간 | 4 |

**권장 세션 분리**:
- 세션 1: `/pdca do soccer4 --scope module-1` (모의고사 2회)
- 세션 2: `/pdca do soccer4 --scope module-2` (이상형 월드컵)
- 세션 3: `/pdca do soccer4 --scope module-3,module-4` (베스트11 + 퀴즈쇼)
