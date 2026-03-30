---
name: todo2.html 아키텍처 설계 결정사항
description: todo2.html 구현 시 적용된 레이어 분리 패턴 및 재사용 가능한 설계 결정
type: project
---

## todo2.html 구현 아키텍처

### 레이어 구조 (5-layer 패턴)
1. **State** — 단순 객체, 앱 전체 상태 단일 소유
2. **Repository** — localStorage 읽기/쓰기 캡슐화, try-catch 오류 처리
3. **DomainService** — 순수 함수만 포함, DOM 의존성 없음 (calcDDay, calcProgress, sortActiveTodos 등)
4. **View** — DOM 조작 전담, `els` 객체로 DOM 참조 캐시, DocumentFragment로 대량 렌더링
5. **Controller** — 이벤트 바인딩 및 레이어 간 조율, `persist()` 메서드로 저장+렌더 일원화

### 핵심 패턴
- **이벤트 위임**: `.filter-row`, `todoList`, `doneList` 각각에 단일 click 핸들러
- **상태 주도 렌더링**: 모든 UI 변경은 State → View.render(State) 흐름 통일
- **XSS 방지**: escapeHtml() 후 mark 태그 삽입 방식으로 검색 하이라이트 처리
- **D-Day 계산**: 시간대 오차 방지를 위해 `new Date(dueDate + 'T00:00:00')` 로컬 자정 기준 파싱

### 데이터 모델
```js
{ id, text, done, priority, importance, tag, dueDate, createdAt }
localStorage 키: 'linear-todos-v2'
importance 기본값: 'normal' / 가능한 값: 'critical' | 'normal' | 'minor'
```

### 마이그레이션 패턴
- `DomainService.migrate(todos)`: `{ importance: 'normal', ...t }` spread로 멱등성 보장
- Controller.init()에서 Repository.load() 직후 migrate() 호출

### 중요도(importance) 기능 설계
- 입력 영역: options-row 두 번째 행에 importance-group 배치 (우선순위 행과 분리)
- 아이템 뱃지: `critical`만 주황 뱃지 표시 — `normal`/`minor`는 숨김 (노이즈 최소화 원칙)
- 필터: filter-row 끝에 구분선 후 `[중요만]` 버튼 단일 추가 (토글 방식)
- CSS 변수: `--color-importance-critical: #ff9f0a`, `--color-importance-minor: #636366`

### 마감일 기능 확장 (추가됨)
- **인라인 마감일 편집**: State.editingDueDateId(null|id) 추적, 전체 재렌더 대신 View.openDayEdit()으로 해당 DOM만 교체
  - 편집 확인/취소 후에는 State 초기화 → persist()/render() 호출로 전체 동기화
  - 날짜 input focus는 `setTimeout(fn, 0)` 패턴 적용 (DOM 삽입 직후 타이밍 문제)
  - 마감일 없는 항목은 `+ 마감일` 버튼(.dday-add-btn), 있는 항목은 연필 아이콘(.dday-edit-btn) — 호버 시만 노출
  - `DomainService.updateDueDate()`: map으로 불변성 유지하며 배열 업데이트
- **마감일 필터**: data-duefilter="today"|"overdue" 속성, 토글 방식, 진행 중 항목에만 적용
  - 오늘 마감 활성 색: #ffd60a, 기한 초과 활성 색: #ff453a
- **기한 초과 강조**: `.todo-item--overdue` 클래스 조건부 적용 (완료 항목 제외)
  - border-left: 2px solid rgba(255,69,58,0.45), background: rgba(255,69,58,0.03)

### 정렬 전략
- 진행 중: PRIORITY_ORDER { high:0, medium:1, low:2 } 오름차순 정렬
- 완료: 별도 섹션, 접힘/펼침 토글로 하단 분리
- 상태 필터 'active'일 때 완료 섹션 전체 숨김

**Why:** 기존 todo.html의 단일 스크립트 구조를 레이어 분리 패턴으로 발전시킴
**How to apply:** 이후 유사 할일/관리 앱 작성 시 동일 5-layer 패턴 재사용 가능
