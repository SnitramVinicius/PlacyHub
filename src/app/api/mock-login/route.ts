import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { cookies, headers } from "next/headers";

export async function POST() {
  const token = jwt.sign(
    { userId: "user_mock_123" },
    process.env.JWT_SECRET!,
    { expiresIn: "7d" }
  );

  const cookieStore = await cookies();
  const headerStore = await headers();

  // 🔹 Captura informações do dispositivo
  const userAgent = headerStore.get("user-agent") || "Desconhecido";
  const now = new Date().toISOString();

  // 🔹 Lê dispositivos já salvos
  const existingDevicesCookie = cookieStore.get("placyhub_devices")?.value;
  const devices = existingDevicesCookie
    ? JSON.parse(existingDevicesCookie)
    : [];

  // 🔹 Adiciona novo dispositivo
 devices.push({
  id: crypto.randomUUID(),
  device: userAgent,
  location: "Local desconhecido",
  lastAccess: now,
});

  // 🔹 Salva cookies
  cookieStore.set("placyhub_token", token, {
    httpOnly: true,
    path: "/",
  });

  cookieStore.set("placyhub_devices", JSON.stringify(devices), {
    httpOnly: true,
    path: "/",
  });

  return NextResponse.json({ success: true });
}
