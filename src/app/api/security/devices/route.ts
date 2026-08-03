import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(request: Request) {
  try {
    // Pegar o userId da URL (query string)
    const url = new URL(request.url);
    const userId = url.searchParams.get("userId");   
    if (!userId) {
      return NextResponse.json({ error: "User ID não fornecido" }, { status: 400 });
    }
    
    // Buscar dispositivos do usuário
    const { data: devices, error } = await supabase
      .from("user_sessions")
      .select("*")
      .eq("user_id", userId)
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
    const { id, userId } = await request.json();    
    if (!userId) {
      return NextResponse.json({ error: "User ID não fornecido" }, { status: 400 });
    }
    
    // Verificar se o dispositivo pertence ao usuário
    const { data: device, error: findError } = await supabase
      .from("user_sessions")
      .select("user_id")
      .eq("id", id)
      .single();
    
    if (findError || device.user_id !== userId) {
      return NextResponse.json({ error: "Dispositivo não encontrado" }, { status: 404 });
    }
    
    // Remover dispositivo
    const { error } = await supabase
      .from("user_sessions")
      .delete()
      .eq("id", id);
    
    if (error) throw error;
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("❌ Erro ao remover dispositivo:", error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}