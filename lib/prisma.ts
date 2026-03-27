import { createRequire } from "node:module"
import { PrismaClient } from "@prisma/client"

const require = createRequire(import.meta.url)
const adapterModule = require("@prisma/adapter-libsql") as typeof import("@prisma/adapter-libsql") & {
  default?: typeof import("@prisma/adapter-libsql") | { PrismaLibSql?: unknown }
}
const PrismaLibSql =
  adapterModule.PrismaLibSql ||
  (typeof adapterModule.default === "object" && adapterModule.default
    ? (adapterModule.default as { PrismaLibSql?: typeof adapterModule.PrismaLibSql }).PrismaLibSql
    : undefined) ||
  adapterModule.default

if (typeof PrismaLibSql !== "function") {
  throw new Error("Failed to load Prisma libsql adapter.")
}

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
