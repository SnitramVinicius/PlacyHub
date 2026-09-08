import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

// TEMP-ADMIN-EDICAO-ESPACOS-20260901

async function autenticarAdmin(request: Request) {
  const token = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  if (!token) return null;
  const { data, error } = await supabaseAdmin.auth.getUser(token);
  if (error || !data.user) return null;
  const { data: perfil } = await supabaseAdmin.from("users").select("is_admin, roles").eq("id", data.user.id).single();
  const roles = Array.isArray(perfil?.roles) ? perfil.roles : [];
  return perfil?.is_admin || roles.includes("ADMIN") ? data.user : null;
}

export async function GET(request: Request) {
  try {
    if (!(await autenticarAdmin(request))) return NextResponse.json({ message: "Acesso restrito a administradores." }, { status: 403 });
    const { data: espacos, error } = await supabaseAdmin.from("spaces").select("id, nome_espaco, cidade, estado, bairro, descricao, user_id").order("nome_espaco");
    if (error) throw error;
    const ids = [...new Set((espacos || []).map((e) => e.user_id).filter(Boolean))];
    const consulta = ids.length ? await supabaseAdmin.from("users").select("id, name, email").in("id", ids) : { data: [], error: null };
    if (consulta.error) throw consulta.error;
    const porId = new Map((consulta.data || []).map((u) => [u.id, u]));
    return NextResponse.json({ espacos: (espacos || []).map((e) => ({ ...e, anfitriao_nome: porId.get(e.user_id)?.name || null, anfitriao_email: porId.get(e.user_id)?.email || null })) });
  } catch (error) {
    console.error("Erro ao carregar espaços do admin:", error);
    return NextResponse.json({ message: "Não foi possível carregar os espaços." }, { status: 500 });
  }
}
