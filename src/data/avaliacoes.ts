export interface Avaliacao {
  id: string;         // ID único da avaliação
  reservaId: string;  // qual reserva gerou essa avaliação
  espacoId: number;   // id do espaço
  cliente: string;    // nome do cliente
  nota: number;       // de 1 a 5
  comentario: string; // texto do comentário
  data: string;       // data da avaliação
}

// Avaliações de exemplo
export const AVALIACOES: Avaliacao[] = [
  {
    id: "1",
    reservaId: "res-1",
    espacoId: 1,
    cliente: "Ana Pereira",
    nota: 5,
    comentario: "Espaço incrível, tudo perfeito!",
    data: "2026-01-10",
  },
  {
    id: "2",
    reservaId: "res-2",
    espacoId: 2,
    cliente: "Carlos Silva",
    nota: 4,
    comentario: "Gostei bastante, só o estacionamento é pequeno.",
    data: "2026-01-12",
  },
];
