import { NextResponse } from "next/server";
import type { User } from "@supabase/supabase-js";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

const MAX_USERS_PER_PAGE = 1000;

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get("authorization");
    const token = authHeader?.startsWith("Bearer ")
      ? authHeader.slice("Bearer ".length)
      : null;

    if (!token) {
      return NextResponse.json({ message: "Usuário não autenticado." }, { status: 401 });
    }

    const {
      data: { user },
      error: authError,
    } = await supabaseAdmin.auth.getUser(token);

    if (authError || !user) {
      return NextResponse.json({ message: "Usuário não autenticado." }, { status: 401 });
    }

    const { data: adminProfile, error: adminError } = await supabaseAdmin
      .from("users")
      .select("is_admin, roles")
      .eq("id", user.id)
      .maybeSingle();

    if (adminError) throw adminError;

    const roles = Array.isArray(adminProfile?.roles) ? adminProfile.roles : [];
    if (!adminProfile?.is_admin && !roles.includes("ADMIN")) {
      return NextResponse.json({ message: "Acesso restrito a administradores." }, { status: 403 });
    }

    // O Auth é a fonte de verdade dos cadastros. Assim, contas que ainda não
    // ganharam um perfil em public.users também aparecem no painel.
    const authUsers: User[] = [];
    for (let page = 1; ; page++) {
      const { data, error } = await supabaseAdmin.auth.admin.listUsers({
        page,
        perPage: MAX_USERS_PER_PAGE,
      });
      if (error) throw error;
      authUsers.push(...data.users);
      if (data.users.length < MAX_USERS_PER_PAGE) break;
    }

    const { data: profiles, error: profilesError } = await supabaseAdmin
      .from("users")
      .select("id, name, email, telefone, cpf, cidade, estado, created_at, foto_url, roles");
    if (profilesError) throw profilesError;

    const profileById = new Map((profiles ?? []).map((profile) => [profile.id, profile]));
    const profileIds = (profiles ?? []).map((profile) => profile.id);

    const [recebimentosResult, espacosResult, reservasResult] = await Promise.all([
      supabaseAdmin.from("dados_recebimento").select("*").in("user_id", profileIds),
      supabaseAdmin.from("spaces").select("user_id").in("user_id", profileIds),
      supabaseAdmin.from("reservas").select("user_id").in("user_id", profileIds),
    ]);

    if (recebimentosResult.error) throw recebimentosResult.error;
    if (espacosResult.error) throw espacosResult.error;
    if (reservasResult.error) throw reservasResult.error;

    const recebimentoByUser = new Map(
      (recebimentosResult.data ?? []).map((item) => [item.user_id, item])
    );
    const contarPorUsuario = (items: { user_id: string }[]) => {
      const counts = new Map<string, number>();
      for (const item of items) counts.set(item.user_id, (counts.get(item.user_id) ?? 0) + 1);
      return counts;
    };
    const espacosByUser = contarPorUsuario(espacosResult.data ?? []);
    const reservasByUser = contarPorUsuario(reservasResult.data ?? []);

    const usuarios = authUsers
      .map((authUser) => {
        const profile = profileById.get(authUser.id);
        const metadata = authUser.user_metadata ?? {};
        return {
          id: authUser.id,
          name: profile?.name || metadata.name || authUser.email?.split("@")[0] || "Usuário",
          email: profile?.email || authUser.email || "",
          telefone: profile?.telefone || metadata.telefone || null,
          cpf: profile?.cpf || null,
          cidade: profile?.cidade || metadata.cidade || null,
          estado: profile?.estado || metadata.estado || null,
          created_at: profile?.created_at || authUser.created_at,
          foto_url: profile?.foto_url || null,
          roles: profile?.roles ?? ["LOCATARIO"],
          dadosRecebimento: recebimentoByUser.get(authUser.id) ?? null,
          quantidadeEspacos: espacosByUser.get(authUser.id) ?? 0,
          quantidadeReservas: reservasByUser.get(authUser.id) ?? 0,
        };
      })
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    return NextResponse.json({ usuarios });
  } catch (error) {
    console.error("Erro ao carregar usuários do admin:", error);
    return NextResponse.json({ message: "Não foi possível carregar os usuários." }, { status: 500 });
  }
}
