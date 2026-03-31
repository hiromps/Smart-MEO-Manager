---
name: vercel
description: Use this skill when configuring deployment, environment variables, preview environments, production settings, domain setup, and Vercel-specific deployment behavior.
---

# Purpose
Vercel への安定デプロイを保つ。

# Use when
- deployment 設定をする
- env var を整理する
- preview / production 差分を調整する
- callback URL や webhook URL を確認する

# Do not use when
- ローカルUI調整だけのとき

# Project assumptions
- Vercel が Next.js の標準デプロイ先
- Preview / Production を分けて考える

# Rules
- 環境変数は整理して管理する
- Preview / Production の差異を意識する
- webhook URL や callback URL の環境差分を確認する
- ビルド時と実行時の差を意識する

# Workflow
1. 必須 env を洗い出す
2. preview / production 差分を確認
3. auth/callback/webhook URL を確認
4. deploy 後の確認項目を回す

# Checklist
- 必須 env が揃っているか
- Preview でも auth/callback が壊れないか
- 本番ドメイン前提の値を直書きしていないか

# Common pitfalls
- callback URL の環境差分を忘れる
- env の入れ忘れ

# Output expectations
- 必須 env 一覧
- deploy 設定
- post-deploy checks
