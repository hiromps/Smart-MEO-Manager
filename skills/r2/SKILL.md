---
name: r2
description: Use this skill for file upload flows, signed URL generation, object key design, metadata handling, and Cloudflare R2-backed storage patterns.
---

# Purpose
ファイル保存を DB ではなく R2 に安全に寄せる。

# Use when
- ファイルアップロードを実装する
- signed URL を扱う
- metadata 設計をする

# Do not use when
- DB設計のみをする
- UIだけを触るとき

# Project assumptions
- バイナリはR2
- メタデータはDB

# Rules
- バイナリ本体を PostgreSQL に保存しない
- object key 命名規則を統一する
- 公開/非公開アクセス方針を先に決める
- メタデータはDBに保持する

# Workflow
1. アクセス方針を決める
2. key 設計を決める
3. upload と metadata 保存を分ける
4. 削除整合を確認する

# Checklist
- key 設計が衝突しないか
- アクセス制御があるか
- 削除時に DB と Storage の整合がとれるか

# Common pitfalls
- DBにバイナリ保存する
- key が雑で衝突する

# Output expectations
- key 設計
- upload フロー
- metadata モデル
