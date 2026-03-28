import { Auth0Client } from "@auth0/nextjs-auth0/server"

const issuerBaseURL =
  process.env.AUTH0_ISSUER_BASE_URL ?? (process.env.AUTH0_DOMAIN ? `https://${process.env.AUTH0_DOMAIN}` : undefined)

export const auth0 = new Auth0Client({
  appBaseUrl: process.env.APP_BASE_URL,
  clientId: process.env.AUTH0_CLIENT_ID,
  clientSecret: process.env.AUTH0_CLIENT_SECRET,
  issuerBaseURL,
  secret: process.env.AUTH0_SECRET,
})

export function getAuth0Client() {
  return auth0
}

export type Auth0SessionUser = {
  sub: string
  email?: string
  name?: string
  picture?: string
}
