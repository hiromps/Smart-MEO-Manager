import Dashboard from "@/dashboard"
import { ensureAppUser, getAuth0User } from "@/lib/auth0-user"
import { getDashboardData } from "@/lib/dashboard-data"
import { redirect } from "next/navigation"

export default async function DashboardPage() {
  const user = await getAuth0User()

  if (!user) {
    redirect("/auth/login?returnTo=/dashboard")
  }

  const appUser = await ensureAppUser(user)
  const dashboardData = await getDashboardData(user.sub)
  const logoutReturnTo = process.env.APP_BASE_URL ?? "http://localhost:3000"

  return (
    <Dashboard
      user={appUser}
      logoutHref={`/auth/logout?returnTo=${encodeURIComponent(logoutReturnTo)}`}
      locations={dashboardData.locations}
      reviews={dashboardData.reviews}
      stats={dashboardData.stats}
      isDemo={dashboardData.isDemo}
    />
  )
}
