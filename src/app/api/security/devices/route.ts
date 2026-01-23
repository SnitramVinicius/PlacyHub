import { NextResponse } from "next/server";
import { cookies } from "next/headers";

/* 🔹 LISTAR DISPOSITIVOS */
export async function GET() {
  const cookieStore = await cookies();
  const devicesCookie = cookieStore.get("placyhub_devices")?.value;
  const devices = devicesCookie ? JSON.parse(devicesCookie) : [];

  return NextResponse.json({ devices });
}

/* 🔹 ENCERRAR DISPOSITIVO */
export async function DELETE(req: Request) {
  const { id } = await req.json();
  const cookieStore = await cookies();

  const devicesCookie = cookieStore.get("placyhub_devices")?.value;
  const devices = devicesCookie ? JSON.parse(devicesCookie) : [];

  const updatedDevices = devices.filter((d: any) => d.id !== id);

  cookieStore.set("placyhub_devices", JSON.stringify(updatedDevices), {
    httpOnly: true,
    path: "/",
  });

  return NextResponse.json({ success: true });
}
