import { randomUUID } from "node:crypto"
import { existsSync, readFileSync } from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

import { loadEnvConfig } from "@next/env"
import { createClient } from "@libsql/client"

type TursoAuthUser = {
  id: string
  email: string
  name: string | null
  role: string
  password: string | null
  image: string | null
}

let cachedEnvFile: Record<string, string> | null = null
let envLoaded = false

function findProjectRoot() {
  const searchRoots = [process.cwd(), path.dirname(fileURLToPath(import.meta.url))]

  for (const root of searchRoots) {
    let currentDir = root

    while (true) {
      if (existsSync(path.join(currentDir, "package.json"))) {
        return currentDir
      }

      const parentDir = path.dirname(currentDir)

      if (parentDir === currentDir) {
        break
      }

      currentDir = parentDir
    }
  }

  return process.cwd()
}

function ensureEnvLoaded() {
  if (envLoaded) {
    return
  }

  loadEnvConfig(findProjectRoot())
  envLoaded = true
}

function readEnvFile() {
  if (cachedEnvFile) {
    return cachedEnvFile
  }

  const searchRoots = [process.cwd(), path.dirname(fileURLToPath(import.meta.url))]
  let envPath: string | null = null

  for (const root of searchRoots) {
    let currentDir = root

    while (true) {
      const candidate = path.join(currentDir, ".env")

      if (existsSync(candidate)) {
        envPath = candidate
        break
      }

      const parentDir = path.dirname(currentDir)

      if (parentDir === currentDir) {
        break
      }

      currentDir = parentDir
    }

    if (envPath) {
      break
    }
  }

  if (!envPath) {
    cachedEnvFile = {}
    return cachedEnvFile
  }

  const parsed = readFileSync(envPath, "utf8")
    .split(/\r?\n/)
    .reduce<Record<string, string>>((accumulator, line) => {
      const trimmed = line.trim()

      if (!trimmed || trimmed.startsWith("#")) {
        return accumulator
      }

      const separatorIndex = trimmed.indexOf("=")

      if (separatorIndex === -1) {
        return accumulator
      }

      const key = trimmed.slice(0, separatorIndex).trim()
      const value = trimmed.slice(separatorIndex + 1).trim().replace(/^"(.*)"$/, "$1")
      accumulator[key] = value
      return accumulator
    }, {})

  cachedEnvFile = parsed
  return parsed
}

function readServerEnv(name: string) {
  ensureEnvLoaded()
  return process.env[name] || readEnvFile()[name]
}

function readTursoUrl() {
  const explicitTursoUrl = readServerEnv("TURSO_DATABASE_URL")

  if (explicitTursoUrl) {
    return explicitTursoUrl
  }

  const databaseUrl = readServerEnv("DATABASE_URL")
  return databaseUrl?.startsWith("libsql://") ? databaseUrl : undefined
}

function assertTursoConfigured() {
  const tursoUrl = readTursoUrl()
  const tursoAuthToken = readServerEnv("TURSO_AUTH_TOKEN")

  if (!tursoUrl || !tursoAuthToken) {
    throw new Error("Turso connection is not configured.")
  }
}

function getTursoClient() {
  assertTursoConfigured()

  return createClient({
    url: readTursoUrl() as string,
    authToken: readServerEnv("TURSO_AUTH_TOKEN"),
  })
}

function mapUserRow(row: Record<string, unknown>): TursoAuthUser {
  return {
    id: String(row.id),
    email: String(row.email),
    name: row.name ? String(row.name) : null,
    role: row.role ? String(row.role) : "user",
    password: row.password ? String(row.password) : null,
    image: row.image ? String(row.image) : null,
  }
}

export async function getTursoUserByEmail(email: string) {
  const result = await getTursoClient().execute({
    sql: 'SELECT id, email, name, role, password, image FROM "User" WHERE email = ? LIMIT 1',
    args: [email.toLowerCase()],
  })

  const row = result.rows[0]
  return row ? mapUserRow(row as Record<string, unknown>) : null
}

export async function createTursoUser(input: { email: string; name: string; passwordHash: string }) {
  const user = {
    id: randomUUID(),
    email: input.email.toLowerCase(),
    name: input.name,
    role: "user",
    password: input.passwordHash,
  }

  await getTursoClient().execute({
    sql: 'INSERT INTO "User" (id, email, name, role, password) VALUES (?, ?, ?, ?, ?)',
    args: [user.id, user.email, user.name, user.role, user.password],
  })

  return user
}
