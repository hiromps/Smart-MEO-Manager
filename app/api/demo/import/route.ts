import { NextResponse } from "next/server";
import { z } from "zod";
import { requireOrgContext } from "@/lib/auth";
import { importDemoBusinessProfileData } from "@/lib/demo-import";

const importSchema = z.object({
    source: z.literal("demo").default("demo"),
});

export async function POST(request: Request) {
    try {
        const context = await requireOrgContext();
        const body = await request.json().catch(() => ({}));
        importSchema.parse(body);

        const result = await importDemoBusinessProfileData(context.organizationId);

        return NextResponse.json({
            ok: true,
            imported: result,
        });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json({ ok: false, error: "Invalid import payload" }, { status: 400 });
        }

        if (error instanceof Error && (error.message === "Unauthorized" || error.message === "Organization selection is required")) {
            return NextResponse.json({ ok: false, error: error.message }, { status: 401 });
        }

        return NextResponse.json({ ok: false, error: "Failed to import demo data" }, { status: 500 });
    }
}