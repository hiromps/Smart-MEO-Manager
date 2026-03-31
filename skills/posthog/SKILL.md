---
name: posthog
description: Use this skill when implementing product analytics, feature flags, event naming, funnel tracking, or server/client analytics integration with PostHog.
---

# Purpose
計測イベントを一貫して設計する。

# Use when
- 主要イベントを計測する
- Funnel を作る
- feature flag を使う

# Do not use when
- UIだけを直すとき
- DB変更だけをするとき

# Project assumptions
- 重要イベントだけを絞って送る
- PII は最小限にする

# Rules
- イベント名を人間が読める命名にする
- server/client どちらで送るかを決める
- 重要イベントだけを絞って入れる
- PII を安易に送らない

# Workflow
1. 計測したい行動を定義
2. イベント名を決める
3. server/client の送信場所を決める
4. 二重送信を防ぐ

# Checklist
- イベント名が統一されているか
- 二重送信していないか
- 課金や登録完了など主要イベントがあるか

# Common pitfalls
- イベントを増やしすぎる
- 命名がブレる

# Output expectations
- イベント一覧
- 実装箇所
- 計測意図
