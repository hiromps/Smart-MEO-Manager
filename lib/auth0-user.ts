import { prisma } from "@/lib/prisma"

import { auth0, type Auth0SessionUser } from "@/lib/auth0"

export type AppUser = {
  id: string
  auth0Sub: string
  email: string | null
  name: string | null
  image: string | null
  role: string
}

function normalizeName(user: Auth0SessionUser) {
  return user.name?.trim() || user.email?.split("@")[0] || "User"
}

export async function getAuth0User() {
  const session = await auth0.getSession()

  if (!session?.user?.sub) {
    return null
  }

  return session.user as Auth0SessionUser
}

export async function ensureAppUser(user: Auth0SessionUser): Promise<AppUser> {
  const existingBySub = await prisma.user.findUnique({
    where: { auth0Sub: user.sub },
  })

  if (existingBySub) {
    const updated = await prisma.user.update({
      where: { id: existingBySub.id },
      data: {
        email: user.email?.toLowerCase() ?? existingBySub.email,
        name: normalizeName(user),
        image: user.picture ?? existingBySub.image,
      },
    })

    return {
      id: updated.id,
      auth0Sub: updated.auth0Sub ?? user.sub,
      email: updated.email,
      name: updated.name,
      image: updated.image,
      role: updated.role,
    }
  }

  const email = user.email?.toLowerCase() ?? null

  if (email) {
    const existingByEmail = await prisma.user.findUnique({
      where: { email },
    })

    if (existingByEmail) {
      const updated = await prisma.user.update({
        where: { id: existingByEmail.id },
        data: {
          auth0Sub: user.sub,
          name: normalizeName(user),
          image: user.picture ?? existingByEmail.image,
        },
      })

      return {
        id: updated.id,
        auth0Sub: updated.auth0Sub ?? user.sub,
        email: updated.email,
        name: updated.name,
        image: updated.image,
        role: updated.role,
      }
    }
  }

  const created = await prisma.user.create({
    data: {
      auth0Sub: user.sub,
      email,
      name: normalizeName(user),
      image: user.picture ?? null,
      role: "user",
    },
  })

  return {
    id: created.id,
    auth0Sub: created.auth0Sub ?? user.sub,
    email: created.email,
    name: created.name,
    image: created.image,
    role: created.role,
  }
}
