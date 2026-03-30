import PptxGenJS from 'pptxgenjs';

const pptx = new PptxGenJS();

// ── 테마 컬러 ──
const C = {
  bg:       '0A0A0F',
  bgCard:   '10101A',
  purple:   '5B40FF',
  purpleL:  'A78BFA',
  white:    'E8E8F0',
  dim:      '888899',
  gold:     'F59E0B',
  green:    '34D399',
  red:      'F87171',
  border:   '2A2A40',
};

// ── 공통 배경 적용 ──
function applyBg(slide) {
  slide.background = { color: C.bg };
  // 상단 보라 그라데이션 바
  slide.addShape(pptx.ShapeType.rect, {
    x: 0, y: 0, w: '100%', h: 0.06,
    fill: { color: C.purple },
    line: { type: 'none' },
  });
}

// ── 레이블(작은 보라 태그) ──
function addLabel(slide, text, y = 0.5) {
  slide.addText(text, {
    x: 0.5, y, w: 9, h: 0.35,
    fontSize: 10, bold: true, color: C.purple,
    charSpacing: 3, align: 'center',
  });
}

// ── 카드 박스 ──
function addCard(slide, opts) {
  slide.addShape(pptx.ShapeType.roundRect, {
    x: opts.x, y: opts.y, w: opts.w, h: opts.h,
    fill: { color: C.bgCard },
    line: { color: C.border, width: 1 },
    rectRadius: 0.12,
  });
}

// ── 슬라이드별 기본 크기 ──
pptx.layout = 'LAYOUT_WIDE'; // 16:9

// ══════════════════════════════════════════════
// 슬라이드 1 — 타이틀
// ══════════════════════════════════════════════
{
  const s = pptx.addSlide();
  applyBg(s);

  // 배경 대각선 그라데이션 효과 느낌
  s.addShape(pptx.ShapeType.ellipse, {
    x: 1, y: -1.5, w: 8, h: 5,
    fill: { type: 'solid', color: C.purple, alpha: 85 },
    line: { type: 'none' },
  });

  addLabel(s, '⚠  경고 : 과도한 완벽함 포함  ⚠', 0.6);

  s.addText([
    { text: '손흥민이 ', options: { color: C.white } },
    { text: '역겨운', options: { color: C.purple } },
    { text: ' 이유', options: { color: C.white } },
  ], {
    x: 0.5, y: 1.1, w: 9, h: 1.4,
    fontSize: 54, bold: true, align: 'center',
  });

  s.addText('알면 알수록 더 역겨워지는 이 남자의 진실\n— 손흥민을 좋아하는 사람을 위한 30분짜리 고통 —', {
    x: 0.5, y: 2.65, w: 9, h: 0.9,
    fontSize: 14, color: C.dim, align: 'center', lineSpacingMultiple: 1.5,
  });

  // 3개 통계 카드
  const stats = [
    { v: '30분', u: '발표 시간' },
    { v: '∞',   u: '역겨움 지수' },
    { v: '0',   u: '변명의 여지' },
  ];
  stats.forEach((st, i) => {
    const x = 1.5 + i * 2.7;
    addCard(s, { x, y: 3.75, w: 2.4, h: 1.35 });
    s.addText(st.v, { x, y: 3.85, w: 2.4, h: 0.65, fontSize: 26, bold: true, color: C.purple, align: 'center' });
    s.addText(st.u, { x, y: 4.52, w: 2.4, h: 0.4,  fontSize: 11, color: C.dim, align: 'center' });
  });
}

