---
name: prisma
description: Use this skill for Prisma schema changes, migrations, database access patterns, seed scripts, and query/model design with PostgreSQL.
---

# Purpose
Prisma と PostgreSQL の変更を安全に行う。

# Use when
- schema.prisma を変更するとき
- migration を作るとき
- 新しい model/relation を作るとき
- query を追加するとき
- seed を更新するとき

# Do not use when
- UI変更のみのとき
- 認証フローのみのとき

# Project assumptions
- DB は Neon PostgreSQL
- ORM は Prisma
- DB変更時は migration 必須
- DB access は Prisma client 経由を基本とする

# Rules
- schema 変更だけで終わらせず migration を作る
- 命名規則を統一する
- nullable は安易に増やさない
- index / unique / relation を明示的に考える
- 課金や権限に関わる状態は曖昧にしない

# Workflow
1. 要件からデータモデルを整理
2. schema.prisma を更新
3. migration を作成
4. seed / 型 / 参照コードを更新
5. 既存データ影響を確認
6. テスト

# Checklist
- migration があるか
- relation は妥当か
- enum/unique/index の見落としはないか
- 削除時の挙動が定義されているか
- webhook 由来の外部IDを保存するならカラム設計があるか

# Common pitfalls
- Prisma schema だけ変えて migration を作らない
- 後から困る external_id を保存しない
- Stripe / Clerk 由来の識別子を曖昧にする

# Output expectations
- schema 変更点
- migration の有無
- 影響範囲
- テスト/確認項目
