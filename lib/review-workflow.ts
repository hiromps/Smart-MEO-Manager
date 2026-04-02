import { DraftStatus, ReplyStatus } from "@prisma/client"
import { db } from "@/lib/db"
import { getCurrentOrg } from "@/lib/org"

export async function getReviewForCurrentOrg(reviewId: string) {
    const organization = await getCurrentOrg()

    if (!organization) {
        return { organization: null, review: null }
    }

    const review = await db.review.findFirst({
        where: {
            id: reviewId,
            location: {
                organizationId: organization.id,
            },
        },
        include: {
            location: true,
            reply: true,
            aiDrafts: {
                orderBy: {
                    createdAt: "desc",
                },
                take: 1,
            },
        },
    })

    return { organization, review }
}

export async function saveDraft(reviewId: string, draftContent: string, status: DraftStatus = DraftStatus.PENDING) {
    const latestDraft = await db.aIReplyDraft.findFirst({
        where: { reviewId },
        orderBy: { createdAt: "desc" },
    })

    if (latestDraft) {
        return db.aIReplyDraft.update({
            where: { id: latestDraft.id },
            data: { draftContent, status },
        })
    }

    return db.aIReplyDraft.create({
        data: {
            reviewId,
            draftContent,
            status,
        },
    })
}

export async function markReviewReplyStatus(reviewId: string, status: ReplyStatus) {
    return db.review.update({
        where: { id: reviewId },
        data: { replyStatus: status },
    })
}

export function buildGeneratedReply(options: {
    reviewComment: string | null
    reviewerName: string
    starRating: number
    locationName: string
    templateContent?: string | null
}) {
    const { reviewComment, reviewerName, starRating, locationName, templateContent } = options
    const reviewerSuffix = reviewerName ? `${reviewerName}様` : "お客様"

    if (templateContent) {
        return `${reviewerSuffix}\n${templateContent}\n${locationName}へのご来店を心より感謝いたします。`
    }

    if (starRating >= 4) {
        return `${reviewerSuffix}\nこの度は${locationName}へご来店いただき、温かい口コミをありがとうございます。いただいたお言葉を励みに、今後も気持ちよくご利用いただける店舗運営に努めてまいります。`
    }

    if (starRating === 3) {
        return `${reviewerSuffix}\nこの度は${locationName}をご利用いただきありがとうございます。${reviewComment ? "いただいたご意見を参考に、よりご満足いただけるサービス改善に取り組みます。" : "今後さらにご満足いただける店舗づくりを進めてまいります。"}`
    }

    return `${reviewerSuffix}\nこの度は${locationName}のご利用に際し、ご期待に沿えず申し訳ありません。${reviewComment ? "いただいたご指摘を真摯に受け止め、改善を進めてまいります。" : "運営体制を見直し、再発防止に努めます。"}`
}