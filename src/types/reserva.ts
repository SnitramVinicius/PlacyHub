// src/types/reserva.ts

import type { Auditoria } from "@/components/AuditoriaModal";

export type Reserva = {
  id: number;
  espaco: string;
  data: string;
  horario: string;
  cliente: string;
  local: string;
  valor: number;
  status: string;
  imagem: string;
  telefone: string;
  avaliada: boolean;
  isBuffet?: boolean;
  auditoriaPre?: Auditoria;
  auditoriaPos?: Auditoria;
  dataInicio?: string;
  dataFim?: string;
};