import { google } from "googleapis";
import { prisma } from "@/lib/prisma";

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  `${process.env.NEXTAUTH_URL}/api/auth/callback/google`
);

export async function getGbpLocations(userId: string) {
  // DBから最新のトークンを取得
  const account = await prisma.account.findFirst({
    where: { userId, provider: "google" },
  });

  if (!account || !account.access_token) {
    throw new Error("No connected Google account found");
  }

  oauth2Client.setCredentials({
    access_token: account.access_token,
    refresh_token: account.refresh_token,
  });

  const mybusinessbusinessinformation = google.mybusinessbusinessinformation({
    version: "v1",
    auth: oauth2Client,
  });

  // 自分に紐づく全てのアカウント（個人アカウント、ビジネスグループ等）を取得
  const accountsRes = await google.mybusinessaccountmanagement({
    version: "v1",
    auth: oauth2Client,
  }).accounts.list();

  const allAccounts = accountsRes.data.accounts || [];
  if (allAccounts.length === 0) return [];

  const allLocations: any[] = [];

  // 全てのアカウントから店舗一覧を取得して結合
  for (const account of allAccounts) {
    if (!account.name) continue;
    
    const locationsRes = await mybusinessbusinessinformation.accounts.locations.list({
      parent: account.name,
      readMask: "name,title,storeCode,latlng,locationName",
    });

    if (locationsRes.data.locations) {
      allLocations.push(...locationsRes.data.locations);
    }
  }

  return allLocations;
}

export async function getGbpPerformance(userId: string, locationId: string, metrics: string[], startDate: string, endDate: string) {
  const account = await prisma.account.findFirst({
    where: { userId, provider: "google" },
  });

  if (!account || !account.access_token) {
    throw new Error("Account integration required");
  }

  oauth2Client.setCredentials({
    access_token: account.access_token,
    refresh_token: account.refresh_token,
  });

  const performanceApi = google.businessprofileperformance({
    version: "v1",
    auth: oauth2Client,
  });

  const results: Record<string, any> = {};

  // 各指標についてデータを取得
  for (const metric of metrics) {
    try {
      const res = await performanceApi.locations.getDailyMetricsTimeSeries({
        name: `locations/${locationId}`,
        dailyMetric: metric,
        "dailyRange.startDate.year": parseInt(startDate.split("-")[0]),
        "dailyRange.startDate.month": parseInt(startDate.split("-")[1]),
        "dailyRange.startDate.day": parseInt(startDate.split("-")[2]),
        "dailyRange.endDate.year": parseInt(endDate.split("-")[0]),
        "dailyRange.endDate.month": parseInt(endDate.split("-")[1]),
        "dailyRange.endDate.day": parseInt(endDate.split("-")[2]),
      });
      results[metric] = res.data.timeSeries?.datedValues || [];
    } catch (error) {
      console.error(`Error fetching metric ${metric}:`, error);
      results[metric] = [];
    }
  }

  return results;
}
