import Dashboard from "@/dashboard"
import { AuthWrapper } from "@/components/auth-wrapper"

export default function Home() {
  const googleAuthEnabled = Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET)

  return (
    <AuthWrapper googleAuthEnabled={googleAuthEnabled}>
      <Dashboard />
    </AuthWrapper>
  )
}
