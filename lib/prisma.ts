import { PrismaClient } from "@prisma/client"
import { PrismaLibSQL } from "@prisma/adapter-libsql"

const globalForPrisma = globalThis as typeof globalThis & {
  prisma?: PrismaClient
}

function createPrismaClient() {
  const connectionString = process.env.DATABASE_URL || process.env.TURSO_DATABASE_URL

  if (!connectionString) {
    throw new Error("DATABASE_URL is not configured.")
  }

  const adapter = new PrismaLibSQL({
    url: connectionString,
    authToken: process.env.TURSO_AUTH_TOKEN,
  })

  return new PrismaClient({
    adapter: adapter as never,
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  })
}

export function getPrisma() {
  if (!globalForPrisma.prisma) {
    globalForPrisma.prisma = createPrismaClient()
  }

  return globalForPrisma.prisma
}

export const prisma = new Proxy({} as PrismaClient, {
  get(_target, property, receiver) {
    const value = Reflect.get(getPrisma(), property, receiver)
    return typeof value === "function" ? value.bind(getPrisma()) : value
  },
})
