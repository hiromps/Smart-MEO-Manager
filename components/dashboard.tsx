"use client"

import { useState } from "react"
import { useUser, useClerk, UserButton, OrganizationSwitcher } from "@clerk/nextjs"
import {
  Star,
  MessageSquare,
  TrendingUp,
  Users,
  Clock,
  ChevronDown,
  Search,
  Bell,
  Settings,
  LayoutDashboard,
  Store,
  BarChart3,
  Sparkles,
  FileText,
  LogOut,
  Menu,
  X,
  ExternalLink,
  Check,
  AlertCircle,
  ChevronRight,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Area,
  AreaChart,
  Bar,
  BarChart as RechartsBarChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"

interface DashboardProps {
  serverOrg: {
    id: string;
    clerkId: string;
    name: string;
    slug: string;
    imageUrl: string | null;
  } | null;
  serverUser: {
    id: string;
    clerkId: string;
    email: string;
    name: string | null;
    imageUrl: string | null;
  } | null;
}

export default function Dashboard({ serverOrg, serverUser }: DashboardProps) {
  const { user } = useUser()
  const { signOut } = useClerk()
  const [activeSection, setActiveSection] = useState("dashboard")
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [selectedLocation, setSelectedLocation] = useState("all")


  // Sample data for review trends
  const reviewTrendsData = [
    { date: "1月", reviews: 24, rating: 4.2 },
    { date: "2月", reviews: 31, rating: 4.3 },
    { date: "3月", reviews: 28, rating: 4.1 },
    { date: "4月", reviews: 35, rating: 4.4 },
    { date: "5月", reviews: 42, rating: 4.5 },
    { date: "6月", reviews: 38, rating: 4.3 },
  ]

  // Sample data for insights
  const insightsData = [
    { date: "月", searches: 1200, views: 850 },
    { date: "火", searches: 1400, views: 920 },
    { date: "水", searches: 1100, views: 780 },
    { date: "木", searches: 1600, views: 1100 },
    { date: "金", searches: 1800, views: 1250 },
    { date: "土", searches: 2200, views: 1600 },
    { date: "日", searches: 2000, views: 1400 },
  ]

  // Sample recent reviews
  const recentReviews = [
    {
      id: 1,
      author: "田中 太郎",
      rating: 5,
      comment: "素晴らしいサービスでした。スタッフの対応も丁寧で、また利用したいです。",
      date: "2時間前",
      status: "pending",
      location: "新宿店",
    },
    {
      id: 2,
      author: "佐藤 花子",
      rating: 4,
      comment: "料理は美味しかったですが、少し待ち時間が長かったです。",
      date: "5時間前",
      status: "draft",
      location: "渋谷店",
    },
    {
      id: 3,
      author: "鈴木 一郎",
      rating: 3,
      comment: "普通でした。特に良くも悪くもない印象です。",
      date: "1日前",
      status: "posted",
      location: "池袋店",
    },
    {
      id: 4,
      author: "高橋 美咲",
      rating: 5,
      comment: "最高の体験でした！友人にもおすすめしたいと思います。",
      date: "2日前",
      status: "posted",
      location: "新宿店",
    },
  ]

  const locations = [
    { id: "all", name: "全店舗" },
    { id: "shinjuku", name: "新宿店" },
    { id: "shibuya", name: "渋谷店" },
    { id: "ikebukuro", name: "池袋店" },
  ]

  const navItems = [
    { id: "dashboard", icon: LayoutDashboard, label: "ダッシュボード" },
    { id: "reviews", icon: MessageSquare, label: "口コミ管理" },
    { id: "analytics", icon: BarChart3, label: "MEO分析" },
    { id: "ai-settings", icon: Sparkles, label: "AI返信設定" },
    { id: "templates", icon: FileText, label: "テンプレート" },
    { id: "locations", icon: Store, label: "店舗管理" },
    { id: "settings", icon: Settings, label: "設定" },
  ]

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="outline" className="border-amber-500/50 bg-amber-50 text-amber-600">未対応</Badge>
      case "draft":
        return <Badge variant="outline" className="border-primary/50 bg-primary/10 text-primary">下書き</Badge>
      case "posted":
        return <Badge variant="outline" className="border-emerald-500/50 bg-emerald-50 text-emerald-600">返信済</Badge>
      default:
        return null
    }
  }

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-3.5 w-3.5 ${star <= rating ? "fill-amber-400 text-amber-400" : "text-muted-foreground"}`}
          />
        ))}
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-background">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 transform bg-card border-r border-border transition-transform duration-200 ease-in-out md:relative md:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-16 items-center justify-between border-b border-border px-4">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <Sparkles className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="text-lg font-semibold text-foreground">Smart MEO</span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 p-3">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveSection(item.id)
                  setSidebarOpen(false)
                }}
                className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  activeSection === item.id
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                }`}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </button>
            ))}
          </nav>

          {/* User section */}
          <div className="border-t border-border p-3 flex flex-col gap-2">
            <div className="px-3">
              {serverOrg ? (
                <OrganizationSwitcher
                  appearance={{
                    elements: {
                      rootBox: "w-full",
                      organizationSwitcherTrigger: "w-full flex items-center justify-between p-2 rounded-md border",
                    }
                  }}
                  hidePersonal={false}
                />
              ) : (
                <div className="rounded-md border border-border bg-secondary px-3 py-2 text-sm text-muted-foreground">
                  個人アカウント
                </div>
              )}
            </div>
            <div className="px-3 pt-2">
               <UserButton 
                 afterSignOutUrl="/sign-in"
                 showName={true}
               />
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Header */}
        <header className="flex h-16 items-center justify-between border-b border-border bg-card px-4 md:px-6">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </Button>

            <div className="hidden md:block">
              <h1 className="text-xl font-semibold text-foreground">ダッシュボード</h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Location Selector */}
            <Select value={selectedLocation} onValueChange={setSelectedLocation}>
              <SelectTrigger className="w-[140px] bg-secondary border-border">
                <Store className="mr-2 h-4 w-4 text-muted-foreground" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {locations.map((location) => (
                  <SelectItem key={location.id} value={location.id}>
                    {location.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Search */}
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="検索..."
                className="w-64 bg-secondary border-border pl-9"
              />
            </div>

            {/* Notifications */}
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-destructive" />
            </Button>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          {/* Period Selector */}
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-muted-foreground">2024年3月25日</p>
            </div>
            <Tabs defaultValue="week" className="w-auto">
              <TabsList className="bg-secondary">
                <TabsTrigger value="day">今日</TabsTrigger>
                <TabsTrigger value="week">今週</TabsTrigger>
                <TabsTrigger value="month">今月</TabsTrigger>
                <TabsTrigger value="custom">カスタム</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {/* KPI Cards */}
          <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card className="bg-card border-border">
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">総口コミ数</p>
                    <p className="mt-2 text-3xl font-bold text-foreground">1,284</p>
                    <div className="mt-1 flex items-center gap-1">
                      <TrendingUp className="h-3 w-3 text-emerald-500" />
                      <span className="text-xs text-emerald-600">+12%</span>
                      <span className="text-xs text-muted-foreground">先月比</span>
                    </div>
                  </div>
                  <div className="rounded-lg bg-primary/10 p-2.5">
                    <MessageSquare className="h-5 w-5 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">平均評価</p>
                    <p className="mt-2 text-3xl font-bold text-foreground">4.3</p>
                    <div className="mt-1 flex items-center gap-1">
                      {renderStars(4)}
                    </div>
                  </div>
                  <div className="rounded-lg bg-amber-100 p-2.5">
                    <Star className="h-5 w-5 text-amber-500" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">返信率</p>
                    <p className="mt-2 text-3xl font-bold text-foreground">94%</p>
                    <div className="mt-1 flex items-center gap-1">
                      <TrendingUp className="h-3 w-3 text-emerald-500" />
                      <span className="text-xs text-emerald-600">+5%</span>
                      <span className="text-xs text-muted-foreground">先月比</span>
                    </div>
                  </div>
                  <div className="rounded-lg bg-emerald-100 p-2.5">
                    <Check className="h-5 w-5 text-emerald-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">未対応口コミ</p>
                    <p className="mt-2 text-3xl font-bold text-foreground">8</p>
                    <div className="mt-1 flex items-center gap-1">
                      <Clock className="h-3 w-3 text-amber-500" />
                      <span className="text-xs text-amber-600">要対応</span>
                    </div>
                  </div>
                  <div className="rounded-lg bg-amber-100 p-2.5">
                    <AlertCircle className="h-5 w-5 text-amber-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Charts Row */}
          <div className="mb-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
            {/* Review Trends Chart */}
            <Card className="bg-card border-border">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div>
                  <CardTitle className="text-base font-medium">口コミ推移</CardTitle>
                  <CardDescription className="text-muted-foreground">月別の口コミ数と平均評価</CardDescription>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="text-muted-foreground">
                      6ヶ月 <ChevronDown className="ml-1 h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>3ヶ月</DropdownMenuItem>
                    <DropdownMenuItem>6ヶ月</DropdownMenuItem>
                    <DropdownMenuItem>1年</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </CardHeader>
              <CardContent>
                <div className="h-[240px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsBarChart data={reviewTrendsData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                      <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--card))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "8px",
                          color: "hsl(var(--foreground))",
                        }}
                        labelStyle={{ color: "hsl(var(--foreground))" }}
                      />
                      <Bar dataKey="reviews" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                    </RechartsBarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Insights Chart */}
            <Card className="bg-card border-border">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div>
                  <CardTitle className="text-base font-medium">検索・閲覧データ</CardTitle>
                  <CardDescription className="text-muted-foreground">Google検索での表示回数と閲覧数</CardDescription>
                </div>
                <div className="flex items-center gap-4 text-xs">
                  <div className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-primary" />
                    <span className="text-muted-foreground">検索表示</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-accent" />
                    <span className="text-muted-foreground">閲覧</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-[240px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={insightsData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="searchGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="viewGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="hsl(var(--accent))" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="hsl(var(--accent))" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                      <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--card))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "8px",
                          color: "hsl(var(--foreground))",
                        }}
                        labelStyle={{ color: "hsl(var(--foreground))" }}
                      />
                      <Area
                        type="monotone"
                        dataKey="searches"
                        stroke="hsl(var(--primary))"
                        strokeWidth={2}
                        fill="url(#searchGradient)"
                      />
                      <Area
                        type="monotone"
                        dataKey="views"
                        stroke="hsl(var(--accent))"
                        strokeWidth={2}
                        fill="url(#viewGradient)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Reviews and Quick Actions */}
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            {/* Recent Reviews */}
            <Card className="bg-card border-border lg:col-span-2">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-base font-medium">最新口コミ</CardTitle>
                  <CardDescription className="text-muted-foreground">直近の口コミと返信ステータス</CardDescription>
                </div>
                <Button variant="ghost" size="sm" className="text-primary">
                  すべて表示 <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentReviews.map((review) => (
                    <div
                      key={review.id}
                      className="flex items-start gap-4 rounded-lg border border-border bg-secondary/30 p-4 transition-colors hover:bg-secondary/50"
                    >
                      <Avatar className="h-10 w-10">
                        <AvatarFallback className="bg-primary/20 text-primary text-sm">
                          {review.author.slice(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-medium text-foreground">{review.author}</span>
                          {renderStars(review.rating)}
                          {getStatusBadge(review.status)}
                        </div>
                        <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{review.comment}</p>
                        <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
                          <span>{review.location}</span>
                          <span>{review.date}</span>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" className="shrink-0">
                        <Sparkles className="mr-1.5 h-3.5 w-3.5 text-primary" />
                        AI返信
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions & Stats */}
            <div className="space-y-4">
              {/* Quick Actions */}
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-base font-medium">クイックアクション</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button className="w-full justify-start bg-primary/10 text-primary hover:bg-primary/20" variant="ghost">
                    <Sparkles className="mr-2 h-4 w-4" />
                    一括AI返信生成
                  </Button>
                  <Button className="w-full justify-start" variant="ghost">
                    <MessageSquare className="mr-2 h-4 w-4" />
                    口コミを同期
                  </Button>
                  <Button className="w-full justify-start" variant="ghost">
                    <BarChart3 className="mr-2 h-4 w-4" />
                    レポートを出力
                  </Button>
                  <Button className="w-full justify-start" variant="ghost">
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Googleビジネスを開く
                  </Button>
                </CardContent>
              </Card>

              {/* Location Stats */}
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-base font-medium">店舗別パフォーマンス</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    { name: "新宿店", rating: 4.5, reviews: 523, change: "+8%" },
                    { name: "渋谷店", rating: 4.2, reviews: 412, change: "+12%" },
                    { name: "池袋店", rating: 4.4, reviews: 349, change: "+5%" },
                  ].map((location) => (
                    <div key={location.name} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-secondary">
                          <Store className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-foreground">{location.name}</p>
                          <div className="flex items-center gap-1">
                            <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                            <span className="text-xs text-muted-foreground">{location.rating}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-foreground">{location.reviews}</p>
                        <p className="text-xs text-emerald-600">{location.change}</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* AI Reply Stats */}
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-base font-medium">AI返信統計</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-foreground">156</p>
                      <p className="text-xs text-muted-foreground">今月生成</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-foreground">2.3秒</p>
                      <p className="text-xs text-muted-foreground">平均生成時間</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-foreground">92%</p>
                      <p className="text-xs text-muted-foreground">承認率</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