// ══════════════════════════════════════════════
// 슬라이드 2 — 목차
// ══════════════════════════════════════════════
{
  const s = pptx.addSlide();
  applyBg(s);
  addLabel(s, 'AGENDA', 0.5);
  s.addText([
    { text: '오늘의 ', options: { color: C.white } },
    { text: '역겨움 목록', options: { color: C.purple } },
  ], { x: 0.5, y: 0.85, w: 9, h: 0.8, fontSize: 32, bold: true, align: 'center' });

  const parts = [
    { part: 'PART 1', title: '그는 대체 누구인가?',    sub: '기본 스펙 소개 (~5분)' },
    { part: 'PART 2', title: '말도 안 되는 성과들',   sub: '통계와 기록 (~7분)' },
    { part: 'PART 3', title: '인성까지 역겨운 이유',  sub: '인격과 인성 (~8분)' },
    { part: 'PART 4', title: '왜 우리는 희망이 없나', sub: '글로벌 영향력 + 결론 (~10분)' },
  ];

  const cols = [[0, 1], [2, 3]];
  cols.forEach(([a, b]) => {
    [a, b].forEach((idx) => {
      const col = idx % 2;
      const row = Math.floor(idx / 2);
      const x = 0.4 + col * 4.8;
      const y = 1.9 + row * 1.65;
      addCard(s, { x, y, w: 4.5, h: 1.45 });
      s.addText(parts[idx].part, { x: x+0.2, y: y+0.15, w: 4.1, h: 0.3, fontSize: 10, bold: true, color: C.purple, charSpacing: 2 });
      s.addText(parts[idx].title, { x: x+0.2, y: y+0.48, w: 4.1, h: 0.45, fontSize: 16, bold: true, color: C.white });
      s.addText(parts[idx].sub,   { x: x+0.2, y: y+0.95, w: 4.1, h: 0.3,  fontSize: 11, color: C.dim });
    });
  });
}

// ══════════════════════════════════════════════
// 슬라이드 3 — 기본 스펙
// ══════════════════════════════════════════════
{
  const s = pptx.addSlide();
  applyBg(s);
  addLabel(s, 'PART 1 — 기본 스펙', 0.5);
  s.addText([
    { text: '손흥민, ', options: { color: C.white } },
    { text: '이 남자가', options: { color: C.purple } },
    { text: ' 누구냐', options: { color: C.white } },
  ], { x: 0.5, y: 0.85, w: 9, h: 0.8, fontSize: 32, bold: true, align: 'center' });

  const items = [
    { emoji: '🇰🇷', v: '수원 출신',       u: '1992년 7월 8일생' },
    { emoji: '⚽', v: '토트넘 홋스퍼',    u: '2015년~ 주장' },
    { emoji: '🌍', v: '아시아 레전드',    u: 'EPL 최고 아시아 선수' },
  ];

  items.forEach((it, i) => {
    const x = 0.5 + i * 3.2;
    addCard(s, { x, y: 1.85, w: 3, h: 1.6 });
    s.addText(it.emoji, { x, y: 1.95, w: 3, h: 0.55, fontSize: 28, align: 'center' });
    s.addText(it.v,     { x, y: 2.52, w: 3, h: 0.45, fontSize: 15, bold: true, color: C.white, align: 'center' });
    s.addText(it.u,     { x, y: 2.97, w: 3, h: 0.3,  fontSize: 11, color: C.dim, align: 'center' });
  });

  s.addText('함부르크 유스 → 함부르크 1군 → 레버쿠젠 → 토트넘\n"그냥 축구 좀 잘하는 한국인"이라고 생각했다면... 이 발표가 끝날 때까지 후회하게 될 것입니다.', {
    x: 0.5, y: 3.7, w: 9, h: 0.9, fontSize: 13, color: C.dim, align: 'center', lineSpacingMultiple: 1.5,
  });
}

