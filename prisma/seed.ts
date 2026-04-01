import { loadEnvConfig } from "@next/env";
import type { PrismaClient } from "@prisma/client";

let dbInstance: PrismaClient | null = null;

async function main() {
    loadEnvConfig(process.cwd());

    const [{ db }, { importDemoBusinessProfileData }] = await Promise.all([
        import("../lib/db"),
        import("../lib/demo-import"),
    ]);

    dbInstance = db;

    let organization = await db.organization.findFirst({
        orderBy: { createdAt: "asc" },
    });

    if (!organization) {
        const demoUser = await db.user.upsert({
            where: { clerkId: "demo_user" },
            update: {
                email: "demo-user@smartgram.online",
                name: "Demo User",
            },
            create: {
                clerkId: "demo_user",
                email: "demo-user@smartgram.online",
                name: "Demo User",
            },
        });

        organization = await db.organization.upsert({
            where: { clerkId: "demo_org" },
            update: {
                name: "Demo Organization",
                slug: "demo-organization",
            },
            create: {
                clerkId: "demo_org",
                name: "Demo Organization",
                slug: "demo-organization",
            },
        });

        await db.member.upsert({
            where: {
                userId_organizationId: {
                    userId: demoUser.id,
                    organizationId: organization.id,
                },
            },
            update: {
                role: "ADMIN",
            },
            create: {
                userId: demoUser.id,
                organizationId: organization.id,
                role: "ADMIN",
            },
        });
    }

    const result = await importDemoBusinessProfileData(organization.id);
    console.log("Demo data imported", result);
}

main()
    .catch((error) => {
        console.error(error);
        process.exit(1);
    })
    .finally(async () => {
        await dbInstance?.$disconnect();
    });