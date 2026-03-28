import { Auth0Client } from "@auth0/nextjs-auth0/server"

export const auth0 = new Auth0Client()

export function getAuth0Client() {
  return auth0
}

export type Auth0SessionUser = {
  sub: string
  email?: string
  name?: string
  picture?: string
}
