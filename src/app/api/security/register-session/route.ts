import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function POST(request: Request) {
  try {
    const { sessionToken, userAgent, ipAddress, userId } = await request.json();
    
    console.log("📝 Registrando sessão...");
    
    let usuarioId = userId;
    
    if (!usuarioId && sessionToken && !sessionToken.startsWith("manual_")) {
      const { data: { user }, error } = await supabaseAdmin.auth.getUser(sessionToken);
      if (!error && user) {
        usuarioId = user.id;
      }
    }
    
    if (!usuarioId) {
      console.error("❌ User ID não fornecido");
      return NextResponse.json({ error: "User ID não fornecido" }, { status: 400 });
    }
    
    console.log("✅ Usuário ID:", usuarioId);
    
    // Detectar informações do dispositivo
    const deviceInfo = getDeviceInfo(userAgent || "");
    console.log("📱 Dispositivo:", deviceInfo);
    
    // Capturar IP real
    let clientIp = ipAddress || "";
    if (!clientIp) {
      const forwarded = request.headers.get("x-forwarded-for");
      if (forwarded) clientIp = forwarded.split(",")[0];
      if (!clientIp) {
        const realIp = request.headers.get("x-real-ip");
        if (realIp) clientIp = realIp || "";
      }
    }
    
    console.log("🌐 IP detectado:", clientIp || "não capturado");
    
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
        console.log("⚠️ Erro ao buscar localização:", err);
      }
    }
    
    // 🔥 LOCALHOST: usa localização fixa para teste
    if (clientIp === "::1" || clientIp === "127.0.0.1" || clientIp === "localhost" || !clientIp) {
      locationText = "Campo Grande, MS";
      clientIp = "Desenvolvimento Local";
      console.log("📍 Ambiente local - usando localização de teste: Campo Grande, MS");
    }
    
    console.log("📍 Localização final:", locationText);
    
    // Registrar sessão
    const { data, error } = await supabaseAdmin
      .from("user_sessions")
      .insert({
        user_id: usuarioId,
        session_token: sessionToken || `manual_${Date.now()}`,
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
    
    console.log("✅ Sessão registrada!");
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