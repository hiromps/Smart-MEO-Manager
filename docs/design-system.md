# Smart MEO Manager — デザインシステム & アーキテクチャ仕様書

> **バージョン**: v1.0
> **最終更新**: 2026-03-31
> **対象プロジェクト**: Smart MEO Manager (SMM)

---

## 1. プロジェクト概要

### 1.1 プロダクト概要

Smart MEO Manager は、飲食店を中心とした **Googleビジネスプロフィール運用企業向け** のSaaS型Webダッシュボードです。

**コア機能:**
- Googleマップ口コミ返信業務のAI自動化
- 口コミ管理業務の効率化（一覧、フィルタリング、ステータス管理）
- MEO関連指標の可視化と一元管理（KPIカード、グラフ）
- 複数店舗・複数アカウント管理
- マルチテナント対応（組織単位のデータ分離）

### 1.2 提供形態

- **SaaS型** マルチテナント構成
- **対応端末**: PC / タブレット / スマートフォン（レスポンシブ）
- **言語**: 日本語（UIラベル、Clerk認証画面含む）

---

## 2. テックスタック

### 2.1 コア技術

| レイヤー | 技術 | バージョン |
|---------|------|-----------|
| **フレームワーク** | Next.js (App Router) | 15.2.6 |
| **言語** | TypeScript | ^5 |
| **UI ライブラリ** | React | ^19 |
| **認証** | Clerk (`@clerk/nextjs`) | ^6.12.0 |
| **データベース** | Neon Postgres | - |
| **ORM** | Prisma | ^6.4.1 |
| **UIコンポーネント** | shadcn/ui (new-york style) | - |
| **スタイリング** | Tailwind CSS | ^3.4.17 |
| **デプロイ** | Vercel | - |
| **分析** | Vercel Analytics | 1.3.1 |

### 2.2 主要ライブラリ

| カテゴリ | ライブラリ | 用途 |
|---------|-----------|------|
| **チャート** | recharts (latest) | 棒グラフ、エリアチャート |
| **フォーム** | react-hook-form + zod | フォームバリデーション |
| **アイコン** | lucide-react ^0.454.0 | UIアイコン |
| **日付** | date-fns 4.1.0 | 日付操作 |
| **Webhook検証** | svix ^1.89.0 | Clerk Webhook署名検証 |
| **トースト** | sonner ^1.7.4 | 通知表示 |
| **テーマ** | next-themes ^0.4.6 | ダーク/ライトモード切替 |
| **アニメーション** | tailwindcss-animate ^1.0.7 | CSS Transition/Animation |

### 2.3 パッケージマネージャ

```
pnpm (推奨)
```

> ⚠️ `npm` を使うと `package-lock.json` が生成され、Vercelデプロイ時に `pnpm install` と競合するため、**必ず pnpm を使用すること**。

---

## 3. ディレクトリ構成

