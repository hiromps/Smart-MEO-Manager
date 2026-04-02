import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { DraftStatus, ReplyStatus } from "@prisma/client"
import { z } from "zod"
import { db } from "@/lib/db"
import { getReviewForCurrentOrg, saveDraft } from "@/lib/review-workflow"

const payloadSchema = z.object({
    replyContent: z.string().trim().min(1),
})

export async function POST(request: Request, context: { params: Promise<{ reviewId: string }> }) {
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

    await db.$transaction(async (transaction) => {
        const latestDraft = await transaction.aIReplyDraft.findFirst({
            where: { reviewId: review.id },
            orderBy: { createdAt: "desc" },
        })

        if (latestDraft) {
            await transaction.aIReplyDraft.update({
                where: { id: latestDraft.id },
                data: {
                    draftContent: payload.replyContent,
                    status: DraftStatus.APPROVED,
                },
            })
        } else {
            await transaction.aIReplyDraft.create({
                data: {
                    reviewId: review.id,
                    draftContent: payload.replyContent,
                    status: DraftStatus.APPROVED,
                },
            })
        }

        await transaction.reviewReply.upsert({
            where: { reviewId: review.id },
            update: {
                comment: payload.replyContent,
                updateTime: new Date(),
            },
            create: {
                reviewId: review.id,
                comment: payload.replyContent,
                updateTime: new Date(),
            },
        })

        await transaction.review.update({
            where: { id: review.id },
            data: { replyStatus: ReplyStatus.ANSWERED },
        })
    })

    return NextResponse.json({ ok: true })
}