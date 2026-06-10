// src/utils/reservas.ts

export function formatarHorario(dataInicio: string, dataFim: string, isBuffet: boolean = false) {
  // Se não é buffet, retorna vazio (não mostrar horário)
  if (!isBuffet) {
    return "";
  }
  
  const inicio = new Date(dataInicio);
  const fim = new Date(dataFim);
  
  const horaInicio = inicio.toLocaleTimeString("pt-BR", { hour: '2-digit', minute: '2-digit' });
  const horaFim = fim.toLocaleTimeString("pt-BR", { hour: '2-digit', minute: '2-digit' });
  
  return `${horaInicio} às ${horaFim}`;
}

export function formatarTelefone(telefone: string) {
  const numeros = telefone.replace(/\D/g, '');
  if (numeros.length === 11) {
    return numeros.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  }
  if (numeros.length === 10) {
    return numeros.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
  }
  return telefone;
}

export function filtrarPorPeriodo(reservas: any[], periodo: string) {
  const hoje = new Date();
  const dataLimite = new Date();
  
  switch(periodo) {
    case "Últimos 30 dias":
      dataLimite.setDate(hoje.getDate() - 30);
      break;
    case "Últimos 3 meses":
      dataLimite.setMonth(hoje.getMonth() - 3);
      break;
    case "Últimos 6 meses":
      dataLimite.setMonth(hoje.getMonth() - 6);
      break;
    default:
      return reservas;
  }
  
  return reservas.filter(reserva => {
    if (!reserva.data) return false;
    const partes = reserva.data.split('/');
    const dataReserva = new Date(partes[2], partes[1] - 1, partes[0]);
    return dataReserva >= dataLimite;
  });
}