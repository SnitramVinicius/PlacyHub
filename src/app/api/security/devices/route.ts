import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

async function usuarioAutenticado(request: Request) {
  const token = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  if (!token) return null;
  const { data, error } = await supabaseAdmin.auth.getUser(token);
  return error ? null : data.user;
}

export async function GET(request: Request) {
  try {
    const user = await usuarioAutenticado(request);
    if (!user) return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
    
    // Buscar dispositivos do usuário
    const { data: devices, error } = await supabaseAdmin
      .from("user_sessions")
      .select("*")
      .eq("user_id", user.id)
      .order("last_active", { ascending: false });
    
    if (error) {
      console.error("❌ Erro ao buscar dispositivos:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }    
    // Formatar dispositivos para o frontend - 🔥 INCLUIR LOCATION
    const formattedDevices = devices.map(device => ({
      id: device.id,
      name: device.device_name || device.device_type || "Dispositivo",
      userAgent: `${device.browser} - ${device.os}`,
      lastAccess: device.last_active,
      atual: device.is_current,
      location: device.location,  // 🔥 ADICIONAR ESTA LINHA
      ip: device.ip_address,       // 🔥 ADICIONAR ESTA LINHA
    }));   
    return NextResponse.json({ devices: formattedDevices });
  } catch (error) {
    console.error("❌ Erro ao buscar dispositivos:", error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const user = await usuarioAutenticado(request);
    if (!user) return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
    const { id } = await request.json();
    if (typeof id !== "string" || !id) return NextResponse.json({ error: "ID inválido" }, { status: 400 });
    
    // Verificar se o dispositivo pertence ao usuário
    const { data: device, error: findError } = await supabaseAdmin
      .from("user_sessions")
      .select("user_id")
      .eq("id", id)
      .single();
    
    if (findError || device.user_id !== user.id) {
      return NextResponse.json({ error: "Dispositivo não encontrado" }, { status: 404 });
    }
    
    // Remover dispositivo
    const { error } = await supabaseAdmin
      .from("user_sessions")
      .delete()
      .eq("id", id)
      .eq("user_id", user.id);
    
    if (error) throw error;
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("❌ Erro ao remover dispositivo:", error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
