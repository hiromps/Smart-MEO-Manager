---
name: stripe
description: Use this skill for Stripe checkout, billing portal, subscriptions, webhook handling, payment state synchronization, and product/price integration.
---

# Purpose
Stripe連携を安全に実装する。

# Use when
- Checkout を作る
- Billing Portal を作る
- subscription 状態を扱う
- webhook を処理する
- price / product ID を使う

# Do not use when
- 認証だけの作業
- UIの見た目調整だけの作業

# Project assumptions
- 支払い状態の source of truth は Stripe webhook
- アプリDBには必要最小限の billing state を保存
- success URL のみで課金成功確定にしない

# Rules
- 決済結果は webhook で反映する
- product/price ID は環境変数や設定ファイルで管理する
- idempotency と再送を意識する
- ユーザー/組織との紐づけを明確にする
- テストモードと本番モードを混同しない

# Workflow
1. 商品・価格・課金モデルを確認
2. checkout / portal 導線を実装
3. webhook 署名検証を実装
4. DBへ billing state を同期
5. UIの制限解除条件を webhook state に連動させる

# Checklist
- webhook 検証があるか
- success redirect 依存になっていないか
- Stripe customer ID を保存しているか
- subscription status の扱いが明確か

# Common pitfalls
- success page だけで有料化する
- webhook 再送を考慮しない
- customer / subscription / price のID管理が曖昧

# Output expectations
- Checkout/Portal/Webhook の実装範囲
- 保存する billing state
- テスト観点
