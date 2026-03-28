import { PrismaClient } from "@prisma/client"

const globalForPrisma = globalThis as typeof globalThis & {
  prisma?: PrismaClient
}

function createPrismaClient() {
  const connectionString = process.env.DATABASE_URL || process.env.TURSO_DATABASE_URL

  if (!connectionString) {
    throw new Error("DATABASE_URL is not configured.")
  }

  const runtimeRequire = eval("require") as NodeRequire
  const adapterModule = runtimeRequire("@prisma/adapter-libsql/dist/index-node.js") as {
    PrismaLibSql?: new (config: { url: string; authToken?: string }) => unknown
    default?:
      | { PrismaLibSql?: new (config: { url: string; authToken?: string }) => unknown }
      | (new (config: { url: string; authToken?: string }) => unknown)
  }
  const PrismaLibSql =
    adapterModule.PrismaLibSql ||
    (typeof adapterModule.default === "object" && adapterModule.default
      ? adapterModule.default.PrismaLibSql
      : undefined) ||
    (typeof adapterModule.default === "function" ? adapterModule.default : undefined)

  if (typeof PrismaLibSql !== "function") {
    throw new Error("Failed to load Prisma libsql adapter.")
  }

  const adapter = new PrismaLibSql({
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
