import { PrismaLibSql } from "@prisma/adapter-libsql"
import { PrismaClient } from "@prisma/client"

const globalForPrisma = globalThis as typeof globalThis & {
  prisma?: PrismaClient
}

const connectionString = process.env.DATABASE_URL || process.env.TURSO_DATABASE_URL

if (!connectionString) {
  throw new Error("DATABASE_URL is not configured.")
}

const adapter = new PrismaLibSql({
  url: connectionString,
  authToken: process.env.TURSO_AUTH_TOKEN,
})

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  })

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma
}
