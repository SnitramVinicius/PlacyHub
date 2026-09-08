import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function POST(request: Request) {
  try {
    const token = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
    if (!token) return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);
    if (authError || !user) return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
    const { userAgent } = await request.json();
    const usuarioId = user.id;
   
    // Detectar informações do dispositivo
    const deviceInfo = getDeviceInfo(userAgent || "");   
    // Capturar IP real
    const forwarded = request.headers.get("x-forwarded-for");
    let clientIp = forwarded?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "";
    // Buscar localização
    let locationText = "";
    if (clientIp && clientIp !== "::1" && clientIp !== "127.0.0.1" && clientIp !== "localhost") {
      try {
        const locRes = await fetch(`http://ip-api.com/json/${clientIp}?fields=status,city,regionName`, {
          signal: AbortSignal.timeout(5000)
        });
        const locData = await locRes.json();
        if (locData.status === "success") {
          locationText = `${locData.city || ""}${locData.city && locData.regionName ? ", " : ""}${locData.regionName || ""}`;
        }
      } catch (err) {
      }
    }
    
    // 🔥 LOCALHOST: usa localização fixa para teste
    if (clientIp === "::1" || clientIp === "127.0.0.1" || clientIp === "localhost" || !clientIp) {
      locationText = "Campo Grande, MS";
      clientIp = "Desenvolvimento Local";
    }
    
    
    // Registrar sessão
    const { data, error } = await supabaseAdmin
      .from("user_sessions")
      .insert({
        user_id: usuarioId,
        // Nunca armazene o access token do Supabase no banco.
        session_token: crypto.randomUUID(),
        device_name: deviceInfo.deviceName,
        device_type: deviceInfo.deviceType,
        browser: deviceInfo.browser,
        os: deviceInfo.os,
        ip_address: clientIp || "",
        location: locationText || null,
        last_active: new Date().toISOString(),
        is_current: true,
      })
      .select();
    
    if (error) {
      console.error("❌ Erro ao inserir sessão:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    
    if (data && data.length > 0) {
      await supabaseAdmin
        .from("user_sessions")
        .update({ is_current: false })
        .eq("user_id", usuarioId)
        .neq("id", data[0].id);
    }
    
    return NextResponse.json({ success: true });
    
  } catch (error) {
    console.error("❌ Erro:", error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}

function getDeviceInfo(userAgent: string) {
  const ua = userAgent.toLowerCase();
  
  let deviceType = "web";
  let deviceName = "Computador";
  let browser = "Desconhecido";
  let os = "Desconhecido";
  
  if (/(iphone|ipod)/.test(ua)) {
    deviceType = "mobile";
    deviceName = "iPhone";
  } else if (/(ipad)/.test(ua)) {
    deviceType = "tablet";
    deviceName = "iPad";
  } else if (/(android)/.test(ua)) {
    deviceType = "mobile";
    deviceName = "Android";
  }
  
  if (ua.includes("chrome")) browser = "Chrome";
  else if (ua.includes("firefox")) browser = "Firefox";
  else if (ua.includes("safari")) browser = "Safari";
  else if (ua.includes("edge")) browser = "Edge";
  
  if (ua.includes("windows")) os = "Windows";
  else if (ua.includes("mac")) os = "MacOS";
  else if (ua.includes("linux")) os = "Linux";
  else if (ua.includes("android")) os = "Android";
  else if (ua.includes("ios")) os = "iOS";
  
  return { deviceType, deviceName, browser, os };
}
