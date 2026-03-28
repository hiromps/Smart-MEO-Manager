import Link from "next/link"
import { redirect } from "next/navigation"

import Dashboard from "@/dashboard"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ensureAppUser, getAuth0User } from "@/lib/auth0-user"
import { getDashboardData } from "@/lib/dashboard-data"

export default async function Home() {
  const user = await getAuth0User()
  const googleConnection = process.env.AUTH0_GOOGLE_CONNECTION ?? "google-oauth2"

  if (user) {
    const appUser = await ensureAppUser(user)
    const dashboardData = await getDashboardData(user.sub)
    const logoutReturnTo = process.env.APP_BASE_URL ?? "http://localhost:3000"

    return (
      <Dashboard
        user={appUser}
        logoutHref={`/auth/logout?returnTo=${encodeURIComponent(logoutReturnTo)}`}
        locations={dashboardData.locations}
        reviews={dashboardData.reviews}
        stats={dashboardData.stats}
        isDemo={dashboardData.isDemo}
      />
    )
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(0,178,110,0.16),_transparent_35%),linear-gradient(180deg,_hsl(var(--background)),_hsl(var(--secondary)))] px-4 py-10">
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-4xl items-center">
        <div className="grid w-full gap-6 lg:grid-cols-[1.2fr,0.8fr] lg:items-center">
          <section className="space-y-6">
            <div className="space-y-3">
              <p className="text-sm font-medium uppercase tracking-[0.25em] text-primary">Smart MEO Manager</p>
              <h1 className="max-w-2xl text-4xl font-semibold tracking-tight md:text-6xl">
                ログインして口コミ運用ダッシュボードへ
              </h1>
              <p className="max-w-2xl text-sm leading-7 text-muted-foreground md:text-base">
                Auth0 でログインすると、GBP の口コミ一覧、返信案の生成、返信保存までをまとめて扱うダッシュボードに入れます。
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link href={`/auth/login?connection=${googleConnection}&returnTo=/`}>
                  Google でログイン
                </Link>
              </Button>
            </div>
          </section>

          <Card className="border-border/70 bg-card/95 shadow-xl">
            <CardHeader>
              <CardTitle>ログイン後に使える機能</CardTitle>
              <CardDescription>まずは口コミ返信の業務をそのまま置き換えるところから始めます。</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>・Auth0 認証</p>
              <p>・GBP 店舗連携</p>
              <p>・口コミ一覧と返信待ち管理</p>
              <p>・自動返信案の生成と保存</p>
              <p>・Turso + Prisma によるユーザー管理</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  )
}
