# [Design] my-todo

**Feature**: my-todo
**File**: `my-todo.html`
**Date**: 2026-03-27
**Phase**: Design
**Architecture**: Option A — 직접 치환 (최소 변경)

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

## 1. 개요

`todo.html`을 기반으로 두 가지만 변경한 새 파일 `my-todo.html`을 생성한다.

| 변경 항목 | 기존 값 | 변경 값 |
|-----------|---------|---------|
| 액센트 색상 | `#2563eb` (파란) | `#5b40ff` (보라) |
| 그라디언트 끝 색상 | `#3b82f6` | `#6d5aff` |
| rgba 액센트 | `rgba(37, 99, 235, …)` | `rgba(91, 64, 255, …)` |
| localStorage 키 | `'linear-todos'` | `'my-todos'` |

그 외 HTML 구조, CSS 레이아웃, JS 로직은 **todo.html과 100% 동일**하게 유지한다.

---

## 2. 색상 치환 명세

### 2.1 치환 대상 전체 목록

todo.html 내 파란색 관련 값과 치환 결과:

| 원본 값 | 치환 값 | 용도 |
|---------|---------|------|
| `#2563eb` | `#5b40ff` | 주요 액센트 (단독 hex) |
| `#3b82f6` | `#6d5aff` | 밝은 액센트 / 그라디언트 끝 |
| `rgba(37, 99, 235, 0.1)` | `rgba(91, 64, 255, 0.1)` | body 배경 그라디언트 글로우 |
| `rgba(37, 99, 235, 0.45)` | `rgba(91, 64, 255, 0.45)` | 입력창 포커스 border |
| `rgba(37, 99, 235, 0.1)` | `rgba(91, 64, 255, 0.1)` | 입력창 포커스 box-shadow |
| `rgba(37, 99, 235, 0.15)` | `rgba(91, 64, 255, 0.15)` | 타이틀 아이콘 / 추가버튼 / 필터 bg |
| `rgba(37, 99, 235, 0.25)` | `rgba(91, 64, 255, 0.25)` | 타이틀 아이콘 / 추가버튼 border |
| `rgba(37, 99, 235, 0.4)` | `rgba(91, 64, 255, 0.4)` | 추가버튼 호버 border |
| `rgba(37, 99, 235, 0.12)` | `rgba(91, 64, 255, 0.12)` | 필터 active bg |
| `rgba(37, 99, 235, 0.2)` | `rgba(91, 64, 255, 0.2)` | 필터 active border |
| `rgba(37, 99, 235, 0.08)` | `rgba(91, 64, 255, 0.08)` | 체크박스 호버 bg |
| `rgba(37, 99, 235, 0.5)` | `rgba(91, 64, 255, 0.5)` | 체크박스 호버 border |
| `rgba(37, 99, 235, 0.4)` | `rgba(91, 64, 255, 0.4)` | 체크박스 완료 box-shadow |
| `rgba(96, 165, 250, 0.9)` | `rgba(167, 139, 250, 0.9)` | 아이콘 / 텍스트 밝은 보라 |
| `linear-gradient(90deg, transparent, rgba(37, 99, 235, 0.8), transparent)` | `linear-gradient(90deg, transparent, rgba(91, 64, 255, 0.8), transparent)` | container 상단 라인 |
| `linear-gradient(135deg, #2563eb, #3b82f6)` | `linear-gradient(135deg, #5b40ff, #6d5aff)` | 체크박스 완료 배경 |

### 2.2 색상 대응표 요약

| 역할 | 기존 (파란) | 변경 (보라) |
|------|------------|------------|
| 주 액센트 | `#2563eb` | `#5b40ff` |
| 밝은 액센트 | `#3b82f6` | `#6d5aff` |
| 텍스트 강조 | `rgba(96,165,250,0.9)` | `rgba(167,139,250,0.9)` |
| 글로우 RGB | `37, 99, 235` | `91, 64, 255` |

---

## 3. JS 변경 명세

JS 로직은 **한 줄만 변경**한다:

```js
// 변경 전 (todo.html)
let todos = JSON.parse(localStorage.getItem('linear-todos') || '[]');

// 변경 후 (my-todo.html)
let todos = JSON.parse(localStorage.getItem('my-todos') || '[]');
```

그 외 `save()` 함수:

```js
// 변경 전
localStorage.setItem('linear-todos', JSON.stringify(todos));

// 변경 후
localStorage.setItem('my-todos', JSON.stringify(todos));
```

---

## 4. HTML 변경 명세

| 항목 | 기존 | 변경 |
|------|------|------|
| `<title>` | `Todo` | `My Todo` |
| `<html lang>` | `ko` | `ko` (동일) |
| input placeholder | `새 할 일 추가...` | `새 할 일 추가...` (동일) |

---

## 5. 파일 구조

```
my-todo.html          ← 단일 파일 (CSS·JS 내장)
  ├── <style>         ← todo.html CSS + 색상 치환
  ├── <body>          ← todo.html HTML (title 변경)
  └── <script>        ← todo.html JS + localStorage 키 변경
```

---

## 6. 성공 기준 추적

| SC # | 기준 | 구현 방법 |
|------|------|-----------|
| SC-01 | CRUD 정상 동작 | JS 로직 100% 동일 유지 |
| SC-02 | 필터 전환 | JS 로직 100% 동일 유지 |
| SC-03 | localStorage 영속성 | 키 `my-todos`로 변경 |
| SC-04 | 보라 액센트 적용 | 2.1 색상 치환 명세 적용 |
| SC-05 | 데이터 독립 | localStorage 키 분리 |
| SC-06 | 빈 텍스트 방지 | JS 로직 동일 유지 (`if (!text) return`) |

---

## 7. 리스크 대응

| 리스크 | 대응 |
|--------|------|
| `rgba(37,99,235,…)` 공백 표기 혼재 | 공백 유무 모두 치환 확인 |
| `rgba(96,165,250,…)` 누락 | 밝은 파란색도 보라 계열로 치환 |
| localStorage 키 누락 | `getItem`·`setItem` 두 곳 모두 변경 |

---

## 8. 구현 가이드

### 8.1 Session Guide (단일 모듈)

| 모듈 | 작업 | 예상 |
|------|------|------|
| M-1 | todo.html 전체 복사 후 색상 치환 + localStorage 키 변경 | ~5분 |

### 8.2 구현 순서

1. `todo.html` 전체 내용을 `my-todo.html`로 복사
2. `<title>` → `My Todo` 변경
3. 색상 치환: 섹션 2.1 대응표 기준으로 모든 파란 계열 → 보라 계열
4. localStorage 키: `linear-todos` → `my-todos` (2곳)
5. 브라우저에서 열어 SC-01 ~ SC-06 확인

---

## 9. 다음 단계

| 단계 | 명령 |
|------|------|
| 구현 | `/pdca do my-todo` |
| 검증 | `/pdca analyze my-todo` |
