import { Auth0Client } from "@auth0/nextjs-auth0/server"

export const auth0 = new Auth0Client({
  domain: process.env.AUTH0_DOMAIN,
  appBaseUrl: process.env.APP_BASE_URL,
  clientId: process.env.AUTH0_CLIENT_ID,
  clientSecret: process.env.AUTH0_CLIENT_SECRET,
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
