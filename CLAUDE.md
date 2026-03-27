# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Static HTML/CSS/JS web apps with a Linear-inspired dark UI theme. No build tools or dependencies — files run directly in the browser.

## Files

- `calculator.html` — Four-function calculator with keyboard support
- `todo.html` — Todo list with filters, inline editing, and localStorage persistence

## Running

Open any file directly in a browser:
```bash
start calculator.html
start todo.html
```

## Design System

All files share a consistent visual language:
- Background: `#0a0a0f`
- Primary accent: `#5b40ff` (purple)
- Cards: `rgba(16, 16, 26, 0.95)` with `border: 1px solid rgba(255,255,255,0.07)`
- Border radius: `12px` (buttons/inputs), `20px` (containers)
- Font: system `-apple-system, BlinkMacSystemFont, 'Inter', 'Segoe UI'`

When adding new pages, follow the same dark theme and purple accent convention.

## 응답 지침

- 모든 설명과 결과값은 **한국어**로 작성
- 코드 주석도 한국어로 작성
- 파일명·변수명·CSS 클래스명은 영어 유지
- 오류 메시지나 UI 텍스트는 한국어로 작성