```
Smart-MEO/
├── app/                          # Next.js App Router
│   ├── layout.tsx                # ルートレイアウト（ClerkProvider, フォント, メタデータ）
│   ├── page.tsx                  # ダッシュボードメインページ（Server Component）
│   ├── globals.css               # グローバルCSS（デザイントークン定義）
│   ├── api/
│   │   └── webhooks/
│   │       └── clerk/
│   │           └── route.ts      # Clerk Webhook エンドポイント
│   ├── sign-in/
│   │   └── [[...sign-in]]/
│   │       └── page.tsx          # サインインページ
│   └── sign-up/
│       └── [[...sign-up]]/
│           └── page.tsx          # サインアップページ
├── components/
│   ├── dashboard.tsx             # メインダッシュボード（Client Component, 28KB）
│   ├── theme-provider.tsx        # next-themes ラッパー
│   └── ui/                       # shadcn/ui コンポーネント（57ファイル）
├── lib/
│   ├── auth.ts                   # テナントコンテキスト取得ユーティリティ
│   ├── db.ts                     # Prisma Client シングルトン
│   ├── org.ts                    # 組織・ユーザー取得ヘルパー
│   └── utils.ts                  # cn() ユーティリティ (clsx + tailwind-merge)
├── hooks/
│   ├── use-mobile.ts             # モバイル判定フック（768px）
│   └── use-toast.ts              # トースト通知フック
├── prisma/
│   └── schema.prisma             # データベーススキーマ
├── public/                       # 静的アセット
│   ├── icon.svg                  # SVG ファビコン
│   ├── icon-light-32x32.png      # ライトモード用ファビコン
│   ├── icon-dark-32x32.png       # ダークモード用ファビコン
│   └── apple-icon.png            # Apple Touch Icon
├── middleware.ts                  # Clerk認証ミドルウェア
├── tailwind.config.ts            # Tailwind設定
├── components.json               # shadcn/ui設定
├── next.config.mjs               # Next.js設定
├── package.json                  # 依存関係
├── pnpm-lock.yaml                # pnpm ロックファイル
├── tsconfig.json                 # TypeScript設定
├── GEMINI.md                     # AI開発ルール
└── SMM_Requirements_Spec_v1_0.md # 要件定義書
```

---

## 4. デザイントークン（カラーシステム）

### 4.1 カラーパレット（HSL形式）

CSS変数として `globals.css` で定義。shadcn/ui の規約に従い `hsl(var(--xxx))` で参照。

#### ライトモード (`:root`)

