import { auth } from "@/lib/auth"
import { getGbpLocations } from "@/lib/google-business-api"
import { NextResponse } from "next/server"

export async function GET() {
  const session = await auth()
  
  if (!session || !session.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const locations = await getGbpLocations(session.user.id)
    return NextResponse.json(locations)
  } catch (error: any) {
    console.error("GBP Locations API Error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
