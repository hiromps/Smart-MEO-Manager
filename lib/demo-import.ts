import { db } from "./db";
import { getGoogleBusinessProfileAdapter } from "./google-business-profile";

export async function importDemoBusinessProfileData(organizationId: string) {
    const adapter = getGoogleBusinessProfileAdapter();
    const dataset = await adapter.getDemoDataset(organizationId);
    const locationIdMap = new Map<string, string>();

    const googleAccount = await db.googleAccount.upsert({
        where: {
            organizationId_googleId: {
                organizationId,
                googleId: dataset.googleAccount.googleId,
            },
        },
        update: {
            email: dataset.googleAccount.email,
            accessToken: "demo-access-token",
            refreshToken: "demo-refresh-token",
        },
        create: {
            organizationId,
            googleId: dataset.googleAccount.googleId,
            email: dataset.googleAccount.email,
            accessToken: "demo-access-token",
            refreshToken: "demo-refresh-token",
        },
    });

    for (const location of dataset.locations) {
        const savedLocation = await db.businessLocation.upsert({
            where: {
                organizationId_googleLocationId: {
                    organizationId,
                    googleLocationId: location.googleLocationId,
                },
            },
            update: {
                googleAccountId: googleAccount.id,
                name: location.name,
                address: location.address,
            },
            create: {
                organizationId,
                googleAccountId: googleAccount.id,
                googleLocationId: location.googleLocationId,
                name: location.name,
                address: location.address,
            },
        });

        locationIdMap.set(location.googleLocationId, savedLocation.id);
    }

    for (const review of dataset.reviews) {
        const locationId = locationIdMap.get(review.locationGoogleId);

        if (!locationId) {
            continue;
        }

        const savedReview = await db.review.upsert({
            where: { googleReviewId: review.googleReviewId },
            update: {
                locationId,
                starRating: review.starRating,
                comment: review.comment,
                reviewerName: review.reviewerName,
                createTime: review.createTime,
                updateTime: review.updateTime,
                replyStatus: review.replyStatus,
            },
            create: {
                locationId,
                googleReviewId: review.googleReviewId,
                starRating: review.starRating,
                comment: review.comment,
                reviewerName: review.reviewerName,
                createTime: review.createTime,
                updateTime: review.updateTime,
                replyStatus: review.replyStatus,
            },
        });

        if (review.reply) {
            await db.reviewReply.upsert({
                where: { reviewId: savedReview.id },
                update: {
                    comment: review.reply.comment,
                    updateTime: review.reply.updateTime,
                },
                create: {
                    reviewId: savedReview.id,
                    comment: review.reply.comment,
                    updateTime: review.reply.updateTime,
                },
            });
        }

        if (review.aiDraft) {
            await db.aIReplyDraft.deleteMany({
                where: { reviewId: savedReview.id },
            });

            await db.aIReplyDraft.create({
                data: {
                    reviewId: savedReview.id,
                    draftContent: review.aiDraft.draftContent,
                    status: review.aiDraft.status,
                },
            });
        }
    }

    for (const template of dataset.replyTemplates) {
        const existingTemplate = await db.replyTemplate.findFirst({
            where: {
                organizationId,
                name: template.name,
            },
        });

        if (existingTemplate) {
            await db.replyTemplate.update({
                where: { id: existingTemplate.id },
                data: {
                    content: template.content,
                    targetStarRating: template.targetStarRating,
                    isActive: true,
                },
            });
        } else {
            await db.replyTemplate.create({
                data: {
                    organizationId,
                    name: template.name,
                    content: template.content,
                    targetStarRating: template.targetStarRating,
                    isActive: true,
                },
            });
        }
    }

    return {
        locationCount: dataset.locations.length,
        reviewCount: dataset.reviews.length,
        templateCount: dataset.replyTemplates.length,
    };
}