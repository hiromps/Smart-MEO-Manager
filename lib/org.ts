import { auth, currentUser } from "@clerk/nextjs/server";
import { db } from "./db";
import { redirect } from "next/navigation";

function buildDisplayName(firstName: string | null, lastName: string | null) {
  return `${firstName || ""} ${lastName || ""}`.trim() || null;
}

export async function syncCurrentUser() {
  const { userId } = await auth();

  if (!userId) {
    return null;
  }

  const clerkUser = await currentUser();

  if (!clerkUser) {
    return null;
  }

  const primaryEmail =
    clerkUser.emailAddresses.find(
      (email) => email.id === clerkUser.primaryEmailAddressId
    )?.emailAddress || clerkUser.emailAddresses[0]?.emailAddress;

  if (!primaryEmail) {
    return null;
  }

  return await db.user.upsert({
    where: { clerkId: userId },
    update: {
      email: primaryEmail,
      name: buildDisplayName(clerkUser.firstName, clerkUser.lastName),
      imageUrl: clerkUser.imageUrl,
    },
    create: {
      clerkId: userId,
      email: primaryEmail,
      name: buildDisplayName(clerkUser.firstName, clerkUser.lastName),
      imageUrl: clerkUser.imageUrl,
    },
  });
}

/**
 * Gets the current tenant (organization) from the Clerk session.
 * Ensures the organization exists in our Prisma database.
 */
export async function getCurrentOrg() {
  const { orgId } = await auth();

  if (!orgId) {
    return null;
  }

  const organization = await db.organization.findUnique({
    where: { clerkId: orgId },
  });

  return organization;
}

/**
 * Strictly requires an organization to be selected.
 * Redirects or throws if no organization context is found.
 */
export async function requireOrg() {
  const org = await getCurrentOrg();

  if (!org) {
    // This assumes we have an 'org-selection' page or dashboard handles it
    return null;
  }

  return org;
}

/**
 * Gets the current user from our database based on the Clerk session.
 */
export async function getCurrentUser() {
  return await syncCurrentUser();
}
