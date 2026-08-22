import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

const STATUS_VALIDOS = ["pendente", "em_atendimento", "resolvido", "fechado"] as const;

async function autenticarAdmin(request: Request) {
  const authHeader = request.headers.get("authorization");
  const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;
  if (!token) return null;

  const { data, error } = await supabaseAdmin.auth.getUser(token);
  if (error || !data.user) return null;

  const { data: profile } = await supabaseAdmin
    .from("users")
    .select("is_admin, roles")
    .eq("id", data.user.id)
    .maybeSingle();
  const roles = Array.isArray(profile?.roles) ? profile.roles : [];
  return profile?.is_admin || roles.includes("ADMIN") ? data.user : null;
}

export async function GET(request: Request) {
  try {
    if (!(await autenticarAdmin(request))) {
      return NextResponse.json({ message: "Acesso restrito a administradores." }, { status: 403 });
    }

    let { data: reportes, error } = await supabaseAdmin
      .from("reportes")
      .select("id, reserva_id, user_id, tipo, descricao, status, resposta_admin, respondido_em, created_at, updated_at")
      .order("created_at", { ascending: false });

    // Mantém a central utilizável enquanto a migração das respostas ainda não
    // foi aplicada no projeto remoto do Supabase.
    if (error?.code === "42703" || error?.code === "PGRST204") {
      const consultaLegada = await supabaseAdmin
        .from("reportes")
        .select("id, reserva_id, user_id, tipo, descricao, status, created_at, updated_at")
        .order("created_at", { ascending: false });
      error = consultaLegada.error;
      reportes = (consultaLegada.data ?? []).map((item) => ({
        ...item,
        resposta_admin: null,
        respondido_em: null,
      }));
    }
    if (error) throw error;

    const chamadosBase = (reportes ?? []).filter(
      (item) => item.tipo !== "Proposta de reagendamento"
    );
    const userIds = [...new Set(chamadosBase.map((item) => item.user_id).filter(Boolean))];
    const reservaIds = [...new Set(chamadosBase.map((item) => item.reserva_id).filter(Boolean))];

    const usuariosResult = userIds.length
      ? await supabaseAdmin.from("users").select("id, name, email, telefone, roles").in("id", userIds)
      : { data: [], error: null };
    const reservasResult = reservaIds.length
      ? await supabaseAdmin.from("reservas").select("id, data_inicio, status, pagamento_status").in("id", reservaIds)
      : { data: [], error: null };
    if (usuariosResult.error) throw usuariosResult.error;
    if (reservasResult.error) throw reservasResult.error;

    const usuarios = new Map((usuariosResult.data ?? []).map((item) => [item.id, item]));
    const reservas = new Map((reservasResult.data ?? []).map((item) => [item.id, item]));
    const chamados = chamadosBase.map((item) => ({
      ...item,
      usuario: usuarios.get(item.user_id) ?? null,
      reserva: reservas.get(item.reserva_id) ?? null,
    }));

    return NextResponse.json({ chamados });
  } catch (error) {
    console.error("Erro ao carregar chamados:", error);
    return NextResponse.json({ message: "Não foi possível carregar os chamados." }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const admin = await autenticarAdmin(request);
    if (!admin) {
      return NextResponse.json({ message: "Acesso restrito a administradores." }, { status: 403 });
    }

    const body = await request.json();
    const id = typeof body.id === "string" ? body.id : "";
    const status = typeof body.status === "string" ? body.status : "";
    const resposta = typeof body.resposta === "string" ? body.resposta.trim() : "";
    if (!id || !STATUS_VALIDOS.includes(status as (typeof STATUS_VALIDOS)[number])) {
      return NextResponse.json({ message: "Chamado ou status inválido." }, { status: 400 });
    }

    if (["resolvido", "fechado"].includes(status) && resposta.length < 3) {
      return NextResponse.json(
        { message: "Escreva a resposta que será enviada ao usuário." },
        { status: 400 }
      );
    }

    const atualizacao: Record<string, string | null> = {
      status,
      updated_at: new Date().toISOString(),
    };
    if (resposta) {
      atualizacao.resposta_admin = resposta;
      atualizacao.respondido_em = new Date().toISOString();
      atualizacao.respondido_por = admin.id;
    }

    const { data, error } = await supabaseAdmin
      .from("reportes")
      .update(atualizacao)
      .eq("id", id)
      .select("id, status, resposta_admin, respondido_em, updated_at")
      .single();
    if (error?.code === "42703" || error?.code === "PGRST204") {
      return NextResponse.json(
        { message: "Aplique a migração de chamados no Supabase antes de responder ou resolver." },
        { status: 409 }
      );
    }
    if (error) throw error;

    return NextResponse.json({ chamado: data });
  } catch (error) {
    console.error("Erro ao atualizar chamado:", error);
    return NextResponse.json({ message: "Não foi possível atualizar o chamado." }, { status: 500 });
  }
}
