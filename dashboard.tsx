"use client"

import { BarChart3, LogOut, MapPinned, ShieldCheck, UserCircle2 } from "lucide-react"

import { useAuth } from "@/components/auth-wrapper"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const quickStats = [
  {
    title: "アカウント登録",
    description: "メールアドレスとパスワードでログインできる状態です。",
    icon: ShieldCheck,
  },
  {
    title: "Google 連携",
    description: "Google ログインを使うと GBP データ連携にも進めます。",
    icon: MapPinned,
  },
  {
    title: "運用ダッシュボード",
    description: "次の開発で店舗データや口コミ分析画面を拡張できます。",
    icon: BarChart3,
  },
]

export default function Dashboard() {
  const { user, logout } = useAuth()

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,_rgba(0,178,110,0.08),_transparent_25%),hsl(var(--background))] px-4 py-10">
      <div className="mx-auto flex max-w-5xl flex-col gap-6">
        <section className="rounded-3xl border border-border/70 bg-card/95 p-8 shadow-xl">
          <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
            <div className="space-y-3">
              <Badge variant="secondary" className="w-fit">
                認証済み
              </Badge>
              <div className="space-y-2">
                <h1 className="text-3xl font-semibold tracking-tight">ようこそ、{user?.name ?? "ユーザー"}さん</h1>
                <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
                  会員登録とログイン機能は有効化済みです。現在は認証基盤を優先して整備しており、ここから店舗データ連携や分析画面を追加できます。
                </p>
              </div>
            </div>

            <Button variant="outline" onClick={() => void logout()}>
              <LogOut className="mr-2 h-4 w-4" />
              ログアウト
            </Button>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          {quickStats.map((item) => {
            const Icon = item.icon

            return (
              <Card key={item.title} className="border-border/70">
                <CardHeader className="space-y-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="space-y-1">
                    <CardTitle className="text-lg">{item.title}</CardTitle>
                    <CardDescription>{item.description}</CardDescription>
                  </div>
                </CardHeader>
              </Card>
            )
          })}
        </section>

        <section className="grid gap-4 md:grid-cols-[1.4fr,1fr]">
          <Card className="border-border/70">
            <CardHeader>
              <CardTitle>登録済みユーザー情報</CardTitle>
              <CardDescription>会員登録後に保持している基本プロフィールです。</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-3 text-sm">
              <div className="flex items-center gap-3 rounded-2xl bg-muted/50 px-4 py-3">
                <UserCircle2 className="h-5 w-5 text-primary" />
                <div>
                  <div className="font-medium">名前</div>
                  <div className="text-muted-foreground">{user?.name ?? "-"}</div>
                </div>
              </div>
              <div className="rounded-2xl bg-muted/50 px-4 py-3">
                <div className="font-medium">メールアドレス</div>
                <div className="text-muted-foreground">{user?.email ?? "-"}</div>
              </div>
              <div className="rounded-2xl bg-muted/50 px-4 py-3">
                <div className="font-medium">ロール</div>
                <div className="text-muted-foreground">{user?.role ?? "user"}</div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/70">
            <CardHeader>
              <CardTitle>次の確認項目</CardTitle>
              <CardDescription>会員登録の動作確認で見るポイントです。</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>1. 新規メールアドレスで会員登録できること。</p>
              <p>2. 登録済みアカウントで credentials ログインできること。</p>
              <p>3. 重複メールアドレス登録が弾かれること。</p>
              <p>4. Google ログインが既存導線として残っていること。</p>
            </CardContent>
          </Card>
        </section>
      </div>
    </main>
  )
}