// ══════════════════════════════════════════════
// 슬라이드 4 — 아버지 손웅정
// ══════════════════════════════════════════════
{
  const s = pptx.addSlide();
  applyBg(s);
  addLabel(s, '역겨운 이유 #1', 0.5);
  s.addText([
    { text: '아버지가 ', options: { color: C.white } },
    { text: '손웅정', options: { color: C.purple } },
    { text: '이다', options: { color: C.white } },
  ], { x: 0.5, y: 0.85, w: 9, h: 0.8, fontSize: 32, bold: true, align: 'center' });

  const reasons = [
    { num: '#1', text: '전 프로축구 선수 아버지가 직접 코치가 되어 어린 시절부터 1:1 맞춤 훈련 진행. 일반인은 돈을 줘도 받을 수 없는 시스템.' },
    { num: '#2', text: '만 12세에 독일 함부르크 유소년팀 입단 — 부모와 떨어져 혼자 독일에서 적응. 평범한 12살이 할 수 있는 일이 아님.' },
    { num: '#3', text: '손웅정 감독은 "화려함보다 기본기"를 강조, 어린 흥민이의 양발 능력을 일찍부터 개발. 이게 훗날 EPL 황금부츠의 씨앗.' },
    { num: '#4', text: '단순히 운이 좋은 게 아니다. 설계된 천재인데 노력까지 했다는 것이 역겨운 이유.' },
  ];

  reasons.forEach((r, i) => {
    const y = 1.85 + i * 0.85;
    addCard(s, { x: 0.5, y, w: 9, h: 0.75 });
    s.addText(r.num, { x: 0.65, y: y+0.12, w: 0.55, h: 0.45, fontSize: 10, bold: true, color: C.purple, align: 'center',
      fill: { color: '1A1428' }, line: { color: C.purple, width: 1 }, rectRadius: 0.06 });
    s.addText(r.text, { x: 1.35, y: y+0.1, w: 7.8, h: 0.55, fontSize: 13, color: C.white, lineSpacingMultiple: 1.4 });
  });
}

// ══════════════════════════════════════════════
// 슬라이드 5 — EPL 황금부츠
// ══════════════════════════════════════════════
{
  const s = pptx.addSlide();
  applyBg(s);
  addLabel(s, 'PART 2 — 말도 안 되는 성과', 0.5);
  s.addText('2022 EPL 황금부츠', {
    x: 0.5, y: 0.85, w: 9, h: 0.65, fontSize: 36, bold: true, color: C.gold, align: 'center',
  });
  s.addText('아시아 선수 역사상 최초', {
    x: 0.5, y: 1.5, w: 9, h: 0.45, fontSize: 18, color: C.white, align: 'center',
  });

  const stats = [
    { v: '23골',  u: '2021-22 EPL 득점 (공동 1위)' },
    { v: '1위',   u: '아시아 선수 최초 황금부츠', gold: true },
    { v: '살라흐', u: '공동 수상자 (23골)' },
    { v: '100%',  u: '역겨움 달성률' },
  ];

  stats.forEach((st, i) => {
    const col = i % 2, row = Math.floor(i / 2);
    const x = 0.6 + col * 4.7;
    const y = 2.15 + row * 1.5;
    addCard(s, { x, y, w: 4.3, h: 1.3 });
    s.addText(st.v, { x, y: y+0.12, w: 4.3, h: 0.65, fontSize: 28, bold: true, color: st.gold ? C.gold : C.purple, align: 'center' });
    s.addText(st.u, { x, y: y+0.82, w: 4.3, h: 0.35, fontSize: 11, color: C.dim, align: 'center' });
  });
}

// ══════════════════════════════════════════════
// 슬라이드 6 — 통계 수치
// ══════════════════════════════════════════════
{
  const s = pptx.addSlide();
  applyBg(s);
  addLabel(s, '역겨운 이유 #2 — 통계', 0.5);
  s.addText([
    { text: '이 ', options: { color: C.white } },
    { text: '숫자들', options: { color: C.purple } },
    { text: '을 보십시오', options: { color: C.white } },
  ], { x: 0.5, y: 0.85, w: 9, h: 0.7, fontSize: 32, bold: true, align: 'center' });

  const nums = [
    { v: '170+', u: 'EPL 통산 골 (진행 중)' },
    { v: '100+', u: '대한민국 A매치 출전' },
    { v: '50+',  u: '국가대표 통산 골' },
    { v: '13+',  u: 'EPL 활동 시즌' },
    { v: '양발',  u: '왼발·오른발 모두 수준급' },
    { v: '만점',  u: '팬 비율 (국내외 통합)', green: true },
  ];

  nums.forEach((n, i) => {
    const col = i % 3, row = Math.floor(i / 3);
    const x = 0.35 + col * 3.1;
    const y = 1.8 + row * 1.5;
    addCard(s, { x, y, w: 2.9, h: 1.3 });
    s.addText(n.v, { x, y: y+0.1, w: 2.9, h: 0.7, fontSize: 28, bold: true, color: n.green ? C.green : C.purple, align: 'center' });
    s.addText(n.u, { x, y: y+0.85, w: 2.9, h: 0.35, fontSize: 11, color: C.dim, align: 'center' });
  });
}

