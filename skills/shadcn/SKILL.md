---
name: shadcn
description: Use this skill when building or modifying UI with Tailwind CSS and shadcn/ui components, including forms, dialogs, tables, cards, and design consistency work.
---

# Purpose
shadcn/ui と Tailwind で統一感のあるUIを作る。

# Use when
- 新しいUIを作る
- フォームやダイアログを作る
- テーブルやカードを整える
- デザイン整合性を保つ

# Do not use when
- DBやAPIのみを触るとき
- Pythonバックエンドだけの作業

# Project assumptions
- UIは shadcn/ui ベース
- Tailwind utility-first
- 既存コンポーネントを優先して再利用する

# Rules
- まず既存UIを探して再利用する
- コンポーネントの責務を分ける
- アクセシビリティを意識する
- 状態ごとの見た目を作る
- 空状態/エラー状態/ローディング状態を省略しない

# Workflow
1. 既存UIを確認
2. 再利用できるか判断
3. 状態ごとのUIを設計
4. 実装
5. モバイル確認

# Checklist
- ラベルと入力が対応しているか
- キーボード操作を妨げないか
- 余白・サイズ・階層が既存画面と一致しているか
- モバイルで破綻しないか

# Common pitfalls
- 似たコンポーネントを量産する
- Tailwind class を各所に重複させる
- 空状態とエラー状態を作らない

# Output expectations
- 変更コンポーネント一覧
- 状態パターン
- UI確認項目
