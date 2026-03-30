"use client"

import { SignIn } from "@clerk/nextjs"

export default function SignInPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background via-background to-muted/30">
      <div className="w-full max-w-md px-4">
        {/* Logo and branding */}
        <div className="mb-8 flex flex-col items-center">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-[#00B26E] to-[#00945C] shadow-lg shadow-[#00B26E]/25">
            <svg
              className="h-7 w-7 text-white"
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
          <h1 className="text-2xl font-bold text-foreground">Smart MEO Manager</h1>
          <p className="mt-1 text-sm text-muted-foreground">AI口コミ管理ダッシュボード</p>
        </div>

        {/* Clerk SignIn component */}
        <SignIn
          appearance={{
            elements: {
              rootBox: "w-full",
              card: "shadow-xl border border-border bg-card rounded-xl",
              headerTitle: "text-foreground",
              headerSubtitle: "text-muted-foreground",
              socialButtonsBlockButton: "border-border hover:bg-muted",
              socialButtonsBlockButtonText: "text-foreground",
              dividerLine: "bg-border",
              dividerText: "text-muted-foreground",
              formFieldLabel: "text-foreground",
              formFieldInput: "border-input bg-background text-foreground",
              formButtonPrimary: "bg-[#00B26E] hover:bg-[#00945C] text-white",
              footerActionLink: "text-[#00B26E] hover:text-[#00945C]",
              identityPreviewText: "text-foreground",
              identityPreviewEditButton: "text-[#00B26E]",
            },
          }}
          routing="path"
          path="/sign-in"
          signUpUrl="/sign-up"
          forceRedirectUrl="/"
        />

        {/* Footer */}
        <p className="mt-8 text-center text-xs text-muted-foreground">
          Googleビジネスプロフィールの口コミをAIで効率的に管理
        </p>
      </div>
    </div>
  )
}