// ══════════════════════════════════════════════
// 슬라이드 7 — UCL 여정
// ══════════════════════════════════════════════
{
  const s = pptx.addSlide();
  applyBg(s);
  addLabel(s, '역겨운 이유 #3', 0.5);
  s.addText([
    { text: 'UCL 결승 진출, ', options: { color: C.white } },
    { text: '그 역겨운 여정', options: { color: C.purple } },
  ], { x: 0.5, y: 0.85, w: 9, h: 0.7, fontSize: 32, bold: true, align: 'center' });

  const tl = [
    { y: 1.9,  emoji: '🏆', year: '2018-19 UCL 8강', text: '맨시티 원정 — 오른팔 골절 부상 중에 출전해 해트트릭. 부상 중에 해트트릭이라는 인간 한계를 초월한 기록.' },
    { y: 3.05, emoji: '⚡', year: '2019 UCL 4강',    text: '아약스 원정. 구단 역사상 첫 결승 진출에 핵심 기여. 유럽 전체가 토트넘을 주목하기 시작한 순간.' },
    { y: 4.2,  emoji: '🌟', year: '2019 UCL 결승',   text: '리버풀과의 결승에서 페널티킥 득점. 비록 준우승이지만 아시아 선수 UCL 결승 득점은 역사에 영원히 기록.' },
  ];

  tl.forEach((t) => {
    // 연결선
    if (t.y < 4.2) {
      s.addShape(pptx.ShapeType.line, {
        x: 0.93, y: t.y + 0.55, w: 0, h: 0.85,
        line: { color: C.purple, width: 1, dashType: 'dash' },
      });
    }
    // 도트
    s.addShape(pptx.ShapeType.ellipse, {
      x: 0.68, y: t.y + 0.02, w: 0.5, h: 0.5,
      fill: { color: '1A1040' },
      line: { color: C.purple, width: 2 },
    });
    s.addText(t.emoji, { x: 0.68, y: t.y + 0.02, w: 0.5, h: 0.5, fontSize: 18, align: 'center' });

    addCard(s, { x: 1.35, y: t.y, w: 8.15, h: 0.85 });
    s.addText(t.year, { x: 1.5, y: t.y + 0.08, w: 8, h: 0.28, fontSize: 11, bold: true, color: C.purple, charSpacing: 1 });
    s.addText(t.text, { x: 1.5, y: t.y + 0.38, w: 7.9, h: 0.38, fontSize: 12, color: C.white, lineSpacingMultiple: 1.3 });
  });
}

// ══════════════════════════════════════════════
// 슬라이드 8 — 군복무
// ══════════════════════════════════════════════
{
  const s = pptx.addSlide();
  applyBg(s);
  addLabel(s, '역겨운 이유 #4', 0.5);
  s.addText([
    { text: '군대', options: { color: C.red } },
    { text: '도 ', options: { color: C.white } },
    { text: '역겨운 사람', options: { color: C.purple } },
  ], { x: 0.5, y: 0.85, w: 9, h: 0.7, fontSize: 32, bold: true, align: 'center' });

  s.addText('🪖', { x: 4.3, y: 1.55, w: 1.4, h: 1, fontSize: 48, align: 'center' });

  const rows = [
    { num: '배경', text: '한국 남성은 의무 군복무. 축구 선수에게 전성기 2년은 커리어의 절반. 일반인도 힘든 군대를 어떻게 소화했을까.' },
    { num: '2018', text: '아시안게임 금메달로 병역특례 획득 — 그런데 이마저도 "땀 흘려 싸워서" 얻은 것. 군복무를 자청해서 신청한 성실함.' },
    { num: '결론', text: '복무 기간에도 꾸준한 체력 관리. 복귀 후 퍼포먼스 전혀 저하 없음. 복귀 즉시 팀 에이스 복귀. 이게 사람이냐.' },
  ];

  rows.forEach((r, i) => {
    const y = 2.65 + i * 0.9;
    addCard(s, { x: 0.5, y, w: 9, h: 0.78 });
    s.addText(r.num, { x: 0.65, y: y+0.14, w: 0.7, h: 0.42, fontSize: 10, bold: true, color: C.purple, align: 'center',
      fill: { color: '1A1428' }, line: { color: C.purple, width: 1 }, rectRadius: 0.06 });
    s.addText(r.text, { x: 1.5, y: y+0.12, w: 7.7, h: 0.55, fontSize: 13, color: C.white, lineSpacingMultiple: 1.4 });
  });
}

