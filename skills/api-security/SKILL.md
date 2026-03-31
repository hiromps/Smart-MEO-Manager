---
name: api-security
description: Use this skill when building any route handler, webhook, external API integration, internal API boundary, authorization rule, or security-sensitive request flow.
---

# Purpose
API境界の安全性を保つ。

# Use when
- route handler を作る
- webhook を作る
- 外部APIを繋ぐ
- 認可や入力検証が必要

# Do not use when
- UIだけを触るとき

# Project assumptions
- 認証と認可を分ける
- 入力検証は必須

# Rules
- 認証と認可を分けて考える
- webhook は署名検証する
- 入力検証を必須にする
- 秘密情報をログに出さない
- 最小権限で設計する

# Workflow
1. 誰が呼ぶAPIかを定義
2. 入力スキーマを決める
3. 認証と認可を分ける
4. 署名やレート制限要否を確認

# Checklist
- 誰が呼べるAPIか明確か
- 入力バリデーションがあるか
- エラー時に秘密が漏れないか
- rate limit の要否を検討したか

# Common pitfalls
- 認証だけ見て認可を忘れる
- webhook 署名検証を省く

# Output expectations
- セキュリティ境界
- バリデーション
- 保護方式
