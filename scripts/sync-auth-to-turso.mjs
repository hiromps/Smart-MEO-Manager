import path from "node:path"
import { fileURLToPath } from "node:url"

import { createClient } from "@libsql/client"

const AUTH_TABLES = [
  {
    name: "User",
    columns: ["id", "name", "email", "emailVerified", "image", "role", "password"],
  },
  {
    name: "Account",
    columns: [
      "id",
      "userId",
      "type",
      "provider",
      "providerAccountId",
      "refresh_token",
      "access_token",
      "expires_at",
      "token_type",
      "scope",
      "id_token",
      "session_state",
    ],
  },
  {
    name: "Session",
    columns: ["id", "sessionToken", "userId", "expires"],
  },
  {
    name: "VerificationToken",
    columns: ["identifier", "token", "expires"],
  },
]

function resolveLocalDatabaseUrl(databaseUrl) {
  if (!databaseUrl?.startsWith("file:")) {
    throw new Error("DATABASE_URL must point to a local SQLite file (for example: file:./prisma/dev.db).")
  }

  const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
  const relativePath = databaseUrl.slice("file:".length)

  return `file:${path.resolve(repoRoot, relativePath)}`
}

async function syncTable(localClient, remoteClient, table) {
  const quotedColumns = table.columns.map((column) => `"${column}"`).join(", ")
  const rows = (await localClient.execute(`SELECT ${quotedColumns} FROM "${table.name}"`)).rows

  for (const row of rows) {
    const sql = `INSERT OR REPLACE INTO "${table.name}" (${quotedColumns}) VALUES (${table.columns.map(() => "?").join(", ")})`
    const args = table.columns.map((column) => row[column] ?? null)

    await remoteClient.execute({ sql, args })
  }

  return rows.length
}

async function main() {
  const localClient = createClient({
    url: resolveLocalDatabaseUrl(process.env.DATABASE_URL),
  })

  const remoteClient = createClient({
    url: process.env.TURSO_DATABASE_URL,
    authToken: process.env.TURSO_AUTH_TOKEN,
  })

  for (const table of AUTH_TABLES) {
    const count = await syncTable(localClient, remoteClient, table)
    console.log(`${table.name}: synced ${count} row(s)`)
  }

  console.log("Auth data sync to Turso completed.")
}

main().catch((error) => {
  console.error("Failed to sync auth data to Turso.")
  console.error(error)
  process.exitCode = 1
})
