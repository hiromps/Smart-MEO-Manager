"use client"

import { createContext, ReactNode, useContext, useEffect, useMemo } from "react"
import { usePathname, useRouter } from "next/navigation"
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
  googleAuthEnabled: boolean
  redirectAuthenticatedTo?: string
}

export function AuthWrapper({ children, googleAuthEnabled, redirectAuthenticatedTo }: AuthWrapperProps) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const pathname = usePathname()

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

  useEffect(() => {
    if (!user || !redirectAuthenticatedTo || pathname === redirectAuthenticatedTo) {
      return
    }

    router.replace(redirectAuthenticatedTo)
  }, [pathname, redirectAuthenticatedTo, router, user])

  const logout = async () => {
    await signOut({ callbackUrl: "/" })
  }

  const login = async (email: string, password: string) => {
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
      callbackUrl: "/dashboard",
    })

    if (!result || result.error) {
      throw new Error("メールアドレスまたはパスワードが正しくありません。")
    }

    router.replace(result.url ?? "/dashboard")
  }

  const loginWithGoogle = async () => {
    await signIn("google", { callbackUrl: "/dashboard" })
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
        <LoginForm onLogin={login} onGoogleLogin={googleAuthEnabled ? loginWithGoogle : undefined} />
      </AuthContext.Provider>
    )
  }

  return <AuthContext.Provider value={{ user, isAuthenticated: true, logout }}>{children}</AuthContext.Provider>
}
