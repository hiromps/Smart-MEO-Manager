import './globals.css';
import type { ReactNode } from 'react';
import { ClerkProvider, SignInButton, UserButton } from '@clerk/nextjs';
import { Sidebar } from '../components/sidebar';

export const metadata = {
  title: 'Smart MEO Manager',
  description: 'Googleビジネスプロフィール運用を効率化するBtoB SaaS',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="ja">
        <body>
          <div className="layout">
            <Sidebar />
            <main className="main">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, gap: 12, flexWrap: 'wrap' }}>
                <div style={{ color: '#6b7280' }}>Clerk 組み込み前提の初期 scaffold</div>
                <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                  <SignInButton mode="modal">
                    <button className="button">ログイン</button>
                  </SignInButton>
                  <UserButton />
                </div>
              </div>
              {children}
            </main>
          </div>
        </body>
      </html>
    </ClerkProvider>
  );
}
