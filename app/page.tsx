import { Suspense } from "react";
import Dashboard from "@/components/dashboard";
import { getDashboardData } from "@/lib/dashboard-data";
import { getCurrentOrg, getCurrentUser } from "@/lib/org";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function Home() {
  const { userId, orgId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  // Fetch data on server
  const org = orgId ? await getCurrentOrg() : null;
  const user = await getCurrentUser();
  const dashboardData = await getDashboardData(org?.id ?? null);

  return (
    <Suspense fallback={<div>Loading Dashboard...</div>}>
      <Dashboard serverOrg={org} serverUser={user} dashboardData={dashboardData} />
    </Suspense>
  );
}


