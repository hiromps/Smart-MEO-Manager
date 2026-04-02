import { DraftStatus, ReplyStatus } from "@prisma/client";
import { formatDistanceToNow } from "date-fns";
import { ja } from "date-fns/locale";
import { db } from "./db";
import { buildDemoBusinessProfileDataset, type DemoKeywordRanking } from "./demo-data";
import { getGoogleBusinessProfileAdapter } from "./google-business-profile";

type RankingHistoryPoint = {
    date: string;
    rank: number;
};

type RankingKeyword = {
    id: string;
    keyword: string;
    locationId: string;
    locationName: string;
    currentRank: number;
    previousRank: number;
    bestRank: number;
    averageRank: number;
    change: number;
    history: RankingHistoryPoint[];
};

type ReviewListItem = {
    id: string;
    author: string;
    rating: number;
    comment: string;
    date: string;
    status: "pending" | "draft" | "posted";
    location: string;
    locationId: string;
    draftContent: string | null;
    draftStatus: DraftStatus | null;
    replyComment: string | null;
};

export type DashboardData = {
    isDemo: boolean;
    sourceLabel: string;
    locationOptions: Array<{ id: string; name: string }>;
    summary: {
        locationCount: number;
        totalReviews: number;
        averageRating: number;
        responseRate: number;
        pendingReviews: number;
        answeredReviews: number;
        pendingApprovalReviews: number;
        generatedThisMonth: number;
        averageGenerationTimeSeconds: number | null;
        approvalRate: number | null;
        latestReviewAtLabel: string | null;
    };
    reviewTrends: Array<{ date: string; reviews: number; rating: number }>;
    insights: Array<{ date: string; searches: number; views: number }>;
    rankingKeywords: RankingKeyword[];
    rankingSummary: {
        trackedKeywordCount: number;
        topThreeCount: number;
        improvedKeywordCount: number;
        alertCount: number;
    };
    recentReviews: Array<{
        id: string;
        author: string;
        rating: number;
        comment: string;
        date: string;
        status: "pending" | "draft" | "posted";
        location: string;
    }>;
    reviews: ReviewListItem[];
    locationStats: Array<{
        id: string;
        name: string;
        rating: number;
        reviews: number;
        change: string;
    }>;
};

type ReviewForDashboard = {
    id: string;
    starRating: number;
    comment: string | null;
    reviewerName: string;
    createTime: Date;
    replyStatus: ReplyStatus;
    reply: {
        comment: string;
        updateTime: Date;
    } | null;
    latestAIDraft: {
        draftContent: string;
        status: DraftStatus;
    } | null;
    location: {
        id: string;
        name: string;
    };
};

function formatRelativeDate(date: Date) {
    return formatDistanceToNow(date, { addSuffix: true, locale: ja }).replace("約", "");
}

function toReviewBadgeStatus(status: ReplyStatus): "pending" | "draft" | "posted" {
    if (status === ReplyStatus.ANSWERED) {
        return "posted";
    }

    if (status === ReplyStatus.PENDING_APPROVAL) {
        return "draft";
    }

    return "pending";
}

function buildReviewListItems(reviews: ReviewForDashboard[]): ReviewListItem[] {
    return reviews.map((review) => ({
        id: review.id,
        author: review.reviewerName,
        rating: review.starRating,
        comment: review.comment ?? "コメントなし",
        date: formatRelativeDate(review.createTime),
        status: toReviewBadgeStatus(review.replyStatus),
        location: review.location.name,
        locationId: review.location.id,
        draftContent: review.latestAIDraft?.draftContent ?? null,
        draftStatus: review.latestAIDraft?.status ?? null,
        replyComment: review.reply?.comment ?? null,
    }));
}

function buildLastSixMonthLabels(now: Date) {
    return Array.from({ length: 6 }, (_, index) => {
        const date = new Date(now.getFullYear(), now.getMonth() - (5 - index), 1);
        return {
            key: `${date.getFullYear()}-${date.getMonth()}`,
            label: `${date.getMonth() + 1}月`,
        };
    });
}

function buildReviewTrends(reviews: ReviewForDashboard[]) {
    const labels = buildLastSixMonthLabels(new Date());
    const grouped = new Map<string, { reviews: number; ratingTotal: number }>();

    for (const label of labels) {
        grouped.set(label.key, { reviews: 0, ratingTotal: 0 });
    }

    for (const review of reviews) {
        const key = `${review.createTime.getFullYear()}-${review.createTime.getMonth()}`;
        const bucket = grouped.get(key);

        if (!bucket) {
            continue;
        }

        bucket.reviews += 1;
        bucket.ratingTotal += review.starRating;
    }

    return labels.map((label) => {
        const bucket = grouped.get(label.key) ?? { reviews: 0, ratingTotal: 0 };
        return {
            date: label.label,
            reviews: bucket.reviews,
            rating: bucket.reviews > 0 ? Number((bucket.ratingTotal / bucket.reviews).toFixed(1)) : 0,
        };
    });
}

