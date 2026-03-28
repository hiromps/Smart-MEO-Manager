import { getAuth0User } from "@/lib/auth0-user"
import { getGbpLocations } from "@/lib/google-business-api"
import { NextResponse } from "next/server"

export async function GET() {
  const user = await getAuth0User()

  if (!user?.sub) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const locations = await getGbpLocations(user.sub)
    return NextResponse.json(locations)
  } catch (error: any) {
    console.error("GBP Locations API Error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