// ══════════════════════════════════════════════
// 슬라이드 9 — 인성
// ══════════════════════════════════════════════
{
  const s = pptx.addSlide();
  applyBg(s);
  addLabel(s, 'PART 3 — 인성까지 역겨운 이유', 0.5);
  s.addText([
    { text: '실력은 그렇다 쳐도 ', options: { color: C.white } },
    { text: '인성은 왜 좋아', options: { color: C.red } },
  ], { x: 0.5, y: 0.85, w: 9, h: 0.7, fontSize: 28, bold: true, align: 'center' });

  const items = [
    { num: '팀워크', text: '동료 골에 본인 골만큼 기뻐한다. 팬들이 뽑은 "같이 뛰고 싶은 선수 1위". 개인 욕심 없이 팀 플레이를 먼저 생각.' },
    { num: '팬 사랑', text: '경기 후 어린이 팬들에게 항상 사인과 사진. 훈련 끝나고 팬들이 기다리는 걸 알면 절대 그냥 안 지나친다. 배우 급 외모에 성격까지 이럴 필요는 없다.' },
    { num: '겸손', text: '"아직 부족하다"는 말을 10년째 하고 있다. 황금부츠 받은 날도 "팀 덕분"이라고 말함. 본인이 역겨운 걸 모르는 척한다.' },
    { num: '기부', text: '개인 기부 및 사회 공헌 지속적으로 이어가고 있음. 화려하게 알리지 않아서 더 역겹다.' },
  ];

  items.forEach((r, i) => {
    const y = 1.8 + i * 0.82;
    addCard(s, { x: 0.5, y, w: 9, h: 0.72 });
    s.addText(r.num, { x: 0.65, y: y+0.13, w: 0.85, h: 0.4, fontSize: 10, bold: true, color: C.purple, align: 'center',
      fill: { color: '1A1428' }, line: { color: C.purple, width: 1 }, rectRadius: 0.06 });
    s.addText(r.text, { x: 1.65, y: y+0.1, w: 7.6, h: 0.52, fontSize: 13, color: C.white, lineSpacingMultiple: 1.35 });
  });
}

// ══════════════════════════════════════════════
// 슬라이드 10 — 웃음
// ══════════════════════════════════════════════
{
  const s = pptx.addSlide();
  applyBg(s);
  addLabel(s, '역겨운 이유 #5', 0.5);
  s.addText([
    { text: '저 ', options: { color: C.white } },
    { text: '웃음', options: { color: C.purple } },
    { text: '은 무슨 무기냐', options: { color: C.white } },
  ], { x: 0.5, y: 0.85, w: 9, h: 0.7, fontSize: 32, bold: true, align: 'center' });

  // 인용구 박스
  addCard(s, { x: 0.8, y: 1.75, w: 8.4, h: 1.2 });
  s.addText('"', { x: 0.9, y: 1.7, w: 0.6, h: 0.8, fontSize: 60, color: C.purple, bold: true });
  s.addText('손흥민이 웃으면 상대 수비수도 흔들린다는 설이 있다.\n근거: 실제로 자꾸 웃으면서 드리블하다가 골 넣음.', {
    x: 1.5, y: 1.85, w: 7.3, h: 0.9, fontSize: 15, color: C.white, italic: true, lineSpacingMultiple: 1.5, align: 'center',
  });

  const moods = [
    { e: '😄', u: '골 세리머니: 항상 웃음' },
    { e: '😄', u: '실수 후에도: 웃으며 박수' },
    { e: '😄', u: '인터뷰 중: 계속 웃음' },
    { e: '😤', u: '시청자 반응: 짜증 남' },
  ];

  moods.forEach((m, i) => {
    const x = 0.6 + i * 2.25;
    addCard(s, { x, y: 3.15, w: 2.05, h: 1.2 });
    s.addText(m.e, { x, y: 3.2, w: 2.05, h: 0.6, fontSize: 28, align: 'center' });
    s.addText(m.u, { x, y: 3.82, w: 2.05, h: 0.45, fontSize: 10, color: C.dim, align: 'center' });
  });
}

