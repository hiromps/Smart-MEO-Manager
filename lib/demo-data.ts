import { DraftStatus, ReplyStatus } from "@prisma/client";

export type DemoInsightsPoint = {
    date: string;
    searches: number;
    views: number;
};

export type DemoLocation = {
    googleLocationId: string;
    name: string;
    address: string;
};

export type DemoReview = {
    googleReviewId: string;
    locationGoogleId: string;
    starRating: number;
    comment: string | null;
    reviewerName: string;
    createTime: Date;
    updateTime: Date | null;
    replyStatus: ReplyStatus;
    reply?: {
        comment: string;
        updateTime: Date;
    };
    aiDraft?: {
        draftContent: string;
        status: DraftStatus;
    };
};

export type DemoBusinessProfileDataset = {
    googleAccount: {
        googleId: string;
        email: string;
    };
    locations: DemoLocation[];
    reviews: DemoReview[];
    replyTemplates: Array<{
        name: string;
        content: string;
        targetStarRating: number | null;
    }>;
    insights: DemoInsightsPoint[];
};

function addDays(baseDate: Date, diff: number) {
    const date = new Date(baseDate);
    date.setDate(date.getDate() + diff);
    return date;
}

function addMonths(baseDate: Date, diff: number) {
    const date = new Date(baseDate);
    date.setMonth(date.getMonth() + diff);
    return date;
}

export function buildDemoBusinessProfileDataset(namespace = "demo"): DemoBusinessProfileDataset {
    const now = new Date();

    const locations: DemoLocation[] = [
        {
            googleLocationId: `loc-${namespace}-shinjuku`,
            name: "新宿店",
            address: "東京都新宿区西新宿1-1-1",
        },
        {
            googleLocationId: `loc-${namespace}-shibuya`,
            name: "渋谷店",
            address: "東京都渋谷区渋谷2-2-2",
        },
        {
            googleLocationId: `loc-${namespace}-ikebukuro`,
            name: "池袋店",
            address: "東京都豊島区南池袋3-3-3",
        },
    ];

    const reviews: DemoReview[] = [
        {
            googleReviewId: `rev-${namespace}-001`,
            locationGoogleId: locations[0].googleLocationId,
            starRating: 5,
            comment: "スタッフの対応が早くて丁寧でした。また利用したいです。",
            reviewerName: "田中 太郎",
            createTime: addDays(now, -1),
            updateTime: addDays(now, -1),
            replyStatus: ReplyStatus.UNANSWERED,
            aiDraft: {
                draftContent: "ご来店ありがとうございました。今後も丁寧な対応を心がけます。",
                status: DraftStatus.PENDING,
            },
        },
        {
            googleReviewId: `rev-${namespace}-002`,
            locationGoogleId: locations[1].googleLocationId,
            starRating: 4,
            comment: "料理は美味しかったですが、少し待ち時間が長かったです。",
            reviewerName: "佐藤 花子",
            createTime: addDays(now, -2),
            updateTime: addDays(now, -2),
            replyStatus: ReplyStatus.PENDING_APPROVAL,
            aiDraft: {
                draftContent: "お待たせしてしまい申し訳ありません。運営改善に活かします。",
                status: DraftStatus.APPROVED,
            },
        },
        {
            googleReviewId: `rev-${namespace}-003`,
            locationGoogleId: locations[2].googleLocationId,
            starRating: 3,
            comment: "普通でした。可もなく不可もなくです。",
            reviewerName: "鈴木 一郎",
            createTime: addDays(now, -5),
            updateTime: addDays(now, -5),
            replyStatus: ReplyStatus.ANSWERED,
            reply: {
                comment: "率直なご意見ありがとうございます。改善に努めます。",
                updateTime: addDays(now, -4),
            },
        },
        {
            googleReviewId: `rev-${namespace}-004`,
            locationGoogleId: locations[0].googleLocationId,
            starRating: 5,
            comment: "店内が清潔で居心地が良かったです。",
            reviewerName: "高橋 美咲",
            createTime: addDays(now, -9),
            updateTime: addDays(now, -9),
            replyStatus: ReplyStatus.ANSWERED,
            reply: {
                comment: "嬉しいお言葉ありがとうございます。今後も快適な空間を維持します。",
                updateTime: addDays(now, -8),
            },
        },
        {
            googleReviewId: `rev-${namespace}-005`,
            locationGoogleId: locations[1].googleLocationId,
            starRating: 4,
            comment: "アクセスが良く、使いやすい店舗でした。",
            reviewerName: "山本 健",
            createTime: addMonths(now, -1),
            updateTime: addMonths(now, -1),
            replyStatus: ReplyStatus.ANSWERED,
            reply: {
                comment: "ご利用ありがとうございました。またのご来店をお待ちしています。",
                updateTime: addMonths(now, -1),
            },
        },
        {
            googleReviewId: `rev-${namespace}-006`,
            locationGoogleId: locations[2].googleLocationId,
            starRating: 5,
            comment: "接客が素晴らしく、安心して利用できました。",
            reviewerName: "中村 彩",
            createTime: addMonths(now, -2),
            updateTime: addMonths(now, -2),
            replyStatus: ReplyStatus.ANSWERED,
            reply: {
                comment: "高評価をありがとうございます。スタッフ一同励みになります。",
                updateTime: addMonths(now, -2),
            },
        },
        {
            googleReviewId: `rev-${namespace}-007`,
            locationGoogleId: locations[0].googleLocationId,
            starRating: 2,
            comment: "混雑していて落ち着きませんでした。",
            reviewerName: "小林 直樹",
            createTime: addMonths(now, -3),
            updateTime: addMonths(now, -3),
            replyStatus: ReplyStatus.PENDING_APPROVAL,
            aiDraft: {
                draftContent: "ご不便をおかけし申し訳ありません。混雑時の運営改善を進めます。",
                status: DraftStatus.PENDING,
            },
        },
        {
            googleReviewId: `rev-${namespace}-008`,
            locationGoogleId: locations[1].googleLocationId,
            starRating: 5,
            comment: "家族で利用しましたが全員満足でした。",
            reviewerName: "加藤 由美",
            createTime: addMonths(now, -4),
            updateTime: addMonths(now, -4),
            replyStatus: ReplyStatus.ANSWERED,
            reply: {
                comment: "ご家族でのご利用ありがとうございました。ぜひまたお越しください。",
                updateTime: addMonths(now, -4),
            },
        },
    ];

    return {
        googleAccount: {
            googleId: `gacc-${namespace}`,
            email: `demo+${namespace}@smartgram.online`,
        },
        locations,
        reviews,
        replyTemplates: [
            {
                name: "高評価向けお礼",
                content: "ご来店と温かい口コミをありがとうございます。今後もご満足いただけるよう努めます。",
                targetStarRating: 5,
            },
            {
                name: "改善提案への返信",
                content: "貴重なご意見をありがとうございます。いただいた内容をもとに改善を進めます。",
                targetStarRating: 3,
            },
        ],
        insights: [
            { date: "月", searches: 1200, views: 850 },
            { date: "火", searches: 1400, views: 920 },
            { date: "水", searches: 1100, views: 780 },
            { date: "木", searches: 1600, views: 1100 },
            { date: "金", searches: 1800, views: 1250 },
            { date: "土", searches: 2200, views: 1600 },
            { date: "日", searches: 2000, views: 1400 },
        ],
    };
}