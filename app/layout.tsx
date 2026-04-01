import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { ClerkProvider } from '@clerk/nextjs'
import { jaJP } from '@clerk/localizations'
import { Toaster } from '@/components/ui/toaster'
import './globals.css'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'Smart MEO Manager - AI口コミ管理ダッシュボード',
  description: 'Googleビジネスプロフィールの口コミをAIで効率的に管理',

  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ClerkProvider
      localization={jaJP}
      appearance={{
        variables: {
          colorPrimary: '#00B26E',
          colorTextOnPrimaryBackground: '#ffffff',
        },
        elements: {
          formButtonPrimary: 'bg-[#00B26E] hover:bg-[#00945C]',
          card: 'shadow-lg',
        },
      }}
    >
      <html lang="ja">
        <body className="font-sans antialiased">
          {children}
          <Toaster />
          <Analytics />
        </body>
      </html>
    </ClerkProvider>
  )
}
