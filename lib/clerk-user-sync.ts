import { Prisma, User } from "@prisma/client";
import { db } from "./db";

type ClerkUserSyncInput = {
    clerkId: string;
    email: string;
    name: string | null;
    imageUrl: string | null;
};

async function moveMemberships(
    tx: Prisma.TransactionClient,
    fromUserId: string,
    toUserId: string
) {
    const memberships = await tx.member.findMany({
        where: { userId: fromUserId },
    });

    for (const membership of memberships) {
        await tx.member.upsert({
            where: {
                userId_organizationId: {
                    userId: toUserId,
                    organizationId: membership.organizationId,
                },
            },
            update: {
                role: membership.role,
            },
            create: {
                userId: toUserId,
                organizationId: membership.organizationId,
                role: membership.role,
            },
        });
    }

    await tx.member.deleteMany({
        where: { userId: fromUserId },
    });
}

export async function syncClerkUser(input: ClerkUserSyncInput): Promise<User> {
    return db.$transaction(async (tx) => {
        const existingByClerkId = await tx.user.findUnique({
            where: { clerkId: input.clerkId },
        });

        const existingByEmail = await tx.user.findUnique({
            where: { email: input.email },
        });

        if (existingByClerkId && (!existingByEmail || existingByEmail.id === existingByClerkId.id)) {
            return tx.user.update({
                where: { id: existingByClerkId.id },
                data: {
                    email: input.email,
                    name: input.name,
                    imageUrl: input.imageUrl,
                },
            });
        }

        if (!existingByClerkId && existingByEmail) {
            return tx.user.update({
                where: { id: existingByEmail.id },
                data: {
                    clerkId: input.clerkId,
                    email: input.email,
                    name: input.name,
                    imageUrl: input.imageUrl,
                },
            });
        }

        if (existingByClerkId && existingByEmail && existingByClerkId.id !== existingByEmail.id) {
            await moveMemberships(tx, existingByClerkId.id, existingByEmail.id);

            await tx.user.delete({
                where: { id: existingByClerkId.id },
            });

            return tx.user.update({
                where: { id: existingByEmail.id },
                data: {
                    clerkId: input.clerkId,
                    email: input.email,
                    name: input.name,
                    imageUrl: input.imageUrl,
                },
            });
        }

        return tx.user.create({
            data: {
                clerkId: input.clerkId,
                email: input.email,
                name: input.name,
                imageUrl: input.imageUrl,
            },
        });
    });
}