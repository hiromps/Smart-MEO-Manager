import { NextResponse } from "next/server"
import { z } from "zod"

import { getAuth0User } from "@/lib/auth0-user"
import { prisma } from "@/lib/prisma"

const bodySchema = z.object({
  replyText: z.string().trim().min(1).max(2000),
})

type RouteContext = {
  params: Promise<{
    reviewId: string
  }>
}

export async function POST(request: Request, { params }: RouteContext) {
  const user = await getAuth0User()

  if (!user?.sub) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const parsedBody = bodySchema.safeParse(await request.json())

  if (!parsedBody.success) {
    return NextResponse.json(
      { error: parsedBody.error.issues[0]?.message ?? "Invalid request body" },
      { status: 400 }
    )
  }

  const { reviewId } = await params

  const review = await prisma.review.findFirst({
    where: {
      id: reviewId,
      location: {
        user: {
          auth0Sub: user.sub,
        },
      },
    },
  })

  if (!review) {
    return NextResponse.json({ error: "Review not found" }, { status: 404 })
  }

  const updated = await prisma.review.update({
    where: { id: review.id },
    data: {
      replyText: parsedBody.data.replyText,
      repliedAt: new Date(),
    },
  })

  return NextResponse.json({
    id: updated.id,
    replyText: updated.replyText,
    repliedAt: updated.repliedAt?.toISOString() ?? null,
  })
}
