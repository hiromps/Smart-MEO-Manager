"use client"

import { useState, useEffect, createContext, useContext, ReactNode } from "react"
import { LoginForm } from "./login-form"

interface User {
  id: string
  email: string
  name: string
  role: string
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthWrapper")
  }
  return context
}

// デモ用のユーザーデータ
const DEMO_USERS = [
  { email: "admin@example.com", password: "admin123", name: "管理者", role: "admin" },
  { email: "user@example.com", password: "user123", name: "山田太郎", role: "user" },
]

interface AuthWrapperProps {
  children: ReactNode
}

export function AuthWrapper({ children }: AuthWrapperProps) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // ローカルストレージから認証状態を復元（デモ用）
    const savedUser = localStorage.getItem("smm_user")
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser))
      } catch {
        localStorage.removeItem("smm_user")
      }
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string): Promise<void> => {
    // API を呼び出してログイン認証を行う
    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || "Login failed")
      }

      const userData: User = {
        id: data.user.id,
        email: data.user.email,
        name: data.user.name,
        role: data.user.role,
      }

      setUser(userData)
      localStorage.setItem("smm_user", JSON.stringify(userData))
    } catch (error: any) {
      console.error("Login Error:", error)
      throw error
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("smm_user")
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-6">
          <div className="relative">
            {/* Outer pulse rings */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="h-20 w-20 animate-ping rounded-full bg-[#00B26E]/20" style={{ animationDuration: '2s' }} />
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="h-16 w-16 animate-ping rounded-full bg-[#00B26E]/30" style={{ animationDuration: '2s', animationDelay: '0.5s' }} />
            </div>
            
            {/* Main logo container */}
            <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#00B26E] to-[#00945C] shadow-lg shadow-[#00B26E]/25">
              <svg
                className="h-8 w-8 text-white animate-pulse"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
                <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
              </svg>
            </div>
          </div>
          
          {/* Loading text with fade animation */}
          <div className="flex flex-col items-center gap-2">
            <h2 className="text-lg font-semibold text-foreground">SMM</h2>
            <div className="flex items-center gap-1">
              <span className="text-sm text-muted-foreground">読み込み中</span>
              <span className="flex gap-1">
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#00B26E]" style={{ animationDelay: '0ms' }} />
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#00B26E]" style={{ animationDelay: '150ms' }} />
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#00B26E]" style={{ animationDelay: '300ms' }} />
              </span>
            </div>
          </div>
          
          {/* Progress bar */}
          <div className="h-1 w-48 overflow-hidden rounded-full bg-muted">
            <div 
              className="h-full w-full origin-left animate-pulse rounded-full bg-gradient-to-r from-[#00B26E] to-[#00D886]"
              style={{ 
                animation: 'loading-progress 1.5s ease-in-out infinite',
              }}
            />
          </div>
        </div>
        
        <style jsx>{`
          @keyframes loading-progress {
            0% {
              transform: translateX(-100%);
            }
            50% {
              transform: translateX(0%);
            }
            100% {
              transform: translateX(100%);
            }
          }
        `}</style>
      </div>
    )
  }

  if (!user) {
    return (
      <AuthContext.Provider value={{ user, isAuthenticated: false, login, logout }}>
        <LoginForm onLogin={login} />
      </AuthContext.Provider>
    )
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: true, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
