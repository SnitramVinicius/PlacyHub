import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

export async function POST(req: NextRequest) {
  // 🔐 usuário fake
  const fakeUser = {
    id: "user_123",
    email: "teste@placyhub.com",
  };

  const token = jwt.sign(
    {
      userId: fakeUser.id,
      email: fakeUser.email,
    },
    process.env.JWT_SECRET!,
    { expiresIn: "7d" }
  );

  const response = NextResponse.json({ success: true });

  response.cookies.set("placyhub_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    sameSite: "lax",
  });

  return response;
}
