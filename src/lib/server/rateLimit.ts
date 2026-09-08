import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function limitePermitido(chave: string, janelaSegundos: number, maximo: number) {
  const { data, error } = await supabaseAdmin.rpc("verificar_limite_api", {
    p_chave: chave,
    p_janela_segundos: janelaSegundos,
    p_maximo: maximo,
  });
  if (error) {
    // Falha fechada em rotas financeiras: sem controle de abuso, não prosseguir.
    console.error("Falha no controle de requisições:", error.message);
    return false;
  }
  return data === true;
}
