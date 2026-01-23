export interface ItemChecklist {
  id: string;
  nome: string;
  quantidade: number;

  // ===== PRÉ-EVENTO =====
  estadoPre: "ok" | "avaria";
  observacaoPre?: string;
  fotosPre?: string[];

  // ===== PÓS-EVENTO =====
  estadoPos?: "ok" | "avaria";
  observacaoPos?: string;
  fotosPos?: string[];
}

export interface Auditoria {
  tipo: "pre" | "pos";
  itens: ItemChecklist[];
  observacoesGerais: string;
   fotos?: string[];
  data: string;
  finalizada: boolean;
}