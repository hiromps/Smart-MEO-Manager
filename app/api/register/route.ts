import bcrypt from "bcryptjs"
import { NextResponse } from "next/server"
import { z } from "zod"

import { prisma } from "@/lib/prisma"

const registerSchema = z
  .object({
    name: z.string().trim().min(1, "名前を入力してください。").max(100, "名前が長すぎます。"),
    email: z.string().trim().email("正しいメールアドレスを入力してください。"),
    password: z.string().min(8, "パスワードは8文字以上で入力してください。"),
    confirmPassword: z.string().min(1, "確認用パスワードを入力してください。"),
  })
  .refine((input) => input.password === input.confirmPassword, {
    message: "確認用パスワードが一致していません。",
    path: ["confirmPassword"],
  })

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const parsed = registerSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0]?.message || "入力内容が不正です。" }, { status: 400 })
    }

    const email = parsed.data.email.toLowerCase()

    const existingUser = await prisma.user.findUnique({
      where: { email },
      select: { id: true },
    })

    if (existingUser) {
      return NextResponse.json({ error: "このメールアドレスはすでに登録されています。" }, { status: 409 })
    }

    const hashedPassword = await bcrypt.hash(parsed.data.password, 12)

    const user = await prisma.user.create({
      data: {
        name: parsed.data.name,
        email,
        password: hashedPassword,
        role: "user",
      },
      select: {
        id: true,
        name: true,
        email: true,
      },
    })

    return NextResponse.json({ success: true, user }, { status: 201 })
  } catch (error) {
    console.error("Registration Error:", error)
    return NextResponse.json({ error: "会員登録中にエラーが発生しました。" }, { status: 500 })
  }
}