// ══════════════════════════════════════════════
// 슬라이드 11 — 비교표
// ══════════════════════════════════════════════
{
  const s = pptx.addSlide();
  applyBg(s);
  addLabel(s, '역겨운 이유 #6', 0.5);
  s.addText([
    { text: '다른 선수들과 ', options: { color: C.white } },
    { text: '비교', options: { color: C.purple } },
    { text: '해보자', options: { color: C.white } },
  ], { x: 0.5, y: 0.85, w: 9, h: 0.7, fontSize: 32, bold: true, align: 'center' });

  // 표 헤더
  const hdrY = 1.8;
  ['항목', '일반 선수', '손흥민'].forEach((h, i) => {
    const x = [0.5, 3.4, 6.5][i];
    const w = [2.7, 2.9, 2.9][i];
    s.addText(h, { x, y: hdrY, w, h: 0.38, fontSize: 12, bold: true, color: C.dim, align: 'center', charSpacing: 2 });
  });

  const rows = [
    ['부상 후 복귀',      '수개월 재활',         '부상 중에 골 넣음'],
    ['국가대표 의무',     '클럽 눈치 봄',         '항상 100% 출전'],
    ['나이 들면',        '퍼포먼스 저하',         '30대에 황금부츠'],
    ['돈 많이 벌면',     '동기부여 감소',         '그래도 열심히'],
    ['유명해지면',       '팬 무시 가능',          '여전히 팬 챙김'],
  ];

  rows.forEach((row, i) => {
    const y = 2.28 + i * 0.62;
    const cols = [
      { x: 0.5, w: 2.7, color: C.white, align: 'left'   },
      { x: 3.4, w: 2.9, color: C.dim,   align: 'center' },
      { x: 6.5, w: 2.9, color: C.purple,align: 'center' },
    ];
    cols.forEach((c, j) => {
      addCard(s, { x: c.x, y: y+0.02, w: c.w, h: 0.52 });
      s.addText(row[j], { x: c.x+0.15, y: y+0.1, w: c.w-0.3, h: 0.35, fontSize: 13, color: c.color, align: c.align, bold: j===2 });
    });
  });
}

// ══════════════════════════════════════════════
// 슬라이드 12 — 글로벌 영향력
// ══════════════════════════════════════════════
{
  const s = pptx.addSlide();
  applyBg(s);
  addLabel(s, 'PART 4 — 글로벌 영향력', 0.5);
  s.addText([
    { text: '한국을 ', options: { color: C.white } },
    { text: '세계 지도', options: { color: C.purple } },
    { text: '에 올린 남자', options: { color: C.white } },
  ], { x: 0.5, y: 0.85, w: 9, h: 0.7, fontSize: 32, bold: true, align: 'center' });

  const items = [
    { e: '🌐', v: 'SNS 수천만',        u: '팔로워 (인스타그램 기준)' },
    { e: '🎤', v: '영어·독어·한국어', u: '3개 국어 능숙' },
    { e: '🏅', v: '대한민국 체육훈장', u: '청룡장 수훈' },
    { e: '📺', v: 'EPL 중계',          u: '한국 시청률 폭발의 주범' },
    { e: '🇰🇷', v: '국격 상승',        u: '외국인이 한국을 좋아하는 이유' },
    { e: '👦', v: '세대 롤모델',        u: '한국 청소년 꿈 1위' },
  ];

  items.forEach((it, i) => {
    const col = i % 3, row = Math.floor(i / 3);
    const x = 0.35 + col * 3.1;
    const y = 1.8 + row * 1.55;
    addCard(s, { x, y, w: 2.9, h: 1.35 });
    s.addText(it.e, { x, y: y+0.08, w: 2.9, h: 0.5, fontSize: 26, align: 'center' });
    s.addText(it.v, { x, y: y+0.6,  w: 2.9, h: 0.42, fontSize: 14, bold: true, color: C.white, align: 'center' });
    s.addText(it.u, { x, y: y+1.0,  w: 2.9, h: 0.28, fontSize: 10, color: C.dim, align: 'center' });
  });
}

