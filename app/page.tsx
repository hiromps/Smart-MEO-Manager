import { Suspense } from "react";
import Dashboard from "@/components/dashboard";
import { getDashboardData } from "@/lib/dashboard-data";
import { getCurrentOrg, getCurrentUser } from "@/lib/org";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

type HomeProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function Home({ searchParams }: HomeProps) {
  const { userId, orgId } = await auth();
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const sectionParam = resolvedSearchParams?.section;
  const initialSection = Array.isArray(sectionParam) ? sectionParam[0] : sectionParam;

  if (!userId) {
    redirect("/sign-in");
  }

  // Fetch data on server
  const org = orgId ? await getCurrentOrg() : null;
  const user = await getCurrentUser();
  const dashboardData = await getDashboardData(org?.id ?? null);

  return (
    <Suspense fallback={<div>Loading Dashboard...</div>}>
      <Dashboard
        serverOrg={org}
        serverUser={user}
        dashboardData={dashboardData}
        initialSection={initialSection}
      />
    </Suspense>
  );
}


