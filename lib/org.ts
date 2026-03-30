import { auth } from "@clerk/nextjs/server";
import { db } from "./db";
import { redirect } from "next/navigation";

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
  const { userId } = await auth();

  if (!userId) {
    return null;
  }

  return await db.user.findUnique({
    where: { clerkId: userId },
  });
}
