import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
  const cookieStore = await cookies();
  const token = cookieStore.get("placyhub_token")?.value;

  if (!token) {
    return NextResponse.json(
      { message: "Não autenticado" },
      { status: 401 }
    );
  }

  return NextResponse.json({
    twoFactorEnabled: true,
  });
}
