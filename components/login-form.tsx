"use client"

import { useState } from "react"
import { Eye, EyeOff, Leaf, Lock, Mail, User as UserIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Spinner } from "@/components/ui/spinner"

interface LoginFormProps {
  onLogin: (email: string, password: string) => Promise<void>
  onGoogleLogin: () => Promise<void>
}

export function LoginForm({ onLogin, onGoogleLogin }: LoginFormProps) {
  const [isRegister, setIsRegister] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [name, setName] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const resetMessages = () => {
    setError("")
    setSuccess("")
  }

  const resetPasswordFields = () => {
    setPassword("")
    setConfirmPassword("")
  }

  const handleRegister = async () => {
    if (!name || !email || !password || !confirmPassword) {
      setError("名前、メールアドレス、パスワードを入力してください。")
      return
    }

    if (password !== confirmPassword) {
      setError("確認用パスワードが一致していません。")
      return
    }

    if (password.length < 8) {
      setError("パスワードは8文字以上で入力してください。")
      return
    }

    const response = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password, confirmPassword }),
    })

    const data = (await response.json()) as { error?: string }

    if (!response.ok) {
      throw new Error(data.error || "会員登録に失敗しました。")
    }

    setSuccess("会員登録が完了しました。続けてログインしてください。")
    setIsRegister(false)
    resetPasswordFields()
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    resetMessages()
    setIsLoading(true)

    try {
      if (isRegister) {
        await handleRegister()
      } else {
        if (!email || !password) {
          throw new Error("メールアドレスとパスワードを入力してください。")
        }

        await onLogin(email, password)
      }
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "処理に失敗しました。")
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleButtonClick = async () => {
    resetMessages()
    setIsLoading(true)

    try {
      await onGoogleLogin()
    } catch (loginError) {
      setError(loginError instanceof Error ? loginError.message : "Google ログインに失敗しました。")
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top,_rgba(0,178,110,0.14),_transparent_45%),linear-gradient(180deg,_hsl(var(--background)),_hsl(var(--secondary)))] p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary shadow-lg shadow-primary/25">
            <Leaf className="h-7 w-7 text-primary-foreground" />
          </div>
          <div className="space-y-1">
            <h1 className="text-3xl font-semibold tracking-tight">Smart MEO Manager</h1>
            <p className="text-sm text-muted-foreground">会員登録して、MEO 管理をすぐに開始できます。</p>
          </div>
        </div>

        <Card className="border-border/60 bg-card/95 shadow-xl backdrop-blur">
          <CardHeader>
            <CardTitle>{isRegister ? "会員登録" : "ログイン"}</CardTitle>
            <CardDescription>
              {isRegister
                ? "管理者名とメールアドレスを登録して利用を開始します。"
                : "登録済みのメールアドレスとパスワードでログインします。"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {error ? <div className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</div> : null}
            {success ? <div className="rounded-lg bg-emerald-500/10 px-3 py-2 text-sm text-emerald-700">{success}</div> : null}

            <form onSubmit={handleSubmit} className="space-y-4">
              {isRegister ? (
                <div className="space-y-2">
                  <Label htmlFor="name">名前</Label>
                  <div className="relative">
                    <UserIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="name"
                      value={name}
                      onChange={(event) => setName(event.target.value)}
                      placeholder="山田 太郎"
                      className="pl-10"
                      disabled={isLoading}
                    />
                  </div>
                </div>
              ) : null}

              <div className="space-y-2">
                <Label htmlFor="email">メールアドレス</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="you@example.com"
                    className="pl-10"
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">パスワード</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="8文字以上で入力"
                    className="pl-10 pr-10"
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition hover:text-foreground"
                    onClick={() => setShowPassword((current) => !current)}
                    aria-label={showPassword ? "パスワードを隠す" : "パスワードを表示する"}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {isRegister ? (
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">確認用パスワード</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="confirmPassword"
                      type={showPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(event) => setConfirmPassword(event.target.value)}
                      placeholder="同じパスワードを再入力"
                      className="pl-10"
                      disabled={isLoading}
                    />
                  </div>
                </div>
              ) : null}

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Spinner className="mr-2 h-4 w-4" />
                    {isRegister ? "登録中..." : "ログイン中..."}
                  </>
                ) : isRegister ? (
                  "会員登録する"
                ) : (
                  "ログインする"
                )}
              </Button>
            </form>

            {!isRegister ? (
              <>
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-border" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-card px-2 text-muted-foreground">or</span>
                  </div>
                </div>

                <Button type="button" variant="outline" className="w-full" disabled={isLoading} onClick={handleGoogleButtonClick}>
                  Google でログイン
                </Button>
              </>
            ) : null}

            <div className="text-center text-sm text-muted-foreground">
              {isRegister ? "すでにアカウントをお持ちですか？ " : "アカウントをお持ちでない場合は "}
              <button
                type="button"
                className="font-medium text-primary transition hover:underline"
                onClick={() => {
                  resetMessages()
                  resetPasswordFields()
                  setIsRegister((current) => !current)
                }}
              >
                {isRegister ? "ログインへ戻る" : "会員登録"}
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
