# [Plan] my-todo

**Feature**: my-todo
**File**: `my-todo.html`
**Date**: 2026-03-27
**Phase**: Plan
**Status**: In Progress

---

## Executive Summary

| 항목 | 내용 |
|------|------|
| **Feature** | my-todo — To-Do 앱 (my-todo.html) |
| **시작일** | 2026-03-27 |
| **기간** | 1 세션 |

### Value Delivered (4-Perspective)

| 관점 | 내용 |
|------|------|
| **Problem** | 할 일 목록을 관리할 수 있는 단순하고 직관적인 도구가 필요하다 |
| **Solution** | 기존 todo.html과 동일한 기능을 갖춘 새 파일로, 보라 테마 + 독립 localStorage 적용 |
| **Function UX Effect** | 추가·완료·편집·삭제·필터 등 핵심 CRUD를 모두 지원, 빠른 키보드 인터랙션 |
| **Core Value** | Linear-inspired 다크 UI 위에서 Zero-Friction 할 일 관리 경험 제공 |

---

## Context Anchor

| 항목 | 내용 |
|------|------|
| **WHY** | 기존 todo.html 구조를 학습/재사용하되 색상 + 데이터 분리가 필요한 새 인스턴스 생성 |
| **WHO** | 프로젝트 내 개발자 (로컬 브라우저에서 직접 실행) |
| **RISK** | 기존 todo.html 데이터 충돌 (localStorage 키 분리로 해결) |
| **SUCCESS** | todo.html 모든 기능 동작 + 보라 액센트 적용 + 데이터 독립 확인 |
| **SCOPE** | 단일 HTML 파일 (CSS·JS 내장), 빌드 도구 없음 |

---

## 1. 기능 요구사항

### 1.1 핵심 기능 (기존 todo.html 동일)

| # | 기능 | 상세 |
|---|------|------|
| F-01 | 할 일 추가 | 텍스트 입력 후 Enter 키 또는 추가 버튼으로 등록 |
| F-02 | 완료 토글 | 체크박스 클릭으로 완료/미완료 전환 |
| F-03 | 인라인 편집 | `contenteditable` 텍스트 클릭 후 직접 수정, Enter/blur 로 저장 |
| F-04 | 삭제 | 항목 호버 시 삭제 버튼 노출, 클릭으로 제거 |
| F-05 | 필터 | 전체 / 진행 중 / 완료 탭 전환 |
| F-06 | 완료 항목 일괄 삭제 | 하단 "완료 항목 삭제" 버튼 |
| F-07 | 통계 배지 | done count / total count 실시간 업데이트 |
| F-08 | 우선순위 컬러 dot | 항목 인덱스 기준 4색 순환 표시 |
| F-09 | 슬라이드인 애니메이션 | 새 항목 추가 시 위에서 아래로 페이드인 |
| F-10 | localStorage 영속성 | 키: `my-todos` (todo.html의 `linear-todos`와 독립) |

### 1.2 디자인 요구사항

| 항목 | 기존 todo.html | my-todo.html |
|------|----------------|--------------|
| 배경 | `#0a0a0f` | `#0a0a0f` (동일) |
| 액센트 | `#2563eb` (파란) | **`#5b40ff` (보라)** |
| 호버 강조 | `#3b82f6` | **`#6d5aff`** |
| 글로우 | `rgba(37,99,235,0.15)` | **`rgba(91,64,255,0.15)`** |
| 카드 배경 | `rgba(16,16,26,0.95)` | `rgba(16,16,26,0.95)` (동일) |
| 테두리 반경 | 12px / 20px | 12px / 20px (동일) |
| 폰트 | system-ui / Inter | system-ui / Inter (동일) |

---

## 2. 비기능 요구사항

| # | 항목 | 내용 |
|---|------|------|
| NF-01 | 빌드 도구 없음 | 순수 HTML/CSS/JS, 브라우저에서 직접 실행 |
| NF-02 | 데이터 독립 | localStorage 키 `my-todos`로 todo.html 데이터와 분리 |
| NF-03 | 텍스트 최대 길이 | 100자 (maxlength 동일) |
| NF-04 | 스크롤 | 목록 영역 내부 스크롤, 커스텀 스크롤바 |
| NF-05 | 키보드 지원 | 입력창 Enter → 추가, 편집 중 Enter → 저장 |

---

## 3. 성공 기준 (Success Criteria)

| # | 기준 | 검증 방법 |
|---|------|-----------|
| SC-01 | 할 일 추가/토글/편집/삭제 모두 정상 동작 | 브라우저 직접 테스트 |
| SC-02 | 필터 전환 시 해당 항목만 표시 | 각 탭 클릭 확인 |
| SC-03 | 새로고침 후 데이터 유지 (localStorage) | 페이지 리로드 테스트 |
| SC-04 | 보라 액센트 (`#5b40ff`) 적용 확인 | 시각 확인 (체크박스, 포커스, 배지) |
| SC-05 | todo.html 열어도 my-todo.html 데이터 영향 없음 | localStorage 키 분리 확인 |
| SC-06 | 빈 텍스트 제출 시 항목 추가되지 않음 | 공백 입력 테스트 |

---

## 4. 구현 범위

**새로 생성할 파일:**
- `my-todo.html` (1개)

**수정할 파일:**
- 없음

**예상 규모:**
- ~630줄 (기존 todo.html 기준, 색상 변수 치환)

---

## 5. 제약 사항 / 리스크

| # | 항목 | 대응 |
|---|------|------|
| R-01 | 색상 산재 — 여러 곳에 하드코딩된 파란색 값 | 모든 `#2563eb`, `rgba(37,99,235,…)` 값을 보라로 치환 |
| R-02 | 기존 todo.html 데이터 공유 | localStorage 키를 `my-todos`로 분리 |

---

## 6. 다음 단계

| 단계 | 명령 |
|------|------|
| Design | `/pdca design my-todo` |
| 구현 | `/pdca do my-todo` |
| 검증 | `/pdca analyze my-todo` |
