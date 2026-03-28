export type ReplyTone = "warm" | "professional" | "concise"
export type ReplyLength = "short" | "medium" | "long"

export type ReviewLike = {
  reviewerName: string
  rating: number
  comment: string | null
  locationName: string
}

export type ReplyOptions = {
  tone: ReplyTone
  length: ReplyLength
  signature: string
}

const toneOpeners: Record<ReplyTone, string> = {
  warm: "温かいレビューをありがとうございます。",
  professional: "貴重なご意見をお寄せいただき、ありがとうございます。",
  concise: "レビューありがとうございます。",
}

const toneClosers: Record<ReplyTone, string> = {
  warm: "またのご来店を、スタッフ一同心よりお待ちしております。",
  professional: "今後も品質向上に努めてまいります。",
  concise: "またのご来店をお待ちしております。",
}

function summarizeComment(comment: string | null, length: ReplyLength) {
  if (!comment) {
    return ""
  }

  const normalized = comment.replace(/\s+/g, " ").trim()
  const limit = length === "short" ? 24 : length === "medium" ? 48 : 72
  return normalized.length <= limit ? normalized : `${normalized.slice(0, limit)}...`
}

function positiveBody(review: ReviewLike, length: ReplyLength) {
  const mention = summarizeComment(review.comment, length)

  if (review.rating >= 5) {
    return [
      `「${review.locationName}」をご評価いただけたことを大変うれしく思います。`,
      mention ? `「${mention}」というお言葉は、スタッフの励みになります。` : "",
      "今後も期待を上回れるよう、サービスの改善を続けてまいります。",
    ]
      .filter(Boolean)
      .join(" ")
  }

  if (review.rating >= 4) {
    return [
      `「${review.locationName}」をお選びいただきありがとうございます。`,
      mention ? `「${mention}」と感じていただけた点を、チームで共有いたします。` : "",
      "次回はさらに満足度の高い体験をお届けできるよう努めます。",
    ]
      .filter(Boolean)
      .join(" ")
  }

  return [
    `「${review.locationName}」をご利用いただきありがとうございます。`,
    "ご期待に十分お応えできなかった点について、心よりお詫び申し上げます。",
    mention ? `ご指摘いただいた「${mention}」は、すぐに見直します。` : "",
  ]
    .filter(Boolean)
    .join(" ")
}

function concernBody(review: ReviewLike, length: ReplyLength) {
  const mention = summarizeComment(review.comment, length)

  return [
    "このたびはご不便とご不快な思いをおかけし、誠に申し訳ございません。",
    mention ? `ご指摘の「${mention}」を重く受け止め、現場で確認を進めます。` : "",
    "改善を急ぎ、再発防止に向けて対応いたします。",
  ]
    .filter(Boolean)
    .join(" ")
}

export function buildAutoReplyDraft(review: ReviewLike, options: ReplyOptions) {
  const opener = toneOpeners[options.tone]
  const closer = toneClosers[options.tone]
  const body = review.rating <= 2 ? concernBody(review, options.length) : positiveBody(review, options.length)

  if (options.length === "short") {
    return `${opener} ${body}\n\n${options.signature}`.trim()
  }

  if (options.length === "medium") {
    return `${opener}\n\n${body}\n\n${options.signature}`.trim()
  }

  return `${opener}\n\n${body}\n\n${closer}\n${options.signature}`.trim()
}
