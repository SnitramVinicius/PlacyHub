"use client";

// TEMP-ADMIN-EDICAO-ESPACOS-20260901
// Rota temporária; veja docs/ALTERACAO_TEMPORARIA_EDICAO_ADMIN_ESPACOS.md.

import { EditarEspacoForm } from "@/app/anfitriao/espacos/[id]/editar/page";

export default function EditarEspacoAdminPage() {
  return <EditarEspacoForm caminhoRetorno="/admin/espacos" />;
}
