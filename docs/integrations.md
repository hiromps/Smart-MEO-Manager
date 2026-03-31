# Integrations

## Clerk
- 認証と Organizations の正本
- user / org / membership は必要最小限だけ app DB に同期
- middleware と server-side 両方で保護を考える

## Google Business Profile
- 口コミ取得
- 返信投稿
- 店舗情報取得
- API制限、同期頻度、再実行戦略を設計する

## Stripe
- 将来的な組織課金導入用
- webhook で billing state を同期
- success redirect に依存しない

## Resend
- 招待メール
- 通知メール
- 重要な運用アラート

## Cloudflare R2
- MVPでは必須ではないが、将来の添付ファイルやエクスポート用途を見据える
- ファイル本体は R2、metadata は DB

## PostHog
- review_reply_generated
- review_reply_approved
- review_reply_posted
- organization_invited_user
- dashboard_viewed
などの重要イベントを設計する

## Sentry
- webhook 失敗
- GBP 同期失敗
- AI返信生成失敗
- 認可エラー境界
を重点監視する

## Neon + Prisma
- マルチテナント分離を徹底
- organizationId を主要業務データへ紐づける

## FastAPI
- 初期MVPでは必須ではない可能性が高い
- Pythonが必要な AI / batch 処理が出たら導入

## Vercel
- Next.js の標準 deploy target
- Preview / Production の env 差分を整理する