| トークン | HSL値 | 用途 |
|---------|-------|------|
| `--background` | `0 0% 100%` | ページ背景（白） |
| `--foreground` | `0 0% 9%` | テキスト色（ほぼ黒） |
| `--card` | `0 0% 100%` | カード背景（白） |
| `--card-foreground` | `0 0% 9%` | カード内テキスト |
| `--primary` | `157 100% 35%` | **ブランドグリーン (#00B26E)** |
| `--primary-foreground` | `0 0% 100%` | Primary上のテキスト（白） |
| `--secondary` | `157 10% 96%` | セカンダリ背景（薄いグレーグリーン） |
| `--secondary-foreground` | `0 0% 9%` | セカンダリテキスト |
| `--muted` | `157 10% 96%` | ミュート背景 |
| `--muted-foreground` | `0 0% 45%` | ミュートテキスト（グレー） |
| `--accent` | `157 100% 35%` | アクセント（= primary） |
| `--destructive` | `0 84% 60%` | 破壊的アクション（赤） |
| `--border` | `0 0% 90%` | ボーダー色 |
| `--input` | `0 0% 90%` | インプットボーダー |
| `--ring` | `157 100% 35%` | フォーカスリング |
| `--radius` | `0.5rem` | デフォルト角丸 |

#### ダークモード (`.dark`)

| トークン | HSL値 | 変化点 |
|---------|-------|-------|
| `--background` | `0 0% 7%` | ダーク背景 |
| `--foreground` | `0 0% 98%` | 明るいテキスト |
| `--card` | `0 0% 10%` | ダークカード |
| `--primary` | `157 100% 40%` | やや明るいグリーン |
| `--secondary` | `0 0% 15%` | ダークセカンダリ |
| `--muted-foreground` | `0 0% 64%` | ミュートテキスト |
| `--border` | `0 0% 18%` | ダークボーダー |
| `--destructive` | `0 62.8% 30.6%` | ダーク用赤 |

#### チャートカラー

| トークン | HSL値 | 意味 |
|---------|-------|------|
| `--chart-1` | `157 100% 35%` | プライマリグリーン |
| `--chart-2` | `157 80% 45%` | セカンダリグリーン |
| `--chart-3` | `38 92% 50%` | オレンジ/アンバー |
| `--chart-4` | `0 84% 60%` | レッド |
| `--chart-5` | `199 89% 48%` | ブルー |

### 4.2 ブランドカラー

```
プライマリ:  #00B26E  (HSL: 157, 100%, 35%)
ホバー:      #00945C  (やや暗め)
```

Clerkコンポーネントでも同じブランドカラーを適用：
```tsx
colorPrimary: '#00B26E',
formButtonPrimary: 'bg-[#00B26E] hover:bg-[#00945C]'
```

### 4.3 ステータスカラー

| ステータス | 色 | 用途 |
|-----------|---|------|
| **成功/ポジティブ** | `emerald-500/600` | 返信済み、増加率 |
| **警告/要注意** | `amber-500/600` | 未対応、要対応 |
| **エラー/破壊的** | `destructive` (赤) | エラー、削除 |
| **星評価** | `amber-400` | ★ 星アイコン (fill + text) |

---

## 5. タイポグラフィ

### 5.1 フォント

```tsx
import { Geist, Geist_Mono } from 'next/font/google'

const _geist = Geist({ subsets: ["latin"] });      // 本文
const _geistMono = Geist_Mono({ subsets: ["latin"] }); // コード
```

- body: `font-sans antialiased`

### 5.2 テキストサイズ規約

| 用途 | Tailwindクラス |
|-----|---------------|
| ページタイトル | `text-xl font-semibold` |
| カード見出し | `text-base font-medium` |
| KPI数値 | `text-3xl font-bold` / `text-2xl font-bold` |
| 本文 | `text-sm` |
| 補足・メタ情報 | `text-xs text-muted-foreground` |
| ラベル | `text-sm font-medium text-muted-foreground` |

---

## 6. レイアウトシステム

### 6.1 全体構成

```
┌─────────────────────────────────────────────┐
│                                             │
│  ┌──────────┐  ┌──────────────────────────┐ │
│  │          │  │ Header (h-16)            │ │
│  │ Sidebar  │  ├──────────────────────────┤ │
│  │ (w-64)   │  │                          │ │
│  │          │  │ Main Content             │ │
│  │          │  │ (overflow-y-auto)        │ │
│  │          │  │ (p-4 md:p-6)            │ │
│  │          │  │                          │ │
│  └──────────┘  └──────────────────────────┘ │
│                                             │
└─────────────────────────────────────────────┘
```

- **全体**: `flex h-screen bg-background`
- **サイドバー**: 固定幅 `w-64`, モバイルではオーバーレイ (translate-x)
- **ヘッダー**: `h-16`, `border-b`
- **メインコンテンツ**: `flex-1 overflow-y-auto`

### 6.2 レスポンシブブレークポイント

| ブレークポイント | 値 | 用途 |
|----------------|---|------|
| `sm` | 640px | カードグリッド 2列化 |
| `md` | 768px | サイドバー常時表示、検索バー表示 |
| `lg` | 1024px | KPIカード 4列、チャート 2列 |

### 6.3 グリッドパターン

```tsx
// KPIカード
<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">

// チャート行
<div className="grid grid-cols-1 gap-4 lg:grid-cols-2">

// 口コミ + アクション
<div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
  <Card className="lg:col-span-2">  {/* 口コミリスト */}
  <div className="space-y-4">       {/* サイドカード群 */}
```

### 6.4 間隔（スペーシング）

| 用途 | クラス |
|-----|-------|
| セクション間 | `mb-6` |
| カード内パディング | `p-5` |
| アイテム間 | `space-y-4` / `gap-4` |
| インライン要素間 | `gap-2` / `gap-3` |

---

## 7. コンポーネント設計

### 7.1 shadcn/ui コンポーネント一覧 (57ファイル)

#### 使用中のコンポーネント (dashboard.tsx で使用)

| コンポーネント | 用途 |
|---------------|------|
| `Button` | アクションボタン全般 |
| `Card`, `CardContent`, `CardHeader`, `CardTitle`, `CardDescription` | KPIカード、チャートカード、リストカード |
| `Avatar`, `AvatarFallback`, `AvatarImage` | 口コミ投稿者アイコン |
| `DropdownMenu` 系 | 期間選択、ユーザーメニュー |
| `Badge` | ステータスバッジ（未対応/下書き/返信済） |
| `Input` | 検索フィールド |
| `Select` 系 | 店舗セレクタ |
| `Tabs`, `TabsList`, `TabsTrigger` | 期間切替（今日/今週/今月/カスタム） |

#### インストール済み未使用コンポーネント

accordion, alert-dialog, alert, breadcrumb, calendar, carousel, chart, checkbox, collapsible, command, context-menu, dialog, drawer, form, hover-card, input-otp, item, kbd, label, menubar, navigation-menu, pagination, popover, progress, radio-group, resizable, scroll-area, separator, sheet, sidebar, skeleton, slider, sonner, spinner, switch, table, textarea, toast, toaster, toggle-group, toggle, tooltip

### 7.2 カスタムコンポーネント

| コンポーネント | ファイル | 種別 | 説明 |
|---------------|---------|------|------|
| `Dashboard` | `components/dashboard.tsx` | Client Component | メインダッシュボード全体 |
| `ThemeProvider` | `components/theme-provider.tsx` | Client Component | next-themes ラッパー |

### 7.3 UIパターン

#### KPIカード

```tsx
<Card className="bg-card border-border">
  <CardContent className="p-5">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-sm font-medium text-muted-foreground">ラベル</p>
        <p className="mt-2 text-3xl font-bold text-foreground">値</p>
        <div className="mt-1 flex items-center gap-1">
          <TrendingUp className="h-3 w-3 text-emerald-500" />
          <span className="text-xs text-emerald-600">+12%</span>
          <span className="text-xs text-muted-foreground">先月比</span>
        </div>
      </div>
      <div className="rounded-lg bg-primary/10 p-2.5">
        <Icon className="h-5 w-5 text-primary" />
      </div>
    </div>
  </CardContent>
</Card>
```

#### ステータスバッジ

```tsx
// 未対応
<Badge variant="outline" className="border-amber-500/50 bg-amber-50 text-amber-600">
  未対応
</Badge>

// 下書き
<Badge variant="outline" className="border-primary/50 bg-primary/10 text-primary">
  下書き
</Badge>

// 返信済
<Badge variant="outline" className="border-emerald-500/50 bg-emerald-50 text-emerald-600">
  返信済
</Badge>
```

#### 口コミカード

```tsx
<div className="flex items-start gap-4 rounded-lg border border-border bg-secondary/30 p-4 transition-colors hover:bg-secondary/50">
  <Avatar>...</Avatar>
  <div className="min-w-0 flex-1">
    <div className="flex flex-wrap items-center gap-2">
      <span className="font-medium text-foreground">名前</span>
      {renderStars(rating)}
      {getStatusBadge(status)}
    </div>
    <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">コメント</p>
    <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
      <span>店舗名</span>
      <span>時間</span>
    </div>
  </div>
  <Button variant="ghost" size="sm">
    <Sparkles className="mr-1.5 h-3.5 w-3.5 text-primary" />
    AI返信
  </Button>
</div>
```

#### 星評価表示

```tsx
const renderStars = (rating: number) => (
  <div className="flex items-center gap-0.5">
    {[1, 2, 3, 4, 5].map((star) => (
      <Star
        key={star}
        className={`h-3.5 w-3.5 ${
          star <= rating
            ? "fill-amber-400 text-amber-400"
            : "text-muted-foreground"
        }`}
      />
    ))}
  </div>
)
```

---

## 8. チャートシステム

### 8.1 使用ライブラリ

**recharts** (latest) — `ResponsiveContainer` でレスポンシブ対応

### 8.2 チャート種別

| チャート | コンポーネント | 用途 |
|---------|-------------|------|
| 棒グラフ | `BarChart` | 口コミ推移（月別） |
| エリアチャート | `AreaChart` | 検索・閲覧データ |

### 8.3 チャートスタイル規約

```tsx
// 共通設定
height="240px"  // コンテナ高さ

// グリッド
<CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />

// 軸
<XAxis axisLine={false} tickLine={false} tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} />
<YAxis axisLine={false} tickLine={false} tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} />

// ツールチップ
<Tooltip
  contentStyle={{
    backgroundColor: "hsl(var(--card))",
    border: "1px solid hsl(var(--border))",
    borderRadius: "8px",
    color: "hsl(var(--foreground))",
  }}
/>

// バー
<Bar fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />

// エリア（グラデーション）
<linearGradient id="searchGradient" x1="0" y1="0" x2="0" y2="1">
  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
</linearGradient>
```

---

## 9. 認証・認可アーキテクチャ

### 9.1 認証フロー

```
[ユーザーアクセス]
       │
       ▼
[middleware.ts]  ── isPublicRoute? ──▶ [sign-in / sign-up] (Clerk UI)
       │ (保護)
       ▼
[app/page.tsx]  ── auth() ──▶ userId無し → redirect("/sign-in")
       │                     orgId有り → getCurrentOrg()
       ▼
[Dashboard]     ── UserButton / OrganizationSwitcher
```

### 9.2 Clerk設定

```tsx
// layout.tsx
<ClerkProvider
  localization={jaJP}    // 日本語ローカライゼーション
  appearance={{
    variables: {
      colorPrimary: '#00B26E',
      colorTextOnPrimaryBackground: '#ffffff',
    },
    elements: {
      formButtonPrimary: 'bg-[#00B26E] hover:bg-[#00945C]',
      card: 'shadow-lg',
    },
  }}
>
```

### 9.3 Middleware ルーティング

```typescript
// 公開ルート
const isPublicRoute = createRouteMatcher([
  '/sign-in(.*)',
  '/sign-up(.*)',
])

// それ以外は全て保護
if (!isPublicRoute(request)) {
  await auth.protect()
}
```

### 9.4 マルチテナント

- **Clerk Organizations** を使用
- `OrganizationSwitcher` でテナント切替
- `hidePersonal={true}` で個人アカウント非表示（B2B SaaS想定）
- DB側では `Organization.clerkId` と `User.clerkId` で紐付け

### 9.5 テナントコンテキスト取得パターン

```typescript
// lib/auth.ts — Server Actions / API Routes 用
export async function requireOrgContext() {
  const session = await auth();
  // 1. userId チェック
  // 2. orgId チェック
  // 3. DB上のMember存在チェック
  // → { userId, clerkUserId, organizationId, clerkOrgId, role }
}
```

---

## 10. データベーススキーマ

### 10.1 ER図（概要）

```
User ─┐
      ├── Member ──── Organization
User ─┘                    │
                           ├── GoogleAccount ── BusinessLocation ── Review
                           │                                          ├── ReviewReply
                           │                                          └── AIReplyDraft
                           └── ReplyTemplate
```

### 10.2 モデル一覧

| モデル | 説明 | 主要カラム |
|-------|------|-----------|
| **User** | 認証ユーザー | clerkId, email, name, imageUrl, role |
| **Organization** | テナント（組織） | clerkId, name, slug, imageUrl |
| **Member** | ユーザー×組織の中間テーブル | userId, organizationId, role (ADMIN/MEMBER/READONLY) |
| **GoogleAccount** | Google連携アカウント | organizationId, googleId, email, accessToken, refreshToken |
| **BusinessLocation** | 店舗情報 | organizationId, googleAccountId, googleLocationId, name, address |
| **Review** | 口コミ | locationId, googleReviewId, starRating, comment, reviewerName, replyStatus |
| **ReviewReply** | 返信 | reviewId, comment, updateTime |
| **AIReplyDraft** | AI返信下書き | reviewId, draftContent, status (PENDING/APPROVED/REJECTED) |
| **ReplyTemplate** | 返信テンプレート | organizationId, name, content, targetStarRating |

### 10.3 Enum定義

```prisma
enum UserRole     { ADMIN, USER }
enum MemberRole   { ADMIN, MEMBER, READONLY }
enum ReplyStatus  { UNANSWERED, ANSWERED, PENDING_APPROVAL }
enum DraftStatus  { PENDING, APPROVED, REJECTED }
```

### 10.4 テナント分離

すべてのビジネスデータは `organizationId` を通じてテナント（Organization）に紐付き、データ分離を実現。

---

## 11. API・Webhook

### 11.1 Clerk Webhook (`/api/webhooks/clerk`)

Svix を使用した署名検証付きWebhookエンドポイント。

| イベント | 処理 |
|---------|------|
| `user.created` | DBにUserレコード作成 |
| `user.updated` | DBのUserレコード更新 |
| `user.deleted` | DBのUserレコード削除 |
| `organization.created` | Organization作成 + 作成者をADMINとしてMember登録 |
| `organizationMembership.created` | Member upsert (ロールマッピング: `org:admin` → `ADMIN`) |

### 11.2 必要な環境変数

```env
# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_...
CLERK_SECRET_KEY=sk_...
CLERK_WEBHOOK_SECRET=whsec_...

# Database (Neon Postgres)
DATABASE_URL="postgresql://..."
DIRECT_URL="postgresql://..."

# その他
AI_GATEWAY_API_KEY=vck_...
```

---

## 12. ナビゲーション構成

### 12.1 サイドバーメニュー

| ID | アイコン | ラベル | 説明 |
|----|---------|-------|------|
| `dashboard` | `LayoutDashboard` | ダッシュボード | KPI + チャート + 口コミ概要 |
| `reviews` | `MessageSquare` | 口コミ管理 | 口コミ一覧・フィルタリング |
| `analytics` | `BarChart3` | MEO分析 | アクセスデータ可視化 |
| `ai-settings` | `Sparkles` | AI返信設定 | 返信モード・トーン設定 |
| `templates` | `FileText` | テンプレート | 返信テンプレート管理 |
| `locations` | `Store` | 店舗管理 | 店舗一覧・追加 |
| `settings` | `Settings` | 設定 | システム設定 |

### 12.2 ヘッダー要素

- 店舗セレクタ (Select)
- 検索バー (md以上で表示)
- 通知ベル (未読インジケータ付き)

### 12.3 サイドバーフッター

- `OrganizationSwitcher` (テナント切替)
- `UserButton` (ユーザープロフィール・サインアウト)

---

## 13. ページ仕様

### 13.1 サインイン画面 (`/sign-in`)

- 中央寄せレイアウト: `flex min-h-screen items-center justify-center`
- 背景: `bg-gradient-to-br from-background via-background to-muted/30`
- ロゴ: グラデーションアイコン `from-[#00B26E] to-[#00945C]` + シャドウ
- Clerk `<SignIn>` コンポーネント (カスタムスタイル適用)
- フッター: 「Googleビジネスプロフィールの口コミをAIで効率的に管理」

### 13.2 サインアップ画面 (`/sign-up`)

- サインインと同構成
- Clerk `<SignUp>` コンポーネント

### 13.3 ダッシュボード (`/`)

**Server Component → Client Component 構成**

```tsx
// page.tsx (Server Component)
const org = orgId ? await getCurrentOrg() : null;
const user = await getCurrentUser();
return <Dashboard serverOrg={org} serverUser={user} />;
```

**ダッシュボードセクション:**
1. **期間セレクタ** — 今日/今週/今月/カスタム (Tabs)
2. **KPIカード** (4列) — 総口コミ数, 平均評価, 返信率, 未対応口コミ
3. **チャート行** (2列) — 口コミ推移(棒), 検索・閲覧データ(エリア)
4. **下段** (3列 = 2:1)
   - 最新口コミリスト（4件表示）
   - クイックアクション
   - 店舗別パフォーマンス
   - AI返信統計

---

## 14. ビルド・デプロイ設定

### 14.1 package.json scripts

```json
{
  "postinstall": "prisma generate",
  "build": "prisma generate && next build",
  "dev": "next dev",
  "lint": "eslint .",
  "start": "next start"
}
```

### 14.2 next.config.mjs

```js
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,    // ビルド時のTS型エラーを無視
  },
  images: {
    unoptimized: true,          // 画像最適化無効（Vercel外ホスティング互換）
  },
}
```

### 14.3 shadcn/ui 設定 (components.json)

```json
{
  "style": "new-york",
  "rsc": true,
  "tsx": true,
  "tailwind": {
    "css": "app/globals.css",
    "baseColor": "neutral",
    "cssVariables": true
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils",
    "ui": "@/components/ui",
    "lib": "@/lib",
    "hooks": "@/hooks"
  },
  "iconLibrary": "lucide"
}
```

### 14.4 Vercelデプロイ注意事項

- **pnpmを使用** (`pnpm-lock.yaml` のみ管理、`package-lock.json` は削除)
- `postinstall` で `prisma generate` 必須（Vercel上でPrisma Client生成）
- 環境変数はVercelダッシュボードで設定

---

## 15. 開発規約

### 15.1 アーキテクチャ原則

1. **App Router パターン** を優先
2. **Clerk** を認証の真のソースとする
3. **Neon Postgres** を主リレーショナルDB
4. **Prisma** でスキーマ管理・DB操作
5. **マルチテナント SaaS** を前提に設計
6. 全ルートハンドラ・Server Actions で **APIセキュリティ** を徹底
7. 機密ロジック・認証は **サーバーサイド** で処理
8. クライアントに **シークレットや特権ロジック** を露出させない

### 15.2 ファイル命名規約

- コンポーネント: `kebab-case.tsx` (例: `theme-provider.tsx`)
- ライブラリ: `kebab-case.ts` (例: `use-mobile.ts`)
- ページ: `page.tsx`
- APIルート: `route.ts`

### 15.3 CSS規約

- **Tailwind CSS** ユーティリティファーストで記述
- カスタムカラーは CSS 変数を介して参照: `hsl(var(--primary))`
- `cn()` ユーティリティで条件付きクラス結合

---

## 16. クローン手順

新しいプロジェクトでこのデザインを再現する手順:

```bash
# 1. Next.js プロジェクト作成
npx -y create-next-app@latest ./ --typescript --tailwind --eslint --app --src-dir=false

# 2. 依存パッケージインストール (pnpm)
pnpm add @clerk/nextjs @clerk/localizations @prisma/client prisma \
  recharts lucide-react sonner next-themes \
  react-hook-form @hookform/resolvers zod \
  @vercel/analytics svix \
  class-variance-authority clsx tailwind-merge tailwindcss-animate

pnpm add -D @types/node @types/react @types/react-dom

# 3. shadcn/ui 初期化
npx shadcn@latest init -d  # style: new-york, baseColor: neutral, cssVariables: yes

# 4. shadcn/ui コンポーネント追加
npx shadcn@latest add button card avatar badge input select tabs dropdown-menu \
  dialog toast form label checkbox switch textarea table tooltip popover \
  separator scroll-area progress skeleton alert

# 5. Prisma 初期化
npx prisma init

# 6. globals.css にデザイントークンを貼り付け（本ドキュメントのセクション4参照）

# 7. 環境変数設定 (.env.local)
# Clerk, Neon DB, Webhook Secret の各キーを設定

# 8. Prisma マイグレーション
npx prisma db push

# 9. 開発サーバー起動
pnpm dev
```
