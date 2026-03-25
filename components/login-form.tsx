"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Spinner } from "@/components/ui/spinner"
import { Eye, EyeOff, Mail, Lock, Leaf } from "lucide-react"

interface LoginFormProps {
  onLogin: (email: string, password: string) => Promise<void>
}

export function LoginForm({ onLogin }: LoginFormProps) {
  const [isRegister, setIsRegister] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [name, setName] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")
    
    if (isRegister) {
      if (!email || !password || !name || !confirmPassword) {
        setError("すべての項目を入力してください")
        return
      }
      if (password !== confirmPassword) {
        setError("パスワードが一致しません")
        return
      }
      if (password.length < 6) {
        setError("パスワードは6文字以上で入力してください")
        return
      }

      setIsLoading(true)
      try {
        const response = await fetch("/api/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password, confirmPassword, name }),
        })
        const data = await response.json()
        if (response.ok) {
          setSuccess("登録が完了しました。ログインしてください。")
          setIsRegister(false)
          setPassword("")
          setConfirmPassword("")
        } else {
          setError(data.error || "登録に失敗しました")
        }
      } catch {
        setError("サーバーエラーが発生しました")
      } finally {
        setIsLoading(false)
      }
    } else {
      if (!email || !password) {
        setError("メールアドレスとパスワードを入力してください")
        return
      }

      setIsLoading(true)
      try {
        await onLogin(email, password)
      } catch {
        setError("メールアドレスまたはパスワードが正しくありません")
      } finally {
        setIsLoading(false)
      }
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30 p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Logo */}
        <div className="flex flex-col items-center gap-2">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary">
            <Leaf className="h-7 w-7 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">SMM</h1>
          <p className="text-sm text-muted-foreground">プロフェッショナルMEO管理ツール</p>
        </div>

        {/* Auth Card */}
        <Card className="border-border/50 shadow-lg">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-2xl font-bold">
              {isRegister ? "アカウントを作成" : "SMM にログイン"}
            </CardTitle>
            <CardDescription>
              {isRegister 
                ? "必要情報を入力して、新しいSMMアカウントを作成します。" 
                : "アカウント情報を入力して、プロフェッショナルなMEO運用を開始します。"
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
                  {error}
                </div>
              )}
              {success && (
                <div className="rounded-lg bg-emerald-500/10 p-3 text-sm text-emerald-600">
                  {success}
                </div>
              )}

              {isRegister && (
                <div className="space-y-2">
                  <Label htmlFor="name">お名前</Label>
                  <Input
                    id="name"
                    placeholder="山田 太郎"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    disabled={isLoading}
                    required
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">メールアドレス</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    disabled={isLoading}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">パスワード</Label>
                  {!isRegister && (
                    <button
                      type="button"
                      className="text-xs text-primary hover:underline"
                      onClick={() => alert("パスワードリセット機能は開発中です")}
                    >
                      パスワードを忘れた場合
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="パスワードを入力"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10"
                    disabled={isLoading}
                    required
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              {isRegister && (
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">パスワード（確認用）</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="confirmPassword"
                      type={showPassword ? "text" : "password"}
                      placeholder="パスワードを再入力"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="pl-10"
                      disabled={isLoading}
                      required
                    />
                  </div>
                </div>
              )}

              {!isRegister && (
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="remember"
                    checked={rememberMe}
                    onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                    disabled={isLoading}
                  />
                  <Label htmlFor="remember" className="text-sm font-normal cursor-pointer">
                    ログイン状態を保持する
                  </Label>
                </div>
              )}

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Spinner className="mr-2 h-4 w-4" />
                    {isRegister ? "登録中..." : "ログイン中..."}
                  </>
                ) : (
                  isRegister ? "アカウントを作成" : "ログイン"
                )}
              </Button>
            </form>

            <div className="mt-4 text-center text-sm">
              {isRegister ? (
                <>
                  既にアカウントをお持ちですか？{" "}
                  <button 
                    onClick={() => setIsRegister(false)}
                    className="font-medium text-primary hover:underline"
                  >
                    ログイン
                  </button>
                </>
              ) : (
                <>
                  まだアカウントをお持ちではありませんか？{" "}
                  <button 
                    onClick={() => setIsRegister(true)}
                    className="font-medium text-primary hover:underline"
                  >
                    新規登録
                  </button>
                </>
              )}
            </div>

            {!isRegister && (
              <div className="mt-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-border" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-card px-2 text-muted-foreground">または</span>
                  </div>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  className="mt-4 w-full"
                  onClick={() => alert("Googleログインは開発中です")}
                >
                  <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="currentColor"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  Googleアカウントでログイン
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Footer */}
        <p className="text-center text-xs text-muted-foreground">
          ログインすることで、
          <a href="#" className="text-primary hover:underline">利用規約</a>
          および
          <a href="#" className="text-primary hover:underline">プライバシーポリシー</a>
          に同意したものとみなされます。
        </p>
      </div>
    </div>
  )
}
