---
name: sentry
description: Use this skill when adding error monitoring, exception capture, tracing, performance monitoring, or structured production diagnostics with Sentry.
---

# Purpose
本番障害の追跡性を上げる。

# Use when
- エラー監視を入れる
- 例外捕捉を強化する
- tracing を追加する

# Do not use when
- 単純なUI作業だけのとき

# Project assumptions
- PII は最小限
- フロント/サーバー両方で必要箇所を監視

# Rules
- 握りつぶす例外を減らす
- 重要な境界で context を付与する
- PII を不用意に送らない
- フロント/サーバー双方の監視対象を意識する

# Workflow
1. 重要フローを特定
2. 例外捕捉点を決める
3. 文脈情報を整理
4. ノイズを抑える

# Checklist
- 重要処理で例外が捕捉されるか
- user id / org id など最小限の文脈が付くか
- ノイズだらけのログになっていないか

# Common pitfalls
- なんでも送ってノイズ化する
- 文脈が足りず調査不能になる

# Output expectations
- 監視対象
- 例外捕捉箇所
- 文脈情報
