import bcrypt from "bcryptjs"
import { NextResponse } from "next/server"
import { z } from "zod"

import { getTursoUserByEmail } from "@/lib/turso-auth"

const loginSchema = z.object({
  email: z.string().trim().email("正しいメールアドレスを入力してください。"),
  password: z.string().min(1, "パスワードを入力してください。"),
})

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const parsed = loginSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0]?.message || "入力内容が不正です。" }, { status: 400 })
    }

    const user = await getTursoUserByEmail(parsed.data.email)

    if (!user?.password) {
      return NextResponse.json({ error: "メールアドレスまたはパスワードが正しくありません。" }, { status: 401 })
    }

    const isPasswordValid = await bcrypt.compare(parsed.data.password, user.password)

    if (!isPasswordValid) {
      return NextResponse.json({ error: "メールアドレスまたはパスワードが正しくありません。" }, { status: 401 })
    }

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    })
  } catch (error) {
    console.error("Login Error:", error)
    return NextResponse.json({ error: "ログイン中にエラーが発生しました。" }, { status: 500 })
  }
}
