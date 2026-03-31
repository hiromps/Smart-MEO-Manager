---
name: nextjs
description: Use this skill for Next.js App Router work including pages, layouts, route handlers, server actions, metadata, loading/error states, and server/client component boundaries.
---

# Purpose
Next.js App Router の実装を一貫した方針で行う。

# Use when
- 新しいページを追加するとき
- layout を作る/修正するとき
- route handler を追加するとき
- server action を実装するとき
- server component / client component の切り分けが必要なとき

# Do not use when
- Python API のみを触るとき
- DBスキーマ変更だけが目的のとき
- UIコンポーネント単体設計だけなら shadcn Skill を優先

# Project assumptions
- App Router を採用
- TypeScript strict
- 認証は Clerk
- DB は Prisma
- UI は shadcn/ui
- 原則として backend logic は Next.js 側に置く

# Rules
- app router のファイル規約に従う
- server component をデフォルトにし、必要時のみ client component にする
- 単純CRUDのために FastAPI を増やさない
- route handlers は外部公開APIやwebhook用途を優先する
- フォーム処理は server action を第一候補とする
- metadata, loading, error, not-found の要否を検討する

# Workflow
1. 対象ルートと責務を確認
2. page/layout/loading/error の必要性を判断
3. server/client 境界を決める
4. データ取得方法を決める
5. 認証・認可を確認する
6. 実装
7. テストまたは動作確認

# Checklist
- server/client 境界は妥当か
- 認証保護が必要な画面に guard があるか
- エラー状態が考慮されているか
- metadata が必要なら設定したか
- 不要な use client を増やしていないか

# Common pitfalls
- なんでも client component にする
- route handler と server action の責務が混ざる
- 権限チェックなしで dashboard を出す
- fetch と Prisma の責務を混在させる

# Output expectations
- 変更ファイル一覧
- 実装内容の要約
- 必要なテストまたは動作確認
- 必要なら docs 更新
