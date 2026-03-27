import { google } from "googleapis"

import { prisma } from "@/lib/prisma"

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  `${process.env.NEXTAUTH_URL}/api/auth/callback/google`
)

export async function getGbpLocations(userId: string) {
  const account = await prisma.account.findFirst({
    where: { userId, provider: "google" },
  })

  if (!account?.access_token) {
    throw new Error("Google アカウント連携が必要です。")
  }

  oauth2Client.setCredentials({
    access_token: account.access_token,
    refresh_token: account.refresh_token ?? undefined,
  })

  const accountManagement = google.mybusinessaccountmanagement({
    version: "v1",
    auth: oauth2Client,
  })

  const businessInformation = google.mybusinessbusinessinformation({
    version: "v1",
    auth: oauth2Client,
  })

  const accountsResponse = await accountManagement.accounts.list()
  const accounts = accountsResponse.data.accounts ?? []
  const locations: unknown[] = []

  for (const businessAccount of accounts) {
    if (!businessAccount.name) {
      continue
    }

    const locationsResponse = await businessInformation.accounts.locations.list({
      parent: businessAccount.name,
      readMask: "name,title,storeCode,latlng,locationName",
    })

    if (locationsResponse.data.locations) {
      locations.push(...locationsResponse.data.locations)
    }
  }

  return locations
}

export async function getGbpPerformance(
  userId: string,
  locationId: string,
  metrics: string[],
  startDate: string,
  endDate: string
) {
  const account = await prisma.account.findFirst({
    where: { userId, provider: "google" },
  })

  if (!account?.access_token) {
    throw new Error("Google アカウント連携が必要です。")
  }

  oauth2Client.setCredentials({
    access_token: account.access_token,
    refresh_token: account.refresh_token ?? undefined,
  })

  const performanceApi = google.businessprofileperformance({
    version: "v1",
    auth: oauth2Client,
  })

  const results: Record<string, unknown[]> = {}
  const [startYear, startMonth, startDay] = startDate.split("-").map(Number)
  const [endYear, endMonth, endDay] = endDate.split("-").map(Number)

  for (const metric of metrics) {
    try {
      const response = await performanceApi.locations.getDailyMetricsTimeSeries({
        name: `locations/${locationId}`,
        dailyMetric: metric,
        "dailyRange.startDate.year": startYear,
        "dailyRange.startDate.month": startMonth,
        "dailyRange.startDate.day": startDay,
        "dailyRange.endDate.year": endYear,
        "dailyRange.endDate.month": endMonth,
        "dailyRange.endDate.day": endDay,
      })

      results[metric] = response.data.timeSeries?.datedValues ?? []
    } catch (error) {
      console.error(`Error fetching metric ${metric}:`, error)
      results[metric] = []
    }
  }

  return results
}
