// src/lib/notificacoes.ts
import { supabase } from "./supabase";

/**
 * Verifica se o usuário optou por receber notificações por email
 * @param usuarioId - ID do usuário
 * @param tipo - Tipo da notificação ('reservas', 'pagamentos', 'promocoes')
 * @returns true se pode enviar, false se não
 */
export async function podeEnviarEmail(usuarioId: string, tipo: string): Promise<boolean> {
  if (!usuarioId) return false;

  try {
    const { data, error } = await supabase
      .from("user_notificacoes_settings")
      .select("email")
      .eq("user_id", usuarioId)
      .eq("tipo", tipo)
      .single();

    // Se não tiver configuração, retorna true (envia por padrão)
    if (error && error.code === "PGRST116") {
      return true;
    }

    if (error) {
      console.error("Erro ao verificar preferência:", error);
      return true; // Em caso de erro, envia por padrão
    }

    return data?.email !== false;
  } catch (error) {
    console.error("Erro ao verificar preferência:", error);
    return true;
  }
}

/**
 * Busca o email do usuário
 */
export async function getEmailUsuario(usuarioId: string): Promise<string | null> {
  try {
    const { data, error } = await supabase
      .from("users")
      .select("email, name")
      .eq("id", usuarioId)
      .single();

    if (error) {
      console.error("Erro ao buscar email do usuário:", error);
      return null;
    }

    return data?.email || null;
  } catch (error) {
    console.error("Erro ao buscar email do usuário:", error);
    return null;
  }
}