---
name: resend
description: Use this skill when sending transactional email, onboarding email, passwordless or verification-related messaging, or templated app notifications via Resend.
---

# Purpose
Resend を使ったアプリメール送信を整理する。

# Use when
- トランザクションメールを送る
- オンボーディングメールを送る
- 通知メールやテンプレメールを作る

# Do not use when
- 認証の中核管理だけを触るとき
- UIだけを作るとき

# Project assumptions
- メールは transactional を中心に扱う
- 送信ロジックは server-side に置く

# Rules
- 送信用途を transactional に限定して整理する
- メール文面はテンプレート化する
- 宛先・件名・本文生成の責務を分ける
- ローカル/本番の送信動作差を意識する

# Workflow
1. 送信トリガーを整理
2. テンプレートを定義
3. 送信処理を server-side に実装
4. 失敗時ログと再送方針を確認

# Checklist
- 送信元ドメイン設定前提を満たすか
- 再送時の影響を考慮しているか
- エラー時のログがあるか

# Common pitfalls
- 文面をコードにベタ書きする
- 再送影響を考えない

# Output expectations
- 送信トリガー
- テンプレ一覧
- エラー処理方針
