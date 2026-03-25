"use client"

import { useState, useEffect, useMemo } from "react"
import { useAuth } from "@/components/auth-wrapper"
import { signIn, signOut as nextSignOut, useSession } from "next-auth/react"
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
  LineChart as LucideLineChart,
  PieChart,
  Calendar,
  Image as ImageIcon,
  Megaphone,
  Globe,
  FileBarChart,
  History,
  MousePointer2,
  Phone,
  Navigation,
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

export default function Dashboard() {
  const { user: demoUser, logout: demoLogout } = useAuth()
  const { data: session } = useSession()
  const [activeSection, setActiveSection] = useState("dashboard")
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [selectedLocation, setSelectedLocation] = useState("all")

  const user = session?.user || demoUser
  const logout = () => {
    if (session) nextSignOut()
    demoLogout()
  }

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

  const [locations, setLocations] = useState([
    { id: "all", name: "全店舗" },
    { id: "shinjuku", name: "新宿店" },
    { id: "shibuya", name: "渋谷店" },
    { id: "ikebukuro", name: "池袋店" },
  ])
  const [isSyncing, setIsSyncing] = useState(false)
  const [stats, setStats] = useState<any>(null)
  const [isLoadingStats, setIsLoadingStats] = useState(false)

  const fetchStats = async (locId: string) => {
    if (locId === "all") return;
    setIsLoadingStats(true)
    try {
      const response = await fetch(`/api/stats?locationId=${locId}`)
      const data = await response.json()
      if (!data.error) {
        setStats(data)
      }
    } catch (error) {
      console.error("Fetch stats error:", error)
    } finally {
      setIsLoadingStats(false)
    }
  }

  useEffect(() => {
    if (selectedLocation && selectedLocation !== "all") {
      fetchStats(selectedLocation)
    }
  }, [selectedLocation])

  const chartData = useMemo(() => {
    if (!stats) return insightsData;
    
    // 日付をキーにしたマップを作成
    const dateMap: Record<string, any> = {};
    
    const processMetric = (metricName: string, label: string) => {
      if (!stats[metricName]) return;
      stats[metricName].forEach((item: any) => {
        const dateStr = `${item.date.month}/${item.date.day}`;
        if (!dateMap[dateStr]) {
          dateMap[dateStr] = { date: dateStr, views: 0, searches: 0, directions: 0 };
        }
        // マッピング: ウェブサイト->views, 電話->searches, ルート->directions
        if (metricName === "WEBSITE_CLICKS") dateMap[dateStr].views += parseInt(item.value || 0);
        if (metricName === "CALL_CLICKS") dateMap[dateStr].searches += parseInt(item.value || 0);
        if (metricName === "DRIVING_DIRECTIONS") dateMap[dateStr].directions += parseInt(item.value || 0);
      });
    };

    processMetric("WEBSITE_CLICKS", "ウェブサイト");
    processMetric("CALL_CLICKS", "電話");
    processMetric("DRIVING_DIRECTIONS", "ルート検索");

    const result = Object.values(dateMap).sort((a: any, b: any) => {
       const [am, ad] = a.date.split("/").map(Number);
       const [bm, bd] = b.date.split("/").map(Number);
       return am !== bm ? am - bm : ad - bd;
    });

    return result.length > 0 ? result : insightsData;
  }, [stats]);

  // Sample data for keywords
  const keywordData = [
    { id: 1, name: "新宿 カフェ", average: 2.1, change: -1 },
    { id: 2, name: "新宿 ランチ", average: 4.5, change: 2 },
    { id: 3, name: "新宿 コーヒー", average: 1.8, change: 0 },
    { id: 4, name: "新宿 喫茶店", average: 3.2, change: -3 },
  ]

  const rankHistoryData = [
    { date: "03/19", kw1: 2, kw2: 5, kw3: 2, kw4: 5 },
    { date: "03/20", kw1: 2, kw2: 6, kw3: 1, kw4: 4 },
    { date: "03/21", kw1: 3, kw2: 4, kw3: 2, kw4: 4 },
    { date: "03/22", kw1: 2, kw2: 5, kw3: 2, kw4: 3 },
    { date: "03/23", kw1: 1, kw2: 4, kw3: 1, kw4: 3 },
    { date: "03/24", kw1: 2, kw2: 4, kw3: 2, kw4: 3 },
    { date: "03/25", kw1: 2, kw2: 5, kw3: 2, kw4: 2 },
  ]

  // Sample data for posts
  const postData = [
    { id: 1, title: "春の新作ランチメニュー開始!", type: "最新情報", date: "2026/03/20", views: 245, clicks: 18, status: "published" },
    { id: 2, title: "3/28 臨時休業のお知らせ", type: "最新情報", date: "2026/03/28", views: 0, clicks: 0, status: "scheduled" },
    { id: 3, title: "【平日限定】コーヒー1杯無料クーポン", type: "特典", date: "2026/03/15", views: 512, clicks: 89, status: "published" },
  ]

  const fetchLocations = async () => {
    setIsSyncing(true)
    try {
      const response = await fetch("/api/locations")
      const data = await response.json()
      if (Array.isArray(data)) {
        const formattedLocations = [
          { id: "all", name: "全店舗" },
          ...data.map((loc: any) => ({
            id: loc.name.split("/").pop(), // "locations/123" -> "123"
            name: loc.title || loc.locationName || "名称不明"
          }))
        ]
        setLocations(formattedLocations)
      }
    } catch (error) {
      console.error("Fetch locations error:", error)
    } finally {
      setIsSyncing(false)
    }
  }

  const navGroups = [
    {
      label: "メイン",
      items: [
        { id: "dashboard", icon: LayoutDashboard, label: "ダッシュボード" },
        { id: "ai-assistant", icon: Sparkles, label: "AI運用アシスタント" },
      ]
    },
    {
      label: "データ分析",
      items: [
        { id: "insights", icon: PieChart, label: "Googleインサイト" },
        { id: "regional-compare", icon: Globe, label: "都道府県別比較" },
        { id: "cross-analysis", icon: BarChart3, label: "インサイトクロス分析" },
      ]
    },
    {
      label: "順位レポート",
      items: [
        { id: "rank-chart", icon: LucideLineChart, label: "順位チャート" },
        { id: "keyword-analysis", icon: Search, label: "キーワード分析" },
        { id: "rank-calendar", icon: Calendar, label: "カレンダー順位レポート" },
      ]
    },
    {
      label: "管理・運用",
      items: [
        { id: "posts", icon: Megaphone, label: "投稿管理" },
        { id: "photos", icon: ImageIcon, label: "写真管理" },
        { id: "reviews", icon: MessageSquare, label: "口コミ管理" },
        { id: "ai-reply", icon: Sparkles, label: "AI一括返信" },
      ]
    },
    {
      label: "設定",
      items: [
        { id: "settings", icon: Settings, label: "店舗・アカウント設定" },
      ]
    }
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

  const getActiveSectionLabel = (sectionId: string) => {
    for (const group of navGroups) {
      const item = group.items.find(i => i.id === sectionId);
      if (item) {
        return item.label;
      }
    }
    return "不明な画面";
  };

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

          {/* Navigation Groups */}
          <div className="flex-1 overflow-y-auto py-4 px-3 space-y-6">
            {navGroups.map((group) => (
              <div key={group.label}>
                <p className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                  {group.label}
                </p>
                <div className="space-y-1">
                  {group.items.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveSection(item.id)
                        setSidebarOpen(false)
                      }}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        activeSection === item.id
                          ? "bg-primary text-primary-foreground shadow-sm"
                          : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                      }`}
                    >
                      <item.icon className="h-4 w-4" />
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* User section */}
          <div className="border-t border-border p-3">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm hover:bg-secondary transition-colors">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/placeholder.svg?height=32&width=32" />
                    <AvatarFallback className="bg-primary/20 text-primary">{user?.name?.slice(0, 2) || "G"}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 text-left">
                    <p className="font-medium text-foreground">{user?.name || "ゲスト"}</p>
                    <p className="text-xs text-muted-foreground">{(user as any)?.role === "admin" ? "管理者" : "ユーザー"}</p>
                  </div>
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  アカウント設定
                </DropdownMenuItem>
                <DropdownMenuSeparator />
<DropdownMenuItem className="text-destructive" onClick={logout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    ログアウト
                  </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
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
        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-slate-50/50">
          {activeSection === "dashboard" && (
            <div className="space-y-6">
              {/* Period Selector & Top Section */}
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-foreground">ダッシュボード</h2>
                  <p className="text-sm text-muted-foreground">集計期間：2026/02/26 － 2026/03/25</p>
                </div>
                <div className="flex items-center gap-2">
                   <div className="bg-white border rounded-lg p-1 flex gap-1 shadow-sm">
                      <Button variant="ghost" size="sm" className="h-7 text-xs px-3">今日</Button>
                      <Button variant="ghost" size="sm" className="h-7 text-xs px-3 bg-primary/10 text-primary">今月</Button>
                      <Button variant="ghost" size="sm" className="h-7 text-xs px-3">カスタム</Button>
                   </div>
                   <Button size="sm" className="gap-2">
                     <FileBarChart className="h-4 w-4" />
                     レポート出力
                   </Button>
                </div>
              </div>

              {/* KPI Cards (GMO Style) */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="border-l-4 border-l-blue-500 shadow-sm overflow-hidden">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground mb-1">全体閲覧ユーザー数</p>
                        <div className="flex items-baseline gap-2">
                          <h3 className="text-2xl font-bold tracking-tight">
                            {stats ? (
                              (stats.BUSINESS_IMPRESSIONS_DESKTOP_MAPS?.reduce((a: any, b: any) => a + parseInt(b.value || 0), 0) || 0) +
                              (stats.BUSINESS_IMPRESSIONS_MOBILE_MAPS?.reduce((a: any, b: any) => a + parseInt(b.value || 0), 0) || 0) +
                              (stats.BUSINESS_IMPRESSIONS_DESKTOP_SEARCH?.reduce((a: any, b: any) => a + parseInt(b.value || 0), 0) || 0) +
                              (stats.BUSINESS_IMPRESSIONS_MOBILE_SEARCH?.reduce((a: any, b: any) => a + parseInt(b.value || 0), 0) || 0)
                            ).toLocaleString() : "4,381"}
                            <span className="text-xs font-normal text-muted-foreground ml-1">回</span>
                          </h3>
                          <span className="text-[10px] font-medium text-blue-600 flex items-center">
                            <TrendingUp className="h-3 w-3 mr-0.5" /> {stats ? "-" : "365 (8.3%)"}
                          </span>
                        </div>
                      </div>
                      <div className="p-2 bg-blue-50 rounded-lg">
                        <Users className="h-5 w-5 text-blue-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-l-emerald-500 shadow-sm overflow-hidden">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground mb-1">全体アクション数</p>
                        <div className="flex items-baseline gap-2">
                          <h3 className="text-2xl font-bold tracking-tight">
                            {stats ? (
                              (stats.WEBSITE_CLICKS?.reduce((a: any, b: any) => a + parseInt(b.value || 0), 0) || 0) +
                              (stats.CALL_CLICKS?.reduce((a: any, b: any) => a + parseInt(b.value || 0), 0) || 0) +
                              (stats.DRIVING_DIRECTIONS?.reduce((a: any, b: any) => a + parseInt(b.value || 0), 0) || 0)
                            ).toLocaleString() : "682"}
                            <span className="text-xs font-normal text-muted-foreground ml-1">回</span>
                          </h3>
                          <span className="text-[10px] font-medium text-emerald-600 flex items-center">
                            <TrendingUp className="h-3 w-3 mr-0.5" /> {stats ? "-" : "257 (37%)"}
                          </span>
                        </div>
                      </div>
                      <div className="p-2 bg-emerald-50 rounded-lg">
                        <MousePointer2 className="h-5 w-5 text-emerald-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-l-indigo-500 shadow-sm overflow-hidden">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground mb-1">全体アクション率</p>
                        <div className="flex items-baseline gap-2">
                          <h3 className="text-2xl font-bold tracking-tight">
                            {stats ? (
                              (() => {
                                const views = (stats.BUSINESS_IMPRESSIONS_DESKTOP_MAPS?.reduce((a: any, b: any) => a + parseInt(b.value || 0), 0) || 0) +
                                  (stats.BUSINESS_IMPRESSIONS_MOBILE_MAPS?.reduce((a: any, b: any) => a + parseInt(b.value || 0), 0) || 0) +
                                  (stats.BUSINESS_IMPRESSIONS_DESKTOP_SEARCH?.reduce((a: any, b: any) => a + parseInt(b.value || 0), 0) || 0) +
                                  (stats.BUSINESS_IMPRESSIONS_MOBILE_SEARCH?.reduce((a: any, b: any) => a + parseInt(b.value || 0), 0) || 0);
                                const actions = (stats.WEBSITE_CLICKS?.reduce((a: any, b: any) => a + parseInt(b.value || 0), 0) || 0) +
                                  (stats.CALL_CLICKS?.reduce((a: any, b: any) => a + parseInt(b.value || 0), 0) || 0) +
                                  (stats.DRIVING_DIRECTIONS?.reduce((a: any, b: any) => a + parseInt(b.value || 0), 0) || 0);
                                return views > 0 ? (actions / views * 100).toFixed(2) : "0.00";
                              })()
                            ) : "15.57"}
                            <span className="text-lg font-normal">%</span>
                          </h3>
                          <span className="text-[10px] font-medium text-indigo-600 flex items-center">
                            <TrendingUp className="h-3 w-3 mr-0.5" /> {stats ? "-" : "4.22%"}
                          </span>
                        </div>
                      </div>
                      <div className="p-2 bg-indigo-50 rounded-lg">
                        <BarChart3 className="h-5 w-5 text-indigo-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-l-purple-500 shadow-sm overflow-hidden">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground mb-1">3位以内率</p>
                        <div className="flex items-baseline gap-2">
                          <h3 className="text-2xl font-bold tracking-tight">64.0 <span className="text-lg font-normal">%</span></h3>
                          <span className="text-[10px] font-medium text-purple-600 flex items-center">
                            <TrendingUp className="h-3 w-3 mr-0.5" /> 12%
                          </span>
                        </div>
                      </div>
                      <div className="p-2 bg-purple-50 rounded-lg">
                        <LucideLineChart className="h-5 w-5 text-purple-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Main Charts Row */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="shadow-sm">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <div>
                      <CardTitle className="text-base font-bold">Googleアクション回数</CardTitle>
                      <CardDescription>ウェブサイト、電話、ルートの合計</CardDescription>
                    </div>
                    <Button variant="ghost" size="sm" className="h-8 text-[11px]">詳細分析へ</Button>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[280px] w-full mt-4">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart
                          data={chartData}
                          margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                        >
                          <defs>
                            <linearGradient id="colorAction" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.1}/>
                              <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                          <XAxis 
                            dataKey="date" 
                            axisLine={false} 
                            tickLine={false} 
                            tick={{ fontSize: 11, fill: "#94a3b8" }}
                            dy={10}
                          />
                          <YAxis 
                            axisLine={false} 
                            tickLine={false} 
                            tick={{ fontSize: 11, fill: "#94a3b8" }}
                          />
                          <Tooltip 
                            contentStyle={{ borderRadius: "10px", border: "none", boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)" }}
                          />
                          <Area 
                            type="monotone" 
                            dataKey="views" 
                            name="ウェブサイト"
                            stroke="#3b82f6" 
                            strokeWidth={2.5}
                            fillOpacity={1} 
                            fill="url(#colorAction)" 
                          />
                          <Area 
                            type="monotone" 
                            dataKey="searches" 
                            name="電話"
                            stroke="#10b981" 
                            strokeWidth={2}
                            fillOpacity={0} 
                          />
                          <Area 
                            type="monotone" 
                            dataKey="directions" 
                            name="ルート検索"
                            stroke="#f59e0b" 
                            strokeWidth={2}
                            fillOpacity={0} 
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="flex justify-center gap-4 mt-4">
                       <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                         <div className="h-2 w-2 rounded-full bg-blue-500" /> Web
                       </div>
                       <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                         <div className="h-2 w-2 rounded-full bg-emerald-500" /> 電話
                       </div>
                       <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                         <div className="h-2 w-2 rounded-full bg-orange-500" /> ルート
                       </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="shadow-sm">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <div>
                      <CardTitle className="text-base font-bold">Google順位チャート</CardTitle>
                      <CardDescription>主要キーワード平均順位</CardDescription>
                    </div>
                    <Button variant="ghost" size="sm" className="h-8 text-[11px]">順位レポートへ</Button>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[280px] w-full mt-4">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart
                          data={reviewTrendsData}
                          margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                          <XAxis 
                            dataKey="date" 
                            axisLine={false} 
                            tickLine={false} 
                            tick={{ fontSize: 11, fill: "#94a3b8" }}
                            dy={10}
                          />
                          <YAxis 
                            reversed
                            domain={[1, 20]}
                            axisLine={false} 
                            tickLine={false} 
                            tick={{ fontSize: 11, fill: "#94a3b8" }}
                          />
                          <Tooltip 
                            contentStyle={{ borderRadius: "10px", border: "none", boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)" }}
                          />
                          <Area 
                            type="stepAfter" 
                            dataKey="rating" 
                            name="平均順位"
                            stroke="#8b5cf6" 
                            strokeWidth={3}
                            fillOpacity={0} 
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="mt-4 p-3 bg-indigo-50/50 rounded-lg flex justify-between items-center">
                       <span className="text-[11px] text-indigo-700 font-semibold">現在の平均順位</span>
                       <span className="font-bold text-xl text-indigo-800">3.2 <span className="text-xs font-normal">位</span></span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Lower Section (Calendar & Reviews) */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="shadow-sm">
                   <CardHeader className="pb-3 border-b border-slate-100 mb-4">
                      <CardTitle className="text-base font-bold flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-primary" />
                        カレンダー順位レポート
                      </CardTitle>
                   </CardHeader>
                   <CardContent>
                      <div className="grid grid-cols-7 gap-1 text-center">
                        {["月", "火", "水", "木", "金", "土", "日"].map(d => (
                          <div key={d} className="text-[10px] font-bold text-muted-foreground pb-2">{d}</div>
                        ))}
                        {Array.from({ length: 28 }).map((_, i) => (
                           <div key={i} className={`h-11 border rounded-md flex flex-col items-center justify-center gap-0.5 ${i % 7 === 0 || i % 7 === 6 ? 'bg-slate-50' : 'bg-white'}`}>
                             <span className="text-[9px] text-slate-400">{i + 1}</span>
                             <span className={`text-xs font-bold ${i < 5 ? 'text-blue-600' : i < 15 ? 'text-emerald-600' : 'text-slate-400'}`}>
                               {i < 15 ? Math.floor(Math.random() * 5) + 1 : "-"}
                             </span>
                           </div>
                        ))}
                      </div>
                      <div className="mt-4 flex items-center justify-between text-[11px] text-muted-foreground">
                         <div className="flex items-center gap-3">
                            <span className="flex items-center gap-1"><div className="w-2 h-2 rounded bg-blue-500" /> 1-3位</span>
                            <span className="flex items-center gap-1"><div className="w-2 h-2 rounded bg-emerald-500" /> 4-10位</span>
                         </div>
                         <Button variant="ghost" size="sm" className="h-6 text-[11px] text-primary">もっと見る</Button>
                      </div>
                   </CardContent>
                </Card>

                <Card className="shadow-sm">
                  <CardHeader className="flex flex-row items-center justify-between pb-3 border-b border-slate-100 mb-4">
                    <CardTitle className="text-base font-bold flex items-center gap-2">
                      <MessageSquare className="h-4 w-4 text-primary" />
                      最新の口コミ (Google)
                    </CardTitle>
                    <Badge variant="secondary" className="font-normal text-[10px] px-2 h-5">
                      未返信 12件
                    </Badge>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {recentReviews.slice(0, 2).map((review) => (
                      <div key={review.id} className="p-3 border rounded-xl bg-slate-50/50 hover:bg-slate-50 transition-colors flex flex-col gap-2">
                        <div className="flex items-center justify-between">
                           <div className="flex items-center gap-2">
                             <Avatar className="h-7 w-7 border">
                               <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${review.author}`} />
                               <AvatarFallback>{review.author[0]}</AvatarFallback>
                             </Avatar>
                             <div className="flex flex-col">
                               <span className="text-xs font-bold leading-none">{review.author}</span>
                               <span className="text-[9px] text-muted-foreground mt-0.5">{review.date}</span>
                             </div>
                           </div>
                           {renderStars(review.rating)}
                        </div>
                        <p className="text-xs text-foreground/80 leading-relaxed line-clamp-2">{review.comment}</p>
                        <div className="flex justify-between items-center mt-1">
                          <Badge variant="outline" className="text-[9px] font-normal h-5 border-slate-200">
                             {review.location}
                          </Badge>
                          <Button size="sm" variant="outline" className="h-7 text-[10px] py-0 border-primary/20 text-primary hover:bg-primary/5 font-semibold">
                            AI返信作成
                          </Button>
                        </div>
                      </div>
                    ))}
                    <Button variant="outline" className="w-full text-xs h-9 border-dashed">口コミ管理画面で詳細を見る</Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {activeSection === "settings" && (
            <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="flex items-center gap-2 mb-2">
                 <Settings className="h-5 w-5 text-primary" />
                 <h2 className="text-2xl font-bold">店舗・アカウント設定</h2>
              </div>
              
              <Card className="shadow-sm overflow-hidden border-t-4 border-t-primary">
                <CardHeader>
                  <CardTitle className="text-lg">Googleビジネスプロフィール連携</CardTitle>
                  <CardDescription>
                    Googleマイビジネスのデータを安全に同期します。
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 pt-0">
                  <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="h-14 w-14 rounded-full bg-white flex items-center justify-center shadow-sm border border-slate-200">
                        {session?.user?.image ? (
                          <img src={session.user.image} alt="User" className="h-12 w-12 rounded-full" />
                        ) : (
                          <img src="https://www.google.com/favicon.ico" alt="Google" className="h-7 w-7" />
                        )}
                      </div>
                      <div className="text-center sm:text-left">
                        <p className="font-bold text-slate-800">{session?.user?.name || "Google アカウント"}</p>
                        <p className="text-xs text-slate-500 font-medium">{session ? (session.user?.email || "アカウント接続済み") : "未連携"}</p>
                      </div>
                    </div>
                    {session ? (
                      <div className="flex flex-wrap justify-center gap-2">
                        <Button variant="outline" className="bg-white" onClick={fetchLocations} disabled={isSyncing}>
                          {isSyncing ? "同期中..." : "店舗情報を更新"}
                        </Button>
                        <Button variant="outline" className="text-destructive border-destructive hover:bg-destructive/10" onClick={() => nextSignOut()}>連携解除</Button>
                      </div>
                    ) : (
                      <Button className="font-bold gap-2 px-6" onClick={() => signIn("google")}>
                        <Globe className="h-4 w-4" />
                        Googleと連携する
                      </Button>
                    )}
                  </div>

                  {locations.length > 4 && (
                    <div className="mt-4 p-5 border rounded-2xl bg-white shadow-sm">
                       <h4 className="text-sm font-bold mb-4 flex items-center gap-2">
                          <Store className="h-4 w-4 text-primary" />
                          同期中の店舗
                       </h4>
                       <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                         {locations.filter(l => l.id !== "all").map(loc => (
                           <div key={loc.id} className="p-3 border border-slate-100 rounded-xl text-xs font-semibold bg-slate-50/50 flex items-center gap-3">
                             <div className="h-2 w-2 rounded-full bg-emerald-500" />
                             {loc.name}
                           </div>
                         ))}
                       </div>
                    </div>
                  )}
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                    <div className="p-4 rounded-xl bg-slate-50/80 border border-slate-100">
                        <h5 className="text-[11px] font-bold text-slate-400 uppercase mb-3 px-1">セキュリティ & プライバシー</h5>
                        <p className="text-xs text-slate-600 leading-relaxed px-1">
                          トークンはAES-256で暗号化され、統計情報の取得と口コミへの自動返信以外の目的には使用されません。
                        </p>
                    </div>
                    <div className="p-4 rounded-xl bg-slate-50/80 border border-slate-100">
                        <h5 className="text-[11px] font-bold text-slate-400 uppercase mb-3 px-1">アクセス権限範囲</h5>
                        <ul className="text-xs text-slate-600 space-y-2 list-none px-1">
                          <li className="flex items-center gap-2"><Check className="h-3 w-3 text-emerald-500" /> 店舗インサイトの閲覧</li>
                          <li className="flex items-center gap-2"><Check className="h-3 w-3 text-emerald-500" /> 口コミの管理と返信</li>
                        </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeSection === "rank-chart" && (
            <div className="space-y-6 animate-in fade-in duration-300">
               <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-foreground">順位チャート</h2>
                  <p className="text-sm text-muted-foreground">主要キーワードの検索順位推移を表示します。</p>
                </div>
                <div className="flex items-center gap-2">
                   <Button variant="outline" size="sm" className="gap-2">
                     <History className="h-4 w-4" />
                     履歴を同期
                   </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Keyword List */}
                <Card className="lg:col-span-1 shadow-sm">
                   <CardHeader className="pb-3 px-4">
                      <CardTitle className="text-sm font-bold">キーワード</CardTitle>
                   </CardHeader>
                   <CardContent className="px-2 pb-2">
                      <div className="space-y-1">
                        {keywordData.map(kw => (
                           <button key={kw.id} className="w-full text-left px-3 py-2 rounded-lg text-xs hover:bg-secondary flex items-center justify-between group">
                              <span className="font-medium text-slate-700">{kw.name}</span>
                              <div className="flex items-center gap-2">
                                 <span className="font-bold text-primary">{kw.average}</span>
                                 <Badge variant="outline" className={`p-0 px-1 text-[10px] ${kw.change < 0 ? 'text-blue-500 border-blue-500/20' : kw.change > 0 ? 'text-red-500 border-red-500/20' : 'text-slate-400 border-slate-200'}`}>
                                    {kw.change < 0 ? `↑${Math.abs(kw.change)}` : kw.change > 0 ? `↓${kw.change}` : '-'}
                                 </Badge>
                              </div>
                           </button>
                        ))}
                      </div>
                      <Button variant="ghost" className="w-full mt-2 h-8 text-[11px] text-muted-foreground border-dashed border">
                        キーワードを追加
                      </Button>
                   </CardContent>
                </Card>

                {/* Rank Chart */}
                <Card className="lg:col-span-3 shadow-sm">
                  <CardHeader className="flex flex-row items-center justify-between pb-2 border-b border-slate-50">
                    <CardTitle className="text-sm font-bold">順位推移グラフ</CardTitle>
                    <div className="flex gap-2">
                        <div className="flex items-center gap-3 px-3 py-1 bg-slate-50 rounded-full">
                           <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-blue-500" /><span className="text-[10px]">カフェ</span></div>
                           <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-emerald-500" /><span className="text-[10px]">ランチ</span></div>
                           <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-orange-500" /><span className="text-[10px]">コーヒー</span></div>
                        </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="h-[350px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart
                          data={rankHistoryData}
                          margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                          <XAxis 
                            dataKey="date" 
                            axisLine={false} 
                            tickLine={false} 
                            tick={{ fontSize: 11, fill: "#94a3b8" }}
                          />
                          <YAxis 
                            reversed
                            domain={[1, 10]}
                            ticks={[1, 3, 5, 10]}
                            axisLine={false} 
                            tickLine={false} 
                            tick={{ fontSize: 11, fill: "#94a3b8" }}
                          />
                          <Tooltip 
                            contentStyle={{ borderRadius: "10px", border: "none", boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)" }}
                          />
                          <Area type="monotone" dataKey="kw1" stroke="#3b82f6" strokeWidth={3} fillOpacity={0} />
                          <Area type="monotone" dataKey="kw2" stroke="#10b981" strokeWidth={3} fillOpacity={0} />
                          <Area type="monotone" dataKey="kw3" stroke="#f59e0b" strokeWidth={3} fillOpacity={0} />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Day-by-Day Rank Table */}
              <Card className="shadow-sm">
                <CardHeader>
                  <CardTitle className="text-sm font-bold">日次順位データテーブル</CardTitle>
                </CardHeader>
                <CardContent className="p-0 overflow-x-auto">
                   <table className="w-full text-left border-collapse">
                      <thead>
                         <tr className="bg-slate-50 border-y text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                            <th className="px-6 py-3 font-bold">キーワード</th>
                            {rankHistoryData.map(h => (
                               <th key={h.date} className="px-2 py-3 text-center">{h.date}</th>
                            ))}
                            <th className="px-6 py-3 text-right">平均</th>
                         </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                         {[
                           { name: "新宿 カフェ", key: "kw1", color: "bg-blue-500" },
                           { name: "新宿 ランチ", key: "kw2", color: "bg-emerald-500" },
                           { name: "新宿 コーヒー", key: "kw3", color: "bg-orange-500" },
                           { name: "新宿 喫茶店", key: "kw4", color: "bg-slate-400" },
                         ].map(kw => (
                            <tr key={kw.key} className="hover:bg-slate-50/50 transition-colors">
                               <td className="px-6 py-4 flex items-center gap-3">
                                  <div className={`w-2 h-2 rounded-full ${kw.color}`} />
                                  <span className="text-xs font-bold text-slate-700">{kw.name}</span>
                               </td>
                               {rankHistoryData.map(h => (
                                  <td key={h.date} className="px-2 py-4 text-center">
                                     <span className={`text-xs font-bold ${(h as any)[kw.key] <= 3 ? 'text-blue-600' : 'text-slate-600'}`}>
                                        {(h as any)[kw.key]}
                                     </span>
                                  </td>
                               ))}
                               <td className="px-6 py-4 text-right">
                                  <span className="text-xs font-bold text-slate-900">2.4</span>
                               </td>
                            </tr>
                         ))}
                      </tbody>
                   </table>
                </CardContent>
              </Card>
            </div>
          )}
          {activeSection === "posts" && (
            <div className="space-y-6 animate-in fade-in duration-300 text-slate-700">
               <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">投稿管理</h2>
                  <p className="text-sm text-muted-foreground">Googleビジネスプロフィールへの投稿を管理・予約します。</p>
                </div>
                <div className="flex items-center gap-2">
                   <Button className="gap-2 bg-primary hover:bg-primary/90">
                     <Megaphone className="h-4 w-4" />
                     新規投稿を作成
                   </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                 <Card className="bg-white border-none shadow-sm h-full">
                    <CardContent className="p-4 flex items-center gap-4">
                       <div className="p-3 bg-blue-50 rounded-2xl"><Megaphone className="h-5 w-5 text-blue-600" /></div>
                       <div>
                          <p className="text-[10px] font-bold text-slate-400 uppercase">今月の投稿数</p>
                          <p className="text-xl font-bold">12 <span className="text-xs font-normal">件</span></p>
                       </div>
                    </CardContent>
                 </Card>
                 <Card className="bg-white border-none shadow-sm">
                    <CardContent className="p-4 flex items-center gap-4">
                       <div className="p-3 bg-emerald-50 rounded-2xl"><Users className="h-5 w-5 text-emerald-600" /></div>
                       <div>
                          <p className="text-[10px] font-bold text-slate-400 uppercase">総閲覧数</p>
                          <p className="text-xl font-bold">1,248 <span className="text-xs font-normal">回</span></p>
                       </div>
                    </CardContent>
                 </Card>
                 <Card className="bg-white border-none shadow-sm">
                    <CardContent className="p-4 flex items-center gap-4">
                       <div className="p-3 bg-indigo-50 rounded-2xl"><Sparkles className="h-5 w-5 text-indigo-600" /></div>
                       <div>
                          <p className="text-[10px] font-bold text-slate-400 uppercase">平均クリック率</p>
                          <p className="text-xl font-bold">8.4 <span className="text-xs font-normal">%</span></p>
                       </div>
                    </CardContent>
                 </Card>
              </div>

              <Card className="shadow-sm border-none bg-white overflow-hidden">
                <CardHeader className="flex flex-row items-center justify-between border-b border-slate-50">
                   <div className="flex items-center gap-4">
                      <CardTitle className="text-base font-bold">投稿一覧</CardTitle>
                      <div className="flex gap-1">
                        <Badge className="bg-primary/10 text-primary border-none hover:bg-primary/10 cursor-pointer">すべて</Badge>
                        <Badge variant="outline" className="text-slate-400 hover:bg-slate-50 cursor-pointer border-none font-normal">予約中</Badge>
                        <Badge variant="outline" className="text-slate-400 hover:bg-slate-50 cursor-pointer border-none font-normal">公開済</Badge>
                      </div>
                   </div>
                   <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" className="h-8 text-[11px] gap-1 px-4">
                         <History className="h-3 w-3" /> 履歴取得
                      </Button>
                   </div>
                </CardHeader>
                <CardContent className="p-0">
                   <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                         <thead>
                            <tr className="bg-slate-50/50 border-b text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                               <th className="px-6 py-4">投稿内容</th>
                               <th className="px-4 py-4">タイプ</th>
                               <th className="px-4 py-4">ステータス</th>
                               <th className="px-4 py-4">公開・予約日</th>
                               <th className="px-4 py-4">閲覧 / クリック</th>
                               <th className="px-6 py-4 text-right">操作</th>
                            </tr>
                         </thead>
                         <tbody className="divide-y divide-slate-50">
                            {postData.map(post => (
                               <tr key={post.id} className="hover:bg-slate-50/30 transition-colors group">
                                  <td className="px-6 py-4">
                                     <div className="flex flex-col gap-0.5 max-w-[300px]">
                                        <span className="text-xs font-bold text-slate-800 truncate">{post.title}</span>
                                        <span className="text-[10px] text-slate-400 line-clamp-1">春の訪れを感じる新メニューが登場しました。ぜひお立ち寄りください...</span>
                                     </div>
                                  </td>
                                  <td className="px-4 py-4">
                                     <Badge variant="outline" className="text-[10px] font-medium border-slate-200 text-slate-500 bg-white">
                                        {post.type}
                                     </Badge>
                                  </td>
                                  <td className="px-4 py-4">
                                     <div className="flex items-center gap-1.5">
                                        <div className={`h-1.5 w-1.5 rounded-full ${post.status === 'published' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                                        <span className={`text-[11px] font-bold ${post.status === 'published' ? 'text-emerald-600' : 'text-amber-600'}`}>
                                           {post.status === 'published' ? '公開済' : '公開待ち'}
                                        </span>
                                     </div>
                                  </td>
                                  <td className="px-4 py-4">
                                     <span className="text-[11px] font-medium text-slate-500">{post.date}</span>
                                  </td>
                                  <td className="px-4 py-4">
                                     <div className="flex items-center gap-3">
                                        <div className="flex flex-col">
                                           <span className="text-[11px] font-bold text-slate-700">{post.views}</span>
                                           <span className="text-[8px] text-slate-400 uppercase">Views</span>
                                        </div>
                                        <div className="flex flex-col">
                                           <span className="text-[11px] font-bold text-slate-700">{post.clicks}</span>
                                           <span className="text-[8px] text-slate-400 uppercase">Clicks</span>
                                        </div>
                                     </div>
                                  </td>
                                  <td className="px-6 py-4 text-right">
                                     <div className="flex justify-end gap-1 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-primary"><FileText className="h-4 w-4" /></Button>
                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-destructive"><X className="h-4 w-4" /></Button>
                                     </div>
                                  </td>
                               </tr>
                            ))}
                         </tbody>
                      </table>
                   </div>
                </CardContent>
              </Card>

              {/* Bulk Post Hint */}
              <div className="p-6 bg-indigo-600 rounded-3xl text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl shadow-indigo-100">
                 <div className="flex items-center gap-6 text-center sm:text-left">
                    <div className="h-16 w-16 bg-white/20 rounded-2xl flex items-center justify-center shrink-0">
                       <Sparkles className="h-8 w-8 text-white" />
                    </div>
                    <div>
                       <h3 className="text-lg font-bold">複数店舗への一括投稿</h3>
                       <p className="text-white/80 text-xs mt-1">
                          作成した投稿を最大100店舗まで一度に配信できます。キャンペーン告知に最適です。
                       </p>
                    </div>
                 </div>
                 <Button className="bg-white text-indigo-600 hover:bg-indigo-50 font-bold px-8 h-11 rounded-xl">今すぐ試す</Button>
              </div>
            </div>
          )}

          {(activeSection !== "dashboard" && activeSection !== "settings" && activeSection !== "rank-chart" && activeSection !== "posts") && (
            <div className="flex flex-col items-center justify-center h-[70vh] text-center p-6 animate-in zoom-in-95 duration-500">
              <div className="bg-white border shadow-xl p-10 rounded-3xl max-w-lg border-primary/10">
                <div className="w-20 h-20 bg-primary/5 rounded-full flex items-center justify-center mx-auto mb-6">
                   <Sparkles className="h-10 w-10 text-primary animate-pulse" />
                </div>
                <h3 className="text-2xl font-bold mb-3">「{getActiveSectionLabel(activeSection)}」を準備中</h3>
                <p className="text-slate-500 leading-relaxed mb-8">
                  SMM 準拠の高度な分析・管理機能を現在実装中です。<br />
                  次回のアップデートをお楽しみに！
                </p>
                <Button className="w-full h-11 font-bold rounded-xl shadow-lg shadow-primary/20" onClick={() => setActiveSection("dashboard")}>
                  ダッシュボードへ戻る
                </Button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
