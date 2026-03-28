"use client"

import { useEffect, useMemo, useState, useTransition } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  ArrowRight,
  Building2,
  CheckCheck,
  Clock3,
  Loader2,
  LogOut,
  MailPlus,
  MessageSquareQuote,
  RefreshCw,
  Send,
  ShieldCheck,
  Sparkles,
  Star,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import { buildAutoReplyDraft, type ReplyLength, type ReplyTone } from "@/lib/review-automation"

type DashboardUser = {
  name: string | null
  email: string | null
  role: string
}

type DashboardLocation = {
  id: string
  name: string
  googleLocationId: string
}

type DashboardReview = {
  id: string
  reviewerName: string
  rating: number
  comment: string | null
  postedAt: string
  replyText: string | null
  repliedAt: string | null
  locationId: string
  locationName: string
  source: "live" | "demo"
}

type DashboardStats = {
  locationCount: number
  reviewCount: number
  pendingCount: number
  repliedCount: number
  averageRating: number
}

interface DashboardProps {
  user: DashboardUser
  logoutHref: string
  locations: DashboardLocation[]
  reviews: DashboardReview[]
  stats: DashboardStats
  isDemo: boolean
}

const ratingLabels: Record<number, string> = {
  1: "要対応",
  2: "改善",
  3: "標準",
  4: "良い",
  5: "高評価",
}

function formatDateTime(value: string) {
  return new Intl.DateTimeFormat("ja-JP", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value))
}

function ratingStars(rating: number) {
  return Array.from({ length: 5 }, (_, index) => (
    <Star
      key={index}
      className={cn(
        "h-4 w-4",
        index < rating ? "fill-amber-400 text-amber-400" : "text-muted-foreground/40"
      )}
    />
  ))
}