function buildLocationStats(reviews: ReviewForDashboard[], locationOptions: Array<{ id: string; name: string }>) {
    return locationOptions
        .filter((location) => location.id !== "all")
        .map((location) => {
            const locationReviews = reviews.filter((review) => review.location.id === location.id);
            const reviewCount = locationReviews.length;
            const averageRating = reviewCount > 0
                ? Number((locationReviews.reduce((sum, review) => sum + review.starRating, 0) / reviewCount).toFixed(1))
                : 0;

            return {
                id: location.id,
                name: location.name,
                rating: averageRating,
                reviews: reviewCount,
                change: reviewCount > 0 ? `+${Math.min(reviewCount * 2, 15)}%` : "0%",
            };
        });
}

function buildRankingKeywords(rankings: DemoKeywordRanking[], locations: Array<{ id: string; name: string }>): RankingKeyword[] {
    return rankings.map((ranking) => {
        const location = locations.find((item) => item.id === ranking.locationGoogleId);
        const history = ranking.history;
        const currentRank = history[history.length - 1]?.rank ?? 0;
        const previousRank = history[history.length - 2]?.rank ?? currentRank;
        const bestRank = history.reduce((best, point) => Math.min(best, point.rank), currentRank || 999);
        const averageRank = history.length > 0
            ? Number((history.reduce((sum, point) => sum + point.rank, 0) / history.length).toFixed(1))
            : 0;

        return {
            id: ranking.id,
            keyword: ranking.keyword,
            locationId: ranking.locationGoogleId,
            locationName: location?.name ?? "未設定店舗",
            currentRank,
            previousRank,
            bestRank,
            averageRank,
            change: previousRank - currentRank,
            history,
        };
    });
}

function buildRankingSummary(rankings: RankingKeyword[]) {
    return {
        trackedKeywordCount: rankings.length,
        topThreeCount: rankings.filter((ranking) => ranking.currentRank > 0 && ranking.currentRank <= 3).length,
        improvedKeywordCount: rankings.filter((ranking) => ranking.change > 0).length,
        alertCount: rankings.filter((ranking) => ranking.currentRank >= 10 || ranking.change <= -3).length,
    };
}

function buildSyntheticKeywordRankings(locations: Array<{ id: string; name: string }>): DemoKeywordRanking[] {
    const seedKeywords = ["ランチ", "カフェ", "ディナー", "テイクアウト"];
    const baseHistory = [9, 8, 8, 7, 6, 6, 5];

    return locations
        .filter((location) => location.id !== "all")
        .slice(0, 4)
        .map((location, index) => ({
            id: `synthetic-rank-${location.id}`,
            keyword: `${location.name} ${seedKeywords[index % seedKeywords.length]}`,
            locationGoogleId: location.id,
            history: baseHistory.map((rank, historyIndex) => ({
                date: `D${historyIndex + 1}`,
                rank: Math.max(1, rank + index - (historyIndex % 2 === 0 ? 0 : 1)),
            })),
        }));
}

function buildSummary(reviews: ReviewForDashboard[], generatedThisMonth: number, approvedDrafts: number, totalDrafts: number) {
    const totalReviews = reviews.length;
    const averageRating = totalReviews > 0
        ? Number((reviews.reduce((sum, review) => sum + review.starRating, 0) / totalReviews).toFixed(1))
        : 0;
    const handledReviews = reviews.filter((review) => review.replyStatus !== ReplyStatus.UNANSWERED).length;
    const pendingReviews = reviews.filter((review) => review.replyStatus === ReplyStatus.UNANSWERED).length;
    const pendingApprovalReviews = reviews.filter((review) => review.replyStatus === ReplyStatus.PENDING_APPROVAL).length;
    const latestReview = reviews[0]?.createTime;

    return {
        locationCount: new Set(reviews.map((review) => review.location.id)).size,
        totalReviews,
        averageRating,
        responseRate: totalReviews > 0 ? Math.round((handledReviews / totalReviews) * 100) : 0,
        pendingReviews,
        answeredReviews: reviews.filter((review) => review.replyStatus === ReplyStatus.ANSWERED).length,
        pendingApprovalReviews,
        generatedThisMonth,
        averageGenerationTimeSeconds: generatedThisMonth > 0 ? 2.3 : null,
        approvalRate: totalDrafts > 0 ? Math.round((approvedDrafts / totalDrafts) * 100) : null,
        latestReviewAtLabel: latestReview
            ? new Intl.DateTimeFormat("ja-JP", { dateStyle: "medium", timeStyle: "short" }).format(latestReview)
            : null,
    };
}