// ══════════════════════════════════════════════
// 슬라이드 13 — 명언
// ══════════════════════════════════════════════
{
  const s = pptx.addSlide();
  applyBg(s);
  addLabel(s, '역겨운 이유 #7 — 그가 한 말들', 0.5);
  s.addText([
    { text: '명언도 ', options: { color: C.white } },
    { text: '역겨운 남자', options: { color: C.purple } },
  ], { x: 0.5, y: 0.85, w: 9, h: 0.7, fontSize: 32, bold: true, align: 'center' });

  s.addText('"', { x: 0.7, y: 1.8, w: 0.8, h: 1.2, fontSize: 96, color: C.purple, bold: true });

  s.addText('저는 항상 어제보다 더 나은 오늘을 꿈꿉니다.\n그게 저를 움직이는 힘이에요.', {
    x: 1.4, y: 2.1, w: 7.5, h: 1.4,
    fontSize: 24, italic: true, color: C.white, align: 'center', lineSpacingMultiple: 1.6,
  });

  s.addText('— 손흥민', { x: 0.5, y: 3.7, w: 9, h: 0.4, fontSize: 13, color: C.dim, align: 'center' });

  addCard(s, { x: 1.5, y: 4.2, w: 7, h: 0.7 });
  s.addText('실력도 있고 인성도 있고 명언까지 있다. 이건 불공평하다.', {
    x: 1.5, y: 4.28, w: 7, h: 0.5, fontSize: 14, color: C.red, align: 'center', bold: true,
  });
}

// ══════════════════════════════════════════════
// 슬라이드 14 — 역겨움 지수
// ══════════════════════════════════════════════
{
  const s = pptx.addSlide();
  applyBg(s);
  addLabel(s, '종합 분석', 0.5);
  s.addText([
    { text: '역겨움 지수 ', options: { color: C.white } },
    { text: '최종 산출', options: { color: C.purple } },
  ], { x: 0.5, y: 0.85, w: 9, h: 0.7, fontSize: 32, bold: true, align: 'center' });

  const bars = [
    { label: '실력 (기술·골·어시스트)',  val: 99, color: C.purple, display: '99.9 / 100' },
    { label: '인성 (팬·동료·겸손)',      val: 100, color: C.gold,   display: '100 / 100' },
    { label: '외모 (팬 기준)',            val: 97,  color: C.red,    display: '역겹게 잘생김' },
    { label: '전체 역겨움 지수',          val: 100, color: C.white,  display: '💀 측정 불가' },
  ];

  bars.forEach((b, i) => {
    const y = 1.85 + i * 1.05;
    addCard(s, { x: 0.5, y, w: 9, h: 0.9 });
    s.addText(b.label, { x: 0.75, y: y+0.1, w: 5.5, h: 0.3, fontSize: 13, bold: true, color: C.white });
    s.addText(b.display, { x: 6.3, y: y+0.1, w: 2.8, h: 0.3, fontSize: 13, bold: true, color: b.color, align: 'right' });
    // 배경 바
    s.addShape(pptx.ShapeType.roundRect, {
      x: 0.75, y: y+0.52, w: 8.3, h: 0.2,
      fill: { color: '1E1E32' }, line: { type: 'none' }, rectRadius: 0.1,
    });
    // 채워진 바
    s.addShape(pptx.ShapeType.roundRect, {
      x: 0.75, y: y+0.52, w: 8.3 * b.val / 100, h: 0.2,
      fill: { color: b.color }, line: { type: 'none' }, rectRadius: 0.1,
    });
  });
}