export default function Dashboard({
  user,
  logoutHref,
  locations,
  reviews,
  stats,
  isDemo,
}: DashboardProps) {
  const router = useRouter()
  const [selectedReviewId, setSelectedReviewId] = useState(reviews[0]?.id ?? "")
  const [tone, setTone] = useState<ReplyTone>("warm")
  const [length, setLength] = useState<ReplyLength>("medium")
  const [signature, setSignature] = useState(
    user.name ? `${user.name} / Smart MEO Manager` : "Smart MEO Manager"
  )
  const [draftText, setDraftText] = useState("")
  const [saveMessage, setSaveMessage] = useState<string | null>(null)
  const [saveError, setSaveError] = useState<string | null>(null)
  const [isSaving, startSaving] = useTransition()

  const selectedReview = useMemo(
    () => reviews.find((review) => review.id === selectedReviewId) ?? reviews[0] ?? null,
    [reviews, selectedReviewId]
  )

  useEffect(() => {
    if (!reviews.length) {
      setSelectedReviewId("")
      setDraftText("")
      return
    }

    if (!reviews.some((review) => review.id === selectedReviewId)) {
      setSelectedReviewId(reviews[0].id)
    }
  }, [reviews, selectedReviewId])

  useEffect(() => {
    if (!selectedReview) {
      setDraftText("")
      return
    }

    setDraftText(
      buildAutoReplyDraft(selectedReview, {
        tone,
        length,
        signature,
      })
    )
  }, [selectedReview?.id, tone, length, signature])

  const generateDraft = () => {
    if (!selectedReview) {
      return
    }

    setSaveMessage(null)
    setSaveError(null)
    setDraftText(
      buildAutoReplyDraft(selectedReview, {
        tone,
        length,
        signature,
      })
    )
  }

  const handleSaveReply = () => {
    if (!selectedReview) {
      return
    }

    if (selectedReview.source === "demo") {
      setSaveError("デモレビューは保存できません。実データ連携後に保存できます。")
      return
    }

    setSaveMessage(null)
    setSaveError(null)

    startSaving(async () => {
      try {
        const response = await fetch(`/api/reviews/${selectedReview.id}/reply`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ replyText: draftText }),
        })

        const payload = (await response.json()) as { error?: string; repliedAt?: string }

        if (!response.ok) {
          throw new Error(payload.error ?? "返信の保存に失敗しました。")
        }

        setSaveMessage(
          `返信を保存しました。${payload.repliedAt ? ` ${formatDateTime(payload.repliedAt)}` : ""}`
        )
        router.refresh()
      } catch (error) {
        setSaveError(error instanceof Error ? error.message : "返信の保存に失敗しました。")
      }
    })
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(0,178,110,0.16),_transparent_35%),linear-gradient(180deg,_hsl(var(--background)),_hsl(var(--secondary)))] px-4 py-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-6">
        <section className="overflow-hidden rounded-[2rem] border border-border/70 bg-card/95 shadow-[0_28px_90px_rgba(15,23,42,0.18)]">
          <div className="grid gap-8 p-8 lg:grid-cols-[1.25fr,0.75fr] lg:p-10">
            <div className="space-y-6">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="secondary" className="gap-1">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  Auth0 Signed In
                </Badge>
                <Badge variant={isDemo ? "outline" : "default"} className="gap-1">
                  {isDemo ? "デモデータ" : "実データ"}
                </Badge>
              </div>

              <div className="space-y-3">
                <p className="text-sm font-medium uppercase tracking-[0.28em] text-primary">
                  Smart MEO Manager
                </p>
                <h1 className="max-w-3xl text-4xl font-semibold tracking-tight md:text-6xl">
                  口コミ自動返信を中心にした管理ダッシュボード
                </h1>
                <p className="max-w-3xl text-sm leading-7 text-muted-foreground md:text-base">
                  Auth0 でログインした担当者が、GBP の口コミを確認し、返信案を生成して保存するための MVP です。
                  実データがまだない場合でも、デモレビューで返信フローをそのまま試せます。
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <Button asChild size="lg">
                  <Link href="#reply-studio">
                    返信スタジオへ
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <a href={logoutHref}>
                    <LogOut className="mr-2 h-4 w-4" />
                    ログアウト
                  </a>
                </Button>
              </div>
            </div>

            <Card className="border-border/70 bg-background/50 backdrop-blur">
              <CardHeader>
                <CardTitle>運用サマリー</CardTitle>
                <CardDescription>ログインユーザーと現在の GBP 接続状況をまとめています。</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                <div className="rounded-2xl bg-muted/50 px-4 py-3">
                  <div className="font-medium">担当者</div>
                  <div className="text-muted-foreground">{user.name ?? "ユーザー"}</div>
                  <div className="text-muted-foreground">{user.email ?? "-"}</div>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl bg-muted/50 px-4 py-3">
                    <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">連携店舗</div>
                    <div className="mt-2 text-2xl font-semibold">{stats.locationCount}</div>
                  </div>
                  <div className="rounded-2xl bg-muted/50 px-4 py-3">
                    <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">口コミ件数</div>
                    <div className="mt-2 text-2xl font-semibold">{stats.reviewCount}</div>
                  </div>
                </div>
                <Separator />
                <div className="flex items-center justify-between text-muted-foreground">
                  <span>平均評価</span>
                  <span className="font-medium text-foreground">{stats.averageRating.toFixed(1)} / 5.0</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-4">
          <Card className="border-border/70">
            <CardContent className="p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <MailPlus className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">返信待ち</div>
                  <div className="text-2xl font-semibold">{stats.pendingCount}</div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border/70">
            <CardContent className="p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600">
                  <CheckCheck className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">返信済み</div>
                  <div className="text-2xl font-semibold">{stats.repliedCount}</div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border/70">
            <CardContent className="p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-600">
                  <Star className="h-5 w-5 fill-amber-500 text-amber-500" />
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">平均評価</div>
                  <div className="text-2xl font-semibold">{stats.averageRating.toFixed(1)}</div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border/70">
            <CardContent className="p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-sky-500/10 text-sky-600">
                  <Building2 className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">店舗数</div>
                  <div className="text-2xl font-semibold">{locations.length}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        <section className="grid gap-4 xl:grid-cols-[1.15fr,0.85fr]">
          <Card id="reply-studio" className="border-border/70">
            <CardHeader className="space-y-2">
              <CardTitle>口コミ自動返信スタジオ</CardTitle>
              <CardDescription>
                口コミを選び、トーンを指定して返信案を生成します。保存は実データ連携時のみ可能です。
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 lg:grid-cols-[0.9fr,1.1fr]">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-medium">口コミキュー</div>
                  <Badge variant="outline">{reviews.length} 件</Badge>
                </div>

                <ScrollArea className="h-[28rem] pr-3">
                  <div className="space-y-3">
                    {reviews.map((review) => {
                      const isActive = review.id === selectedReviewId
                      const replied = Boolean(review.replyText || review.repliedAt)

                      return (
                        <button
                          key={review.id}
                          type="button"
                          onClick={() => setSelectedReviewId(review.id)}
                          className={cn(
                            "w-full rounded-2xl border p-4 text-left transition",
                            isActive
                              ? "border-primary bg-primary/5 shadow-sm"
                              : "border-border/70 bg-background hover:border-primary/40 hover:bg-muted/30"
                          )}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <span className="font-medium">{review.reviewerName}</span>
                                <Badge variant={replied ? "secondary" : "outline"}>
                                  {replied ? "返信済み" : "未返信"}
                                </Badge>
                              </div>
                              <div className="flex items-center gap-1">{ratingStars(review.rating)}</div>
                              <div className="text-xs text-muted-foreground">
                                {review.locationName} / {formatDateTime(review.postedAt)}
                              </div>
                            </div>
                            <Badge variant="outline">{ratingLabels[review.rating] ?? "口コミ"}</Badge>
                          </div>
                          <p className="mt-3 line-clamp-2 text-sm text-muted-foreground">
                            {review.comment ?? "コメントなし"}
                          </p>
                        </button>
                      )
                    })}
                  </div>
                </ScrollArea>
              </div>

              <div className="space-y-4 rounded-3xl border border-border/70 bg-muted/20 p-4">
                {selectedReview ? (
                  <>
                    <div className="space-y-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge variant="secondary">{selectedReview.locationName}</Badge>
                        <Badge variant={selectedReview.source === "demo" ? "outline" : "default"}>
                          {selectedReview.source === "demo" ? "デモ" : "実データ"}
                        </Badge>
                      </div>
                      <h2 className="text-2xl font-semibold">{selectedReview.reviewerName} への返信案</h2>
                      <div className="flex items-center gap-1">{ratingStars(selectedReview.rating)}</div>
                      <p className="text-sm text-muted-foreground">{selectedReview.comment ?? "コメントなし"}</p>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-3">
                      <div className="space-y-2">
                        <Label htmlFor="tone">トーン</Label>
                        <Select value={tone} onValueChange={(value) => setTone(value as ReplyTone)}>
                          <SelectTrigger id="tone">
                            <SelectValue placeholder="トーンを選択" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="warm">あたたかい</SelectItem>
                            <SelectItem value="professional">丁寧</SelectItem>
                            <SelectItem value="concise">短め</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="length">長さ</Label>
                        <Select value={length} onValueChange={(value) => setLength(value as ReplyLength)}>
                          <SelectTrigger id="length">
                            <SelectValue placeholder="長さを選択" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="short">短い</SelectItem>
                            <SelectItem value="medium">標準</SelectItem>
                            <SelectItem value="long">長い</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="signature">署名</Label>
                        <Input
                          id="signature"
                          value={signature}
                          onChange={(event) => setSignature(event.target.value)}
                          placeholder="店舗名 or 部署名"
                        />
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <Button type="button" variant="outline" onClick={generateDraft}>
                        <RefreshCw className="mr-2 h-4 w-4" />
                        返信案を再生成
                      </Button>
                      <Button
                        type="button"
                        onClick={handleSaveReply}
                        disabled={isSaving || selectedReview.source === "demo"}
                      >
                        {isSaving ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            保存中
                          </>
                        ) : (
                          <>
                            <Send className="mr-2 h-4 w-4" />
                            返信を保存
                          </>
                        )}
                      </Button>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="draft">返信ドラフト</Label>
                      <Textarea
                        id="draft"
                        value={draftText}
                        onChange={(event) => setDraftText(event.target.value)}
                        className="min-h-[240px] resize-none"
                        placeholder="返信案がここに表示されます"
                      />
                    </div>

                    {saveMessage ? (
                      <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-700">
                        {saveMessage}
                      </div>
                    ) : null}

                    {saveError ? (
                      <div className="rounded-2xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                        {saveError}
                      </div>
                    ) : null}
                  </>
                ) : (
                  <div className="flex min-h-[24rem] items-center justify-center rounded-3xl border border-dashed border-border/70 bg-background/50 text-sm text-muted-foreground">
                    口コミがありません。GBP 連携後に自動返信を開始できます。
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <div className="space-y-4">
            <Card className="border-border/70">
              <CardHeader>
                <CardTitle>自動返信ルール</CardTitle>
                <CardDescription>MVP はまずこのルールを基準に返信を作成します。</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                <div className="rounded-2xl bg-muted/50 px-4 py-3">
                  <div className="font-medium">5星・4星</div>
                  <div className="mt-1 text-muted-foreground">
                    感謝を先に伝え、評価された点を拾って再来店を促します。
                  </div>
                </div>
                <div className="rounded-2xl bg-muted/50 px-4 py-3">
                  <div className="font-medium">3星</div>
                  <div className="mt-1 text-muted-foreground">
                    中立的に受け止め、改善姿勢と次回体験の向上を伝えます。
                  </div>
                </div>
                <div className="rounded-2xl bg-muted/50 px-4 py-3">
                  <div className="font-medium">2星以下</div>
                  <div className="mt-1 text-muted-foreground">
                    謝意とお詫びを先に出し、事実確認と再発防止の姿勢を明確にします。
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/70">
              <CardHeader>
                <CardTitle>運用ステップ</CardTitle>
                <CardDescription>ログイン後に進める MVP の流れです。</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-muted-foreground">
                <div className="flex items-start gap-3">
                  <Clock3 className="mt-0.5 h-4 w-4 text-primary" />
                  <p>GBP の店舗情報を同期する</p>
                </div>
                <div className="flex items-start gap-3">
                  <MessageSquareQuote className="mt-0.5 h-4 w-4 text-primary" />
                  <p>最新の口コミを取得して、返信待ちを一覧化する</p>
                </div>
                <div className="flex items-start gap-3">
                  <Sparkles className="mt-0.5 h-4 w-4 text-primary" />
                  <p>口コミ内容から自動返信案を生成する</p>
                </div>
                <div className="flex items-start gap-3">
                  <Send className="mt-0.5 h-4 w-4 text-primary" />
                  <p>承認後に返信を保存し、対応履歴を残す</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/70">
              <CardHeader>
                <CardTitle>接続状況</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-muted-foreground">
                <div className="flex items-center justify-between rounded-2xl bg-muted/50 px-4 py-3">
                  <span>Auth0</span>
                  <Badge variant="secondary">Connected</Badge>
                </div>
                <div className="flex items-center justify-between rounded-2xl bg-muted/50 px-4 py-3">
                  <span>GBP / Google</span>
                  <Badge variant={isDemo ? "outline" : "secondary"}>{isDemo ? "Preview" : "Connected"}</Badge>
                </div>
                <div className="flex items-center justify-between rounded-2xl bg-muted/50 px-4 py-3">
                  <span>Turso / Prisma</span>
                  <Badge variant="secondary">Ready</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    </main>
  )
}
