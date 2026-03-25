import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: "メールアドレスとパスワードを入力してください" }, { status: 400 })
    }

    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user || !user.password) {
      return NextResponse.json({ error: "ユーザーが見つからないか、パスワードが設定されていません" }, { status: 401 })
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)

    if (!isPasswordValid) {
      return NextResponse.json({ error: "メールアドレスまたはパスワードが正しくありません" }, { status: 401 })
    }

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      }
    })

  } catch (error: any) {
    console.error("Login Error:", error)
    return NextResponse.json({ error: "ログイン中にエラーが発生しました" }, { status: 500 })
  }
}
