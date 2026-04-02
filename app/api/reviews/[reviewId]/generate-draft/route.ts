import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { DraftStatus, ReplyStatus } from "@prisma/client"
import { db } from "@/lib/db"
import { buildGeneratedReply, getReviewForCurrentOrg, markReviewReplyStatus, saveDraft } from "@/lib/review-workflow"

export async function POST(_: Request, context: { params: Promise<{ reviewId: string }> }) {
    const { userId } = await auth()

    if (!userId) {
        return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 })
    }

    const { reviewId } = await context.params
    const { organization, review } = await getReviewForCurrentOrg(reviewId)

    if (!organization) {
        return NextResponse.json({ ok: false, error: "Organization selection is required" }, { status: 400 })
    }

    if (!review) {
        return NextResponse.json({ ok: false, error: "Review not found" }, { status: 404 })
    }

    const template = await db.replyTemplate.findFirst({
        where: {
            organizationId: organization.id,
            isActive: true,
            OR: [
                { targetStarRating: review.starRating },
                { targetStarRating: null },
            ],
        },
        orderBy: [
            { targetStarRating: "desc" },
            { updatedAt: "desc" },
        ],
    })

    const draftContent = buildGeneratedReply({
        reviewComment: review.comment,
        reviewerName: review.reviewerName,
        starRating: review.starRating,
        locationName: review.location.name,
        templateContent: template?.content,
    })

    const draft = await saveDraft(review.id, draftContent, DraftStatus.PENDING)
    await markReviewReplyStatus(review.id, review.replyStatus === ReplyStatus.ANSWERED ? ReplyStatus.ANSWERED : ReplyStatus.PENDING_APPROVAL)

    return NextResponse.json({
        ok: true,
        draft: {
            id: draft.id,
            draftContent: draft.draftContent,
            status: draft.status,
        },
    })
}