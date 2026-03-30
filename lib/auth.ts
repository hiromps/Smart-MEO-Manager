import { auth } from "@clerk/nextjs/server";
import { db } from "./db";

/**
 * 現在のセッションからテナント(Organization)とユーザー情報を取得するユーティリティ
 * 全てのServer Actions / API Routesでこれを呼び出し、テナントのコンテキストを確定させます。
 */
export async function requireOrgContext() {
  const session = await auth();

  if (!session.userId) {
    throw new Error("Unauthorized");
  }

  // B2B SaaSのため、Organizationが選択されていない場合はエラーにする（または選択画面へリダイレクト）
  if (!session.orgId) {
    throw new Error("Organization selection is required");
  }

  // DB上で該当のOrganizationとUserが存在するか、および権限を確認
  const member = await db.member.findFirst({
    where: {
      user: {
        clerkId: session.userId,
      },
      organization: {
        clerkId: session.orgId,
      },
    },
    include: {
      organization: true,
      user: true,
    },
  });

  if (!member) {
    throw new Error("You do not have access to this organization");
  }

  return {
    userId: member.user.id,
    clerkUserId: session.userId,
    organizationId: member.organization.id,
    clerkOrgId: session.orgId,
    role: member.role,
  };
}
