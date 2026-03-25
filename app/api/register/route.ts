import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"

export async function POST(request: Request) {
  try {
    const { email, password, confirmPassword, name } = await request.json()

    // ベーシックなバリデーション
    if (!email || !password || !name) {
      return NextResponse.json({ error: "必須項目が不足しています" }, { status: 400 })
    }

    if (password !== confirmPassword) {
      return NextResponse.json({ error: "パスワードが一致しません" }, { status: 400 })
    }

    if (password.length < 6) {
      return NextResponse.json({ error: "パスワードは6文字以上で入力してください" }, { status: 400 })
    }

    // 既存ユーザーチェック
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return NextResponse.json({ error: "このメールアドレスは既に登録されています" }, { status: 400 })
    }

    // パスワードのハッシュ化
    const hashedPassword = await bcrypt.hash(password, 10)

    // ユーザー作成
    const user = await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
        role: "user",
      },
    })

    return NextResponse.json({ 
      success: true, 
      user: { id: user.id, email: user.email, name: user.name } 
    })

  } catch (error: any) {
    console.error("Registration Error:", error)
    return NextResponse.json({ error: "登録中にエラーが発生しました" }, { status: 500 })
  }
}
