---
name: fastapi
description: Use this skill only for Python-required backend workloads such as AI pipelines, batch jobs, heavy processing, or Python-native integrations exposed through FastAPI.
---

# Purpose
FastAPI を必要最小限に保つ。

# Use when
- Pythonライブラリ必須
- AI処理
- 重い非同期処理
- バッチ/ワーカーAPI

# Do not use when
- 単純CRUD
- 認証付き通常画面API
- Next.js で十分な処理

# Project assumptions
- FastAPI は補助的 backend
- 主 backend は Next.js 側

# Rules
- FastAPI を万能バックエンドにしない
- 公開境界と内部境界を明確にする
- 認証・署名・レート制限を意識する
- Next.js 側と責務を分ける

# Workflow
1. Python が本当に必要か確認
2. 入出力境界を定義
3. 認証と制限を定義
4. Next.js 側との責務を固定

# Checklist
- 本当に Python が必要か
- 同じ処理を Next.js に置けないか
- 入出力スキーマが定義されているか

# Common pitfalls
- 何でも FastAPI に逃がす
- 境界が曖昧

# Output expectations
- FastAPI 側で持つ責務
- API 入出力
- Next.js との境界
