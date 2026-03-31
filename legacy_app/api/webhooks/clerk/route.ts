import { Webhook } from "svix";
import { headers } from "next/headers";
import { WebhookEvent } from "@clerk/nextjs/server";
import { db } from "@/lib/db";

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

  if (eventType === "user.created") {
    const { id, email_addresses, first_name, last_name, image_url } = evt.data;

    await db.user.create({
      data: {
        clerkId: id,
        email: email_addresses[0].email_address,
        name: `${first_name || ""} ${last_name || ""}`.trim(),
        imageUrl: image_url,
      },
    });
  }

  if (eventType === "user.updated") {
    const { id, email_addresses, first_name, last_name, image_url } = evt.data;

    await db.user.update({
      where: { clerkId: id },
      data: {
        email: email_addresses[0].email_address,
        name: `${first_name || ""} ${last_name || ""}`.trim(),
        imageUrl: image_url,
      },
    });
  }

  if (eventType === "user.deleted") {
    const { id } = evt.data;

    await db.user.delete({
      where: { clerkId: id },
    });
  }

  if (eventType === "organization.created") {
     const { id, name, slug, image_url, created_by } = evt.data;
     
     // 1. Create the organization
     const org = await db.organization.create({
       data: {
         clerkId: id,
         name: name,
         slug: slug || id,
         imageUrl: image_url,
       }
     });

     // 2. Link the creator as ADMIN if user exists
     const user = await db.user.findUnique({
       where: { clerkId: created_by }
     });

     if (user) {
        await db.member.create({
          data: {
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
