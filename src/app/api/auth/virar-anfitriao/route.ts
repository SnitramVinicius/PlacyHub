import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { limitePermitido } from "@/lib/server/rateLimit";

export async function POST(req: Request) {
  const token = req.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  if (!token) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  }

  const { data: authData, error: authError } = await supabaseAdmin.auth.getUser(token);
  if (authError || !authData.user) {
    return NextResponse.json({ error: "Token inválido" }, { status: 401 });
  }
  if (!(await limitePermitido(`virar-anfitriao:${authData.user.id}`, 3600, 5))) {
    return NextResponse.json({ error: "Muitas tentativas. Tente novamente mais tarde." }, { status: 429 });
  }

  const body = await req.json();
  const cpf = String(body?.cpf ?? "").replace(/\D/g, "");

  if (!/^\d{11}$/.test(cpf) || /^(\d)\1{10}$/.test(cpf)) {
    return NextResponse.json({ error: "CPF inválido" }, { status: 422 });
  }

  const { data: perfil, error: perfilError } = await supabaseAdmin
    .from("users")
    .select("roles")
    .eq("id", authData.user.id)
    .single();

  if (perfilError || !perfil) {
    return NextResponse.json({ error: "Perfil não encontrado" }, { status: 404 });
  }

  const rolesAtuais = Array.isArray(perfil.roles) ? perfil.roles : ["LOCATARIO"];
  const roles = Array.from(new Set([...rolesAtuais, "LOCATARIO", "ANFITRIAO"]));
  const { error: updateError } = await supabaseAdmin
    .from("users")
    .update({ cpf, roles, is_anfitriao: true })
    .eq("id", authData.user.id);

  if (updateError) {
    console.error("Erro ao promover anfitrião:", updateError);
    return NextResponse.json({ error: "Não foi possível atualizar o perfil" }, { status: 500 });
  }

  return NextResponse.json({ success: true, user: { id: authData.user.id, cpf, roles } });
}
