import { Webhook } from "svix";
import { headers } from "next/headers";
import { WebhookEvent } from "@clerk/nextjs/server";
import { db } from "@/lib/db";

function buildDisplayName(firstName: string | null, lastName: string | null) {
  return `${firstName || ""} ${lastName || ""}`.trim() || null;
}

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    throw new Error(
      "Please add CLERK_WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local"
    );
  }

  // Get the headers
  const headerPayload = await headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Error occured -- no svix headers", {
      status: 400,
    });
  }

  // Get the body
  const payload = await req.json();
  const body = JSON.stringify(payload);

  // Create a new Svix instance with your secret.
  const wh = new Webhook(WEBHOOK_SECRET);

  let evt: WebhookEvent;

  // Verify the payload with the headers
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return new Response("Error occured", {
      status: 400,
    });
  }

  const { id } = evt.data;
  const eventType = evt.type;

  if (eventType === "user.created" || eventType === "user.updated") {
    const { id, email_addresses, first_name, last_name, image_url } = evt.data;
    const primaryEmail = email_addresses[0]?.email_address;

    if (primaryEmail) {
      await db.user.upsert({
        where: { clerkId: id },
        update: {
          email: primaryEmail,
          name: buildDisplayName(first_name, last_name),
          imageUrl: image_url,
        },
        create: {
          clerkId: id,
          email: primaryEmail,
          name: buildDisplayName(first_name, last_name),
          imageUrl: image_url,
        },
      });
    }
  }

  if (eventType === "user.deleted") {
    const { id } = evt.data;

    await db.user.delete({
      where: { clerkId: id },
    });
  }

  if (eventType === "organization.created") {
    const { id, name, slug, image_url, created_by } = evt.data;

    const org = await db.organization.upsert({
      where: { clerkId: id },
      update: {
        name: name,
        slug: slug || id,
        imageUrl: image_url,
      },
      create: {
        clerkId: id,
        name: name,
        slug: slug || id,
        imageUrl: image_url,
      }
    });

    const user = await db.user.findUnique({
      where: { clerkId: created_by }
    });

    if (user) {
      await db.member.upsert({
        where: {
          userId_organizationId: {
            userId: user.id,
            organizationId: org.id,
          },
        },
        update: {
          role: "ADMIN",
        },
        create: {
          userId: user.id,
          organizationId: org.id,
          role: "ADMIN"
        }
      });
    }
  }

  // Handle other events like organization membership created
  if (eventType === "organizationMembership.created") {
    const { organization, public_user_data, role } = evt.data;

    const user = await db.user.findUnique({
      where: { clerkId: public_user_data.user_id }
    });

    const org = await db.organization.findUnique({
      where: { clerkId: organization.id }
    });

    if (user && org) {
      await db.member.upsert({
        where: {
          userId_organizationId: {
            userId: user.id,
            organizationId: org.id
          }
        },
        update: {
          role: role === "org:admin" ? "ADMIN" : "MEMBER"
        },
        create: {
          userId: user.id,
          organizationId: org.id,
          role: role === "org:admin" ? "ADMIN" : "MEMBER"
        }
      });
    }
  }

  return new Response("", { status: 200 });
}
