"use client"

import { createContext, ReactNode, useContext, useMemo } from "react"
import { signIn, signOut, useSession } from "next-auth/react"

import { LoginForm } from "@/components/login-form"

interface AuthUser {
  id: string
  email: string
  name: string
  role: string
}

interface AuthContextType {
  user: AuthUser | null
  isAuthenticated: boolean
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function useAuth() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error("useAuth must be used within an AuthWrapper")
  }

  return context
}

interface AuthWrapperProps {
  children: ReactNode
}

export function AuthWrapper({ children }: AuthWrapperProps) {
  const { data: session, status } = useSession()

  const user = useMemo<AuthUser | null>(() => {
    if (!session?.user?.id || !session.user.email) {
      return null
    }

    return {
      id: session.user.id,
      email: session.user.email,
      name: session.user.name ?? "ユーザー",
      role: session.user.role ?? "user",
    }
  }, [session])

  const logout = async () => {
    await signOut({ callbackUrl: "/" })
  }

  const login = async (email: string, password: string) => {
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    })

    if (!result || result.error) {
      throw new Error("メールアドレスまたはパスワードが正しくありません。")
    }
  }

  const loginWithGoogle = async () => {
    await signIn("google", { callbackUrl: "/" })
  }

  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="rounded-2xl border border-border bg-card px-6 py-5 text-sm text-muted-foreground shadow-sm">
          認証状態を確認しています...
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <AuthContext.Provider value={{ user: null, isAuthenticated: false, logout }}>
        <LoginForm onLogin={login} onGoogleLogin={loginWithGoogle} />
      </AuthContext.Provider>
    )
  }

  return <AuthContext.Provider value={{ user, isAuthenticated: true, logout }}>{children}</AuthContext.Provider>
}
