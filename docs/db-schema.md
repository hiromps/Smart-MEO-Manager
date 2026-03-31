# DB Schema

## Core Models
- Organization
- Member
- BusinessLocation
- Review
- ReviewReply
- AIReplyDraft
- ReplyTemplate
- Notification

## Relationships
- Organization has many BusinessLocations
- Organization has many Members
- BusinessLocation has many Reviews
- Review has zero or one ReviewReply
- Review has many AIReplyDrafts
- Organization has many ReplyTemplates

## Billing Models
- 初期は billing テーブルを薄く持つか deferred
- Stripe 導入時は customerId, subscriptionId, priceId, status を明示保存
- billing truth は webhook 起点

## File Metadata Models
- 将来的に添付やエクスポートを扱う場合のみ file metadata table を追加
- object key, owner organization, mime type, size, createdBy を管理

## Audit and Event Notes
- 承認・却下・返信投稿は監査対象
- AI返信生成履歴は誰がいつ生成したかを残す
- tenant 分離のため organizationId を主要モデルに保持する

## Initial Model Notes
- User auth 本体は Clerk に任せる
- Member は organization ごとの role を持つ
- BusinessLocation は Google Location ID を持つ
- Review は rating, comment, reviewedAt, replyStatus を持つ
- AIReplyDraft は approvalStatus を持つ
- ReplyTemplate は star rating 条件や tenant 単位で管理できるようにする
