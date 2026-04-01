import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { importDemoBusinessProfileData } from "@/lib/demo-import";
import { syncCurrentUser } from "@/lib/org";

const importSchema = z.object({
    source: z.literal("demo").default("demo"),
    clerkOrgId: z.string().min(1).optional(),
});

function mapSessionRoleToMemberRole(orgRole: string | null | undefined) {
    return orgRole === "org:admin" ? "ADMIN" : "MEMBER";
}

export async function POST(request: Request) {
    try {
        const body = await request.json().catch(() => ({}));
        const payload = importSchema.parse(body);
        const session = await auth();

        if (!session.userId) {
            return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
        }

        const clerkOrgId = session.orgId ?? payload.clerkOrgId;

        if (!clerkOrgId) {
            return NextResponse.json({ ok: false, error: "Organization selection is required" }, { status: 400 });
        }

        const user = await syncCurrentUser();

        if (!user) {
            return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
        }

        const organization = await db.organization.upsert({
            where: {
                clerkId: clerkOrgId,
            },
            update: {},
            create: {
                clerkId: clerkOrgId,
                name: "Clerk Organization",
                slug: clerkOrgId,
            },
        });

        await db.member.upsert({
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
        });

        const result = await importDemoBusinessProfileData(organization.id);

        return NextResponse.json({
            ok: true,
            imported: result,
        });
    } catch (error) {
        console.error("demo import failed", error);

        if (error instanceof z.ZodError) {
            return NextResponse.json({ ok: false, error: "Invalid import payload" }, { status: 400 });
        }

        if (error instanceof Error) {
            return NextResponse.json({ ok: false, error: error.message || "Failed to import demo data" }, { status: 500 });
        }

        return NextResponse.json({ ok: false, error: "Failed to import demo data" }, { status: 500 });
    }
}