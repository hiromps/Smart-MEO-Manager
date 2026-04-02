import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { DraftStatus, ReplyStatus } from "@prisma/client"
import { z } from "zod"
import { getReviewForCurrentOrg, markReviewReplyStatus, saveDraft } from "@/lib/review-workflow"

const payloadSchema = z.object({
    draftContent: z.string().trim().min(1),
    status: z.nativeEnum(DraftStatus).optional(),
})

export async function PATCH(request: Request, context: { params: Promise<{ reviewId: string }> }) {
    const { userId } = await auth()

    if (!userId) {
        return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 })
    }

    const { reviewId } = await context.params
    const payload = payloadSchema.parse(await request.json())
    const { organization, review } = await getReviewForCurrentOrg(reviewId)

    if (!organization) {
        return NextResponse.json({ ok: false, error: "Organization selection is required" }, { status: 400 })
    }

    if (!review) {
        return NextResponse.json({ ok: false, error: "Review not found" }, { status: 404 })
    }

    const draft = await saveDraft(review.id, payload.draftContent, payload.status ?? DraftStatus.PENDING)

    if (review.replyStatus !== ReplyStatus.ANSWERED) {
        await markReviewReplyStatus(review.id, ReplyStatus.PENDING_APPROVAL)
    }

    return NextResponse.json({ ok: true, draft })
}