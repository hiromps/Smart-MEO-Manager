export type MemberRole = 'ADMIN' | 'MEMBER' | 'READONLY';
export type ReviewReplyStatus = 'UNHANDLED' | 'DRAFT' | 'REPLIED';
export type AIApprovalStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface BusinessLocation {
  id: string;
  organizationId: string;
  name: string;
  address?: string;
  googleLocationId: string;
}

export interface Review {
  id: string;
  organizationId: string;
  businessLocationId: string;
  reviewerName?: string;
  rating: number;
  comment?: string;
  reviewedAt: string;
  replyStatus: ReviewReplyStatus;
}
