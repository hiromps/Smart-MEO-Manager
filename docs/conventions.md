# Conventions

## Code Style
- TypeScript strict
- pnpm 必須
- Next.js App Router の規約に従う
- 既定は server component

## Folder Structure
- `src/app`: ルーティング
- `src/components`: 再利用UI
- `src/features`: ドメイン単位の機能
- `src/lib`: 共通ユーティリティ
- `src/server`: server-only logic
- `src/types`: 型定義
- `backend/fastapi`: Python 必須領域のみ

## Naming
- feature 単位で責務を分ける
- Prisma model 名は意味が明確な singular PascalCase
- env var は用途別に整理する

## Server vs Client Rules
- client component は必要最小限
- form 処理は server actions を第一候補
- route handlers は webhook や API 境界用途を優先
- 単純CRUDのために FastAPI を増やさない

## Feature Boundaries
- 認証は Clerk が正本
- Billing state は Stripe webhook 連動
- テナント分離は organizationId で統一
- ファイル本体は DB に保存しない

## Testing Rules
- 単体テスト、統合テスト、e2e を分ける
- webhook と権限制御は重点テスト対象
- マルチテナント分離に関わる条件を必ず確認する

## Env Var Rules
- シークレットはサーバーのみ
- Preview と Production の callback / webhook URL 差異を管理
- Stripe / Clerk / Google 連携の key は用途別に明示する

## Error Handling
- 失敗時は UI に安全なメッセージを返す
- 詳細は Sentry やサーバーログに送る
- 署名検証失敗や認可失敗は明示的に扱う

## Logging and Monitoring
- 主要な auth / review / billing / sync フローを観測する
- PII を安易にログへ出さない
- PostHog と Sentry の責務を混ぜない
