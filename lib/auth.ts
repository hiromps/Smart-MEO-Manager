import { auth } from "@clerk/nextjs/server";
import { db } from "./db";
import { syncCurrentUser } from "./org";

function mapSessionRoleToMemberRole(orgRole: string | null | undefined) {
  return orgRole === "org:admin" ? "ADMIN" : "MEMBER";
}

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

  const user = await syncCurrentUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const organization = await db.organization.upsert({
    where: {
      clerkId: session.orgId,
    },
    update: {},
    create: {
      clerkId: session.orgId,
      name: "Clerk Organization",
      slug: session.orgId,
    },
  });

  const member = await db.member.upsert({
    where: {
      userId_organizationId: {
        userId: user.id,
        organizationId: organization.id,
      },
    },
    update: {
      role: mapSessionRoleToMemberRole((session as { orgRole?: string | null }).orgRole),
    },
    create: {
      userId: user.id,
      organizationId: organization.id,
      role: mapSessionRoleToMemberRole((session as { orgRole?: string | null }).orgRole),
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
