import { prisma } from "@/lib/prisma"

export type DashboardLocation = {
  id: string
  name: string
  googleLocationId: string
}

export type DashboardReview = {
  id: string
  reviewerName: string
  rating: number
  comment: string | null
  postedAt: string
  replyText: string | null
  repliedAt: string | null
  locationId: string
  locationName: string
  source: "live" | "demo"
}

export type DashboardStats = {
  locationCount: number
  reviewCount: number
  pendingCount: number
  repliedCount: number
  averageRating: number
}

export type DashboardData = {
  locations: DashboardLocation[]
  reviews: DashboardReview[]
  stats: DashboardStats
  isDemo: boolean
}

const demoLocations: DashboardLocation[] = [
  {
    id: "demo-location-1",
    name: "サンプル店舗 渋谷店",
    googleLocationId: "demo-shibuya-001",
  },
]

const demoReviews: DashboardReview[] = [
  {
    id: "demo-review-1",
    reviewerName: "田中",
    rating: 5,
    comment: "接客が丁寧で、待ち時間の案内も分かりやすかったです。",
    postedAt: "2026-03-25T09:00:00.000Z",
    replyText: null,
    repliedAt: null,
    locationId: "demo-location-1",
    locationName: "サンプル店舗 渋谷店",
    source: "demo",
  },
  {
    id: "demo-review-2",
    reviewerName: "佐藤",
    rating: 4,
    comment: "説明が分かりやすく、全体的に安心して利用できました。",
    postedAt: "2026-03-24T11:30:00.000Z",
    replyText: null,
    repliedAt: null,
    locationId: "demo-location-1",
    locationName: "サンプル店舗 渋谷店",
    source: "demo",
  },
  {
    id: "demo-review-3",
    reviewerName: "匿名ユーザー",
    rating: 2,
    comment: "予約時間よりかなり待たされました。改善してほしいです。",
    postedAt: "2026-03-23T07:15:00.000Z",
    replyText: null,
    repliedAt: null,
    locationId: "demo-location-1",
    locationName: "サンプル店舗 渋谷店",
    source: "demo",
  },
]

function computeStats(locations: DashboardLocation[], reviews: DashboardReview[]): DashboardStats {
  const reviewCount = reviews.length
  const repliedCount = reviews.filter((review) => review.replyText || review.repliedAt).length
  const pendingCount = reviewCount - repliedCount
  const averageRating =
    reviewCount === 0 ? 0 : reviews.reduce((sum, review) => sum + review.rating, 0) / reviewCount

  return {
    locationCount: locations.length,
    reviewCount,
    pendingCount,
    repliedCount,
    averageRating,
  }
}

async function getLiveDashboardData(userSub: string) {
  const [locations, reviews] = await Promise.all([
    prisma.businessLocation.findMany({
      where: {
        user: { auth0Sub: userSub },
      },
      orderBy: { updatedAt: "desc" },
      select: {
        id: true,
        name: true,
        googleLocationId: true,
      },
    }),
    prisma.review.findMany({
      where: {
        location: {
          user: { auth0Sub: userSub },
        },
      },
      orderBy: { postedAt: "desc" },
      take: 20,
      include: {
        location: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    }),
  ])

  const mappedReviews: DashboardReview[] = reviews.map((review) => ({
    id: review.id,
    reviewerName: review.reviewerName,
    rating: review.rating,
    comment: review.comment,
    postedAt: review.postedAt.toISOString(),
    replyText: review.replyText,
    repliedAt: review.repliedAt ? review.repliedAt.toISOString() : null,
    locationId: review.location.id,
    locationName: review.location.name,
    source: "live",
  }))

  return {
    locations,
    reviews: mappedReviews,
    stats: computeStats(locations, mappedReviews),
    isDemo: locations.length === 0 && mappedReviews.length === 0,
  }
}

export async function getDashboardData(userSub: string): Promise<DashboardData> {
  const live = await getLiveDashboardData(userSub)

  if (!live.isDemo) {
    return live
  }

  return {
    locations: demoLocations,
    reviews: demoReviews,
    stats: computeStats(demoLocations, demoReviews),
    isDemo: true,
  }
}