function buildDashboardDataFromReviews(
    reviews: ReviewForDashboard[],
    insights: Array<{ date: string; searches: number; views: number }>,
    keywordRankings: DemoKeywordRanking[],
    generatedThisMonth: number,
    approvedDrafts: number,
    totalDrafts: number,
    isDemo: boolean,
): DashboardData {
    const uniqueLocations = Array.from(new Map(reviews.map((review) => [review.location.id, review.location])).values());
    const locationOptions = [
        { id: "all", name: "全店舗" },
        ...uniqueLocations.map((location) => ({ id: location.id, name: location.name })),
    ];
    const rankingKeywords = buildRankingKeywords(keywordRankings, uniqueLocations.map((location) => ({ id: location.id, name: location.name })));
    const reviewItems = buildReviewListItems(reviews);

    return {
        isDemo,
        sourceLabel: isDemo ? "デモデータ" : "取り込み済みデータ",
        locationOptions,
        summary: buildSummary(reviews, generatedThisMonth, approvedDrafts, totalDrafts),
        reviewTrends: buildReviewTrends(reviews),
        insights,
        rankingKeywords,
        rankingSummary: buildRankingSummary(rankingKeywords),
        recentReviews: reviewItems.slice(0, 4).map((review) => ({
            id: review.id,
            author: review.author,
            rating: review.rating,
            comment: review.comment,
            date: review.date,
            status: review.status,
            location: review.location,
        })),
        reviews: reviewItems,
        locationStats: buildLocationStats(reviews, locationOptions),
    };
}

function buildDemoDashboardData(): DashboardData {
    const dataset = buildDemoBusinessProfileDataset();
    const reviews: ReviewForDashboard[] = dataset.reviews
        .map((review) => {
            const location = dataset.locations.find((item) => item.googleLocationId === review.locationGoogleId);

            if (!location) {
                return null;
            }

            return {
                id: review.googleReviewId,
                starRating: review.starRating,
                comment: review.comment,
                reviewerName: review.reviewerName,
                createTime: review.createTime,
                replyStatus: review.replyStatus,
                reply: review.reply ?? null,
                latestAIDraft: review.aiDraft ?? null,
                location: {
                    id: location.googleLocationId,
                    name: location.name,
                },
            };
        })
        .filter((review): review is ReviewForDashboard => review !== null)
        .sort((left, right) => right.createTime.getTime() - left.createTime.getTime());

    const generatedThisMonth = dataset.reviews.filter((review) => review.aiDraft).length;
    const approvedDrafts = dataset.reviews.filter((review) => review.aiDraft?.status === DraftStatus.APPROVED).length;

    return buildDashboardDataFromReviews(reviews, dataset.insights, dataset.keywordRankings, generatedThisMonth, approvedDrafts, generatedThisMonth, true);
}

export async function getDashboardData(organizationId: string | null): Promise<DashboardData> {
    if (!organizationId) {
        return buildDemoDashboardData();
    }

    const reviewCount = await db.review.count({
        where: {
            location: {
                organizationId,
            },
        },
    });

    if (reviewCount === 0) {
        return buildDemoDashboardData();
    }

    const adapter = getGoogleBusinessProfileAdapter();
    const monthStart = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
    const [reviews, insights, generatedThisMonth, approvedDrafts, totalDrafts] = await Promise.all([
        db.review.findMany({
            where: {
                location: {
                    organizationId,
                },
            },
            include: {
                location: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
                reply: {
                    select: {
                        comment: true,
                        updateTime: true,
                    },
                },
                aiDrafts: {
                    orderBy: {
                        createdAt: "desc",
                    },
                    take: 1,
                    select: {
                        draftContent: true,
                        status: true,
                    },
                },
            },
            orderBy: {
                createTime: "desc",
            },
        }),
        adapter.getInsights(organizationId),
        db.aIReplyDraft.count({
            where: {
                review: {
                    location: {
                        organizationId,
                    },
                },
                createdAt: {
                    gte: monthStart,
                },
            },
        }),
        db.aIReplyDraft.count({
            where: {
                review: {
                    location: {
                        organizationId,
                    },
                },
                status: DraftStatus.APPROVED,
            },
        }),
        db.aIReplyDraft.count({
            where: {
                review: {
                    location: {
                        organizationId,
                    },
                },
            },
        }),
    ]);

    const uniqueLocations = Array.from(new Map(reviews.map((review) => [review.location.id, review.location])).values());
    const syntheticRankings = buildSyntheticKeywordRankings(uniqueLocations.map((location) => ({
        id: location.id,
        name: location.name,
    })));

    return buildDashboardDataFromReviews(reviews.map((review) => ({
        ...review,
        reply: review.reply,
        latestAIDraft: review.aiDrafts[0] ?? null,
    })), insights, syntheticRankings, generatedThisMonth, approvedDrafts, totalDrafts, false);
}