"use client";

interface Transacao {
  data: string;
  espaco: string;
  tipo: string;
  metodo: string;
  valorBruto: number;
  taxa: number;
  valorLiquido: number;
  status: string;
  dataLiberacao: string;
  comprovante: string;
}

export default function FinanceiroTable({ transacoes }: { transacoes: Transacao[] }) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Confirmado":
        return "text-green-600 font-semibold";
      case "Pendente":
        return "text-yellow-600 font-semibold";
      case "Cancelado":
        return "text-red-600 font-semibold";
      default:
        return "";
    }
  };

  return (
    <div className="overflow-x-auto mt-4">
      <table className="min-w-full bg-white border border-gray-200 rounded-xl shadow">
        <thead className="bg-gray-100 text-gray-700">
          <tr>
            <th className="py-2 px-3 text-left">Data</th>
            <th className="py-2 px-3 text-left">Espaço</th>
            <th className="py-2 px-3 text-left">Tipo</th>
            <th className="py-2 px-3 text-left">Método</th>
            <th className="py-2 px-3 text-right">Valor Bruto (R$)</th>
            <th className="py-2 px-3 text-right">Taxa (R$)</th>
            <th className="py-2 px-3 text-right">Valor Líquido (R$)</th>
            <th className="py-2 px-3 text-center">Status</th>
            <th className="py-2 px-3 text-center">Liberação</th>
            <th className="py-2 px-3 text-center">Comprovante</th>
          </tr>
        </thead>
        <tbody>
          {transacoes.map((t, i) => (
            <tr key={i} className="border-t hover:bg-gray-50">
              <td className="py-2 px-3">{t.data}</td>
              <td className="py-2 px-3">{t.espaco}</td>
              <td className="py-2 px-3">{t.tipo}</td>
              <td className="py-2 px-3">{t.metodo}</td>
              <td className="py-2 px-3 text-right">{t.valorBruto.toFixed(2)}</td>
              <td className="py-2 px-3 text-right">{t.taxa.toFixed(2)}</td>
              <td className="py-2 px-3 text-right">{t.valorLiquido.toFixed(2)}</td>
              <td className={`py-2 px-3 text-center ${getStatusColor(t.status)}`}>{t.status}</td>
              <td className="py-2 px-3 text-center">{t.dataLiberacao}</td>
              <td className="py-2 px-3 text-center">
                {t.comprovante !== "-" ? (
                  <a href={t.comprovante} target="_blank" className="text-sky-600 underline">
                    Ver
                  </a>
                ) : (
                  "-"
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