// ══════════════════════════════════════════════
// 슬라이드 15 — 결론
// ══════════════════════════════════════════════
{
  const s = pptx.addSlide();
  applyBg(s);
  addLabel(s, '결론', 0.5);
  s.addText([
    { text: '그래서 손흥민은 ', options: { color: C.white } },
    { text: '왜 역겨운가', options: { color: C.purple } },
  ], { x: 0.5, y: 0.85, w: 9, h: 0.7, fontSize: 32, bold: true, align: 'center' });

  const conclusions = [
    { num: '이유 1', text: '타고난 재능에 노력까지 했다 — 공평하지 않다', red: true },
    { num: '이유 2', text: 'EPL 황금부츠를 아시아 선수 최초로 받았다 — 우리가 못 받을 걸 받았다', red: true },
    { num: '이유 3', text: '실력 좋은 건 참겠는데 인성까지 좋다 — 말이 안 된다', red: true },
    { num: '이유 4', text: '잘생기기까지 했다 — 이건 진짜 역겹다', red: true },
    { num: '이유 5', text: '한국인이라 미울 수도 없다 — 그래서 더 역겹다', purple: true },
  ];

  conclusions.forEach((r, i) => {
    const y = 1.8 + i * 0.78;
    addCard(s, { x: 0.5, y, w: 9, h: 0.68 });
    s.addText(r.num, { x: 0.65, y: y+0.12, w: 0.9, h: 0.38, fontSize: 10, bold: true, color: C.purple, align: 'center',
      fill: { color: '1A1428' }, line: { color: C.purple, width: 1 }, rectRadius: 0.06 });
    s.addText(r.text, {
      x: 1.7, y: y+0.1, w: 7.5, h: 0.48, fontSize: 14, color: r.purple ? C.purple : r.red ? C.red : C.white,
      lineSpacingMultiple: 1.3,
    });
  });
}

// ══════════════════════════════════════════════
// 슬라이드 16 — 마무리
// ══════════════════════════════════════════════
{
  const s = pptx.addSlide();
  applyBg(s);

  s.addShape(pptx.ShapeType.ellipse, {
    x: 2, y: -1, w: 6, h: 5,
    fill: { type: 'solid', color: C.purple, alpha: 88 },
    line: { type: 'none' },
  });

  s.addText('🙏', { x: 4.25, y: 0.5, w: 1.5, h: 1, fontSize: 52, align: 'center' });
  addLabel(s, '마무리', 1.55);

  s.addText('손흥민, 우리가', {
    x: 0.5, y: 1.9, w: 9, h: 0.65, fontSize: 38, bold: true, color: C.white, align: 'center',
  });
  s.addText('역겨울 정도로', {
    x: 0.5, y: 2.55, w: 9, h: 0.65, fontSize: 38, bold: true, color: C.purple, align: 'center',
  });
  s.addText('자랑스럽습니다', {
    x: 0.5, y: 3.2, w: 9, h: 0.65, fontSize: 38, bold: true, color: C.white, align: 'center',
  });

  s.addText('30분 동안 역겨움을 들어주셔서 감사합니다.\n앞으로도 더 많이 역겨워지기를 응원합니다.', {
    x: 1, y: 4.0, w: 8, h: 0.75, fontSize: 14, color: C.dim, align: 'center', lineSpacingMultiple: 1.6,
  });

  const last = [
    { e: '⚽', u: '더 많은 골을' },
    { e: '🏆', u: '더 많은 우승을' },
    { e: '😄', u: '더 많은 웃음을' },
  ];
  last.forEach((l, i) => {
    const x = 1.5 + i * 2.5;
    addCard(s, { x, y: 4.85, w: 2.3, h: 1.1 });
    s.addText(l.e, { x, y: 4.9, w: 2.3, h: 0.5, fontSize: 24, align: 'center' });
    s.addText(l.u, { x, y: 5.42, w: 2.3, h: 0.35, fontSize: 11, color: C.dim, align: 'center' });
  });
}

// ── 저장 ──
await pptx.writeFile({ fileName: 'son-presentation.pptx' });
console.log('✅ son-presentation.pptx 생성 완료!');
