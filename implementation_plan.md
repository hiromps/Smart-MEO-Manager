# Implementation Plan: Smart-MEO プロジェクト初期セットアップ

GEMINI.md の指示に基づき、Next.js + Clerk + Neon + Prisma を使用したマルチテナント SaaS の基盤を構築します。

## 1. データベース・ORM 設定
- [x] Prisma 及び @prisma/client のインストール
- [x] Prisma の初期化 (npx prisma init)
- [x] .env への DATABASE_URL の設定 (Neon Postgres)
- [x] Prisma Schema の定義 (Multi-tenant 対応 - BusinessLocation, Review, AIReplyDraft等追加)
- [x] 初回マイグレーションの実行 (db push ※DATABASE_URL設定後に実行)

## 2. 認証・セキュリティ基盤 (Clerk)
- [x] Clerk の基本設定
- [x] Clerk Webhook のセットアップ (ユーザー・組織同期用)
- [x] 組織 (Organization) 管理の統合
- [x] セッションからのテナント ID (Organization ID) 取得ユーティリティ作成 (`lib/auth.ts`)

## 3. 次のステップ
- [ ] データアクセスレイヤーの構築 (Repository パターンなど)
  - [ ] 全てのクエリでテナント ID によるフィルタリングを強制
- [x] 基本的なダッシュボード UI の構築 (shadcn/ui 使用、OrganizationSwitcher連携)
- [ ] バックエンドAPI連携の実装 (Google APIとの連携およびOpenAI等によるAI返信生成)
  - [ ] ダッシュボード上の統計情報をデータベースから取得するように変更

## 4. MVP 優先実装
- [x] Googleビジネスプロフィールのデモ連携とデモデータ投入
- [x] 口コミ取得・一覧表示
- [x] 口コミの基本フィルタリング（状態・キーワード）
- [x] AI返信案の生成 API（テンプレートベースのMVP実装）
- [x] AI返信下書きの保存
- [x] 承認待ちへの更新
- [x] 返信投稿と返信済み反映
- [ ] OpenAI など実AIとの接続
- [ ] Google Business Profile 本番返信投稿 API 連携
- [ ] 承認権限の厳密なロール制御

