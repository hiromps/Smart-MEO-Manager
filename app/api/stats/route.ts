import { auth } from "@/lib/auth"
import { getGbpPerformance } from "@/lib/google-business-api"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const session = await auth()
  
  if (!session || !session.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const locationId = searchParams.get("locationId")
  const startDate = searchParams.get("startDate") || "2026-03-01"
  const endDate = searchParams.get("endDate") || "2026-03-31"

  if (!locationId) {
    return NextResponse.json({ error: "Location ID is required" }, { status: 400 })
  }

  const metrics = [
    "BUSINESS_IMPRESSIONS_DESKTOP_MAPS",
    "BUSINESS_IMPRESSIONS_MOBILE_MAPS",
    "BUSINESS_IMPRESSIONS_DESKTOP_SEARCH",
    "BUSINESS_IMPRESSIONS_MOBILE_SEARCH",
    "WEBSITE_CLICKS",
    "CALL_CLICKS",
    "DRIVING_DIRECTIONS"
  ]

  try {
    const stats = await getGbpPerformance(session.user.id, locationId, metrics, startDate, endDate)
    return NextResponse.json(stats)
  } catch (error: any) {
    console.error("Stats API Error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
