export type StatusReserva =
  | "pendente"
  | "confirmada"
  | "bloqueada"
  | "cancelada"
  | "finalizada";

export interface Reserva {
  id: string;
  espacoId: string;
  espacoNome: string;
  dataInicio: string; // yyyy-mm-dd
  dataFim: string;
  status: StatusReserva;
}

export interface Espaco {
  id: string;
  nome: string;
  cor: string; // cor fixa por espaço
}
