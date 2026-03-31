---
name: clerk
description: Use this skill when implementing authentication, user sessions, protected routes, Clerk middleware, webhook-based user sync, or account/profile flows with Clerk.
---

# Purpose
認証・セッション管理を Clerk 中心で安全に実装する。

# Use when
- サインイン/サインアップ導線を作る
- 認証付きページを追加する
- middleware で保護する
- Clerk webhook を処理する
- ユーザープロフィール連携を作る

# Do not use when
- 課金だけを触るとき
- DBスキーマだけを変えるとき

# Project assumptions
- 認証の source of truth は Clerk
- Prisma には業務用 user/profile/organization データのみ保持
- Clerk の完全な auth state を Prisma に複製しない

# Rules
- 認証判定は Clerk で行う
- 権限/ロールが必要な場合は app DB に最小限の拡張情報だけ持つ
- webhook で必要な同期だけ行う
- middleware 保護と server-side 保護の両方を意識する
- 認可ロジックは「ログインしているか」と「何をしてよいか」を分ける

# Workflow
1. ルートの保護要件を確認
2. Clerk middleware の適用有無を確認
3. UI ルートと server-side チェックを実装
4. 必要なら webhook で user sync
5. 権限・プロフィールを app DB に反映

# Checklist
- 非ログイン時の挙動が定義されているか
- サーバー側でも認証確認しているか
- Clerk webhook の署名検証があるか
- DBに auth 本体を重複保存していないか

# Common pitfalls
- Clerk と Prisma の両方を auth 正本にする
- middleware だけで十分だと思い込む
- webhook なしで user 同期前提の実装をする

# Output expectations
- 保護対象ルート
- 認証/認可の実装内容
- webhook の有無
- 必要な docs 更新
