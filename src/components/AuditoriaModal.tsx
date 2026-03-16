"use client";

import { Image } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";

const LIMITE_FOTOS_POR_ITEM = 5;

/* =======================
   TIPOS
======================= */
export interface ItemChecklist {
  id: string;
  nome: string;
  quantidade: number;

  estadoPre: "ok" | "avaria";
  estadoPos?: "ok" | "avaria";

  observacaoPre?: string;
  observacaoPos?: string;

  fotosPre?: string[];
  fotosPos?: string[];
}

type StatusAuditoria =
  | "rascunho"
  | "encaminhada_analise"
  | "aprovada"
  | "rejeitada";

export interface Auditoria {
  tipo: "pre" | "pos";
  itens: ItemChecklist[];
  observacoesGerais: string;
  status: StatusAuditoria;
  data: string;
}

export interface ReservaAuditoria {
  id: string;
  espacoNome: string;
  dataInicio: string;
  auditoriaPre?: Auditoria;
  auditoriaPos?: Auditoria;
}

/* =======================
   PROPS
======================= */
interface Props {
  tipo: "pre" | "pos";
  reserva: ReservaAuditoria;
  auditoriaPre?: Auditoria;
  hoje: Date;
  onClose: () => void;
  onSalvar: (auditoria: Auditoria) => void;
}

export default function AuditoriaModal({
  tipo,
  reserva,
  auditoriaPre,
  hoje,
  onClose,
  onSalvar,
}: Props) {
  const isPre = tipo === "pre";
  const isPos = tipo === "pos";

  // =======================
// CONTROLE DE DATA DO EVENTO
// =======================
const dataEvento = new Date(reserva.dataInicio);
dataEvento.setHours(0, 0, 0, 0);

const hojeNormalizado = new Date(hoje);
hojeNormalizado.setHours(0, 0, 0, 0);

// 🔒 Bloqueia no dia do evento OU após
const eventoEmAndamentoOuFinalizado =
  hojeNormalizado.getTime() >= dataEvento.getTime();

  /* =======================
     STATES
  ======================= */
 
  const [itensChecklist, setItensChecklist] = useState<ItemChecklist[]>(() => {
    if (isPre) return reserva.auditoriaPre?.itens || [];

    return (
      auditoriaPre?.itens.map((item) => ({
        ...item,
        estadoPos: item.estadoPos || "ok",
        observacaoPos: item.observacaoPos || "",
      })) || []
    );
  });

   const existeAvaria = isPos
  ? itensChecklist.some((item) => item.estadoPos === "avaria")
  : false;

const [obsAuditoria, setObsAuditoria] = useState(
  reserva.auditoriaPre?.observacoesGerais || ""
);

  const [novoItem, setNovoItem] = useState("");
  const [quantidadeItem, setQuantidadeItem] = useState(1);

  const [fotosTemporarias, setFotosTemporarias] = useState<
    Record<string, File[]>
  >({});
  const [fotosTemporariasPos, setFotosTemporariasPos] = useState<
  Record<string, File[]>
>({});

  const [auditoriaAlterada, setAuditoriaAlterada] = useState(false);

const auditoriaExistente =
  isPos && reserva.auditoriaPre?.status;

const somenteLeitura =
  eventoEmAndamentoOuFinalizado ||
  (isPos &&
    reserva.auditoriaPre &&
    ["aprovada", "encaminhada_analise"].includes(
      reserva.auditoriaPre.status
    ));


    
  /* =======================
     SALVAR
  ======================= */
  function registrarAuditoria() {
    if (itensChecklist.length === 0) {
      toast("Adicione pelo menos um item ao checklist.");
      return;
    }

const itensFinal = itensChecklist.map((item) => {
  if (isPre) {
    const fotosAntigas = item.fotosPre || [];
    const fotosNovas =
      fotosTemporarias[item.id]?.map((file) =>
        URL.createObjectURL(file)
      ) || [];

    return {
      ...item,
      fotosPre: [...fotosAntigas, ...fotosNovas],
    };
  }

  // 👇 PÓS EVENTO
  const fotosAntigas = item.fotosPos || [];
  const fotosNovas =
    fotosTemporariasPos[item.id]?.map((file) =>
      URL.createObjectURL(file)
    ) || [];

  return {
    ...item,
    fotosPos: [...fotosAntigas, ...fotosNovas],
  };
});

if (isPos) {
  for (const item of itensChecklist) {
    if (
      item.estadoPos === "avaria" &&
      (!fotosTemporariasPos[item.id]?.length &&
        !item.fotosPos?.length)
    ) {
     toast.error(
  `Adicione pelo menos uma foto da avaria no item: ${item.nome}`
);
      return;
    }
  }
}
    const existeAvaria = isPos
  ? itensChecklist.some((item) => item.estadoPos === "avaria")
  : false;

const statusAuditoria: StatusAuditoria = isPos
  ? existeAvaria
    ? "encaminhada_analise"
    : "aprovada"
  : "aprovada";

onSalvar({
  tipo,
  itens: itensFinal,
  observacoesGerais: obsAuditoria,
  status: statusAuditoria,
  data: new Date().toISOString(),
});

if (isPos && existeAvaria) {
  alert(
    "A vistoria foi encaminhada para análise. Nossa equipe irá avaliar as evidências e entraremos em contato dentro de 72hs"
  );
}

onClose();
  }

const placeholderObservacoes = isPre
  ? "Ex: Espaço entregue conforme checklist, limpo e em boas condições para uso."
  : existeAvaria
  ? "Ex: Foram identificadas avarias nos itens acima. As evidências foram registradas em fotos."
  : "Ex: Espaço devolvido conforme checklist, sem avarias aparentes.";


  /* =======================
     RENDER
  ======================= */
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-md max-h-[90vh] rounded-2xl bg-white dark:bg-gray-800 shadow-xl flex flex-col border border-gray-200 dark:border-gray-700">
        {/* HEADER */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            {isPre ? "Vistoria Pré-Locação" : "Vistoria Pós-Evento"} –{" "}
            {reserva.espacoNome}
          </h3>
          <p className="text-xs text-zinc-500 dark:text-gray-400 mt-1">
            {isPre
              ? "Essas informações servirão como base para conferência após o evento."
              : "Confirme o estado dos itens após o evento."}
          </p>
        </div>

        {somenteLeitura &&
  reserva.auditoriaPre?.status === "encaminhada_analise" && (
    <div className="mx-6 mt-4 rounded-lg border bg-amber-50 dark:bg-amber-900/30 border-amber-300 dark:border-amber-700 p-3 text-sm text-amber-800">
      Esta vistoria foi encaminhada para análise. Nossa equipe está avaliando as
      evidências registradas.
    </div>
)}

{eventoEmAndamentoOuFinalizado && (
  <div className="mx-6 mt-4 rounded-lg border border-yellow-300 bg-yellow-50 p-3 text-sm text-yellow-800">
    ⚠️ O evento está em andamento ou já foi finalizado.  
    Esta vistoria está disponível apenas para visualização.
  </div>
)}

        {/* BODY */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {/* ADICIONAR ITEM (SOMENTE PRÉ) */}
          {isPre && (
            <div className="flex gap-2">
              <input
                value={novoItem}
                onChange={(e) => setNovoItem(e.target.value)}
                placeholder="Ex: Cadeiras"
                disabled={somenteLeitura}
                className="flex-1 border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              />

              <input
                type="number"
                min={1}
                value={quantidadeItem}
                onChange={(e) => setQuantidadeItem(Number(e.target.value))}
                disabled={somenteLeitura}
                className="w-20 border border-gray-200 dark:border-gray-600 rounded-lg px-2 py-2 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              />

              <button
                disabled={somenteLeitura}
                onClick={() => {
                  if (!novoItem.trim()) return;

                  setItensChecklist((prev) => [
                    ...prev,
                    {
                      id: crypto.randomUUID(),
                      nome: novoItem,
                      quantidade: quantidadeItem,
                      estadoPre: "ok",
                      observacaoPre: "",
                      fotosPre: [],
                    },
                  ]);

                  setNovoItem("");
                  setQuantidadeItem(1);
                  setAuditoriaAlterada(true);
                }}
                className="px-3 rounded-lg bg-zinc-100 dark:bg-gray-700 text-gray-800 dark:text-gray-100"
              >
                +
              </button>
            </div>
          )}

          {/* CHECKLIST */}
          {itensChecklist.map((item) => (
            <div
              key={item.id}
              className="border border-gray-200 dark:border-gray-700 rounded-xl p-3 bg-zinc-50 dark:bg-gray-700/40 space-y-3"
            >
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                {item.quantidade} {item.nome}
              </p>

              {/* PÓS EVENTO */}
              {isPos && (
                <>
                  <select
                  disabled={somenteLeitura}
                    value={item.estadoPos || "ok"}
                   onChange={(e) => {
  const novoEstado = e.target.value as "ok" | "avaria";

  setItensChecklist((prev) => {
    const atualizados = prev.map((i) =>
      i.id === item.id ? { ...i, estadoPos: novoEstado } : i
    );

    const temAvaria = atualizados.some(
      (i) => i.estadoPos === "avaria"
    );

    return atualizados;
  });

  setAuditoriaAlterada(true);
}}

                    className="border border-gray-200 dark:border-gray-600 rounded-lg px-2 py-1 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  >
                    <option value="ok">Sem avarias</option>
                    <option value="avaria">Com avaria</option>
                  </select>

                 {item.estadoPos === "avaria" && (
  <div className="space-y-2">
    <textarea
    disabled={somenteLeitura}
      placeholder="Descreva a avaria encontrada"
      value={item.observacaoPos || ""}
      onChange={(e) => {
        setItensChecklist((prev) =>
          prev.map((i) =>
            i.id === item.id
              ? { ...i, observacaoPos: e.target.value }
              : i
          )
        );
        setAuditoriaAlterada(true);
      }}
     className="w-full border border-gray-200 dark:border-gray-600 rounded-lg p-2 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
    />

    {/* UPLOAD DE FOTOS DA AVARIA */}
    {!somenteLeitura && (
    <label>
      <input
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => {
          const arquivos = Array.from(e.target.files || []).slice(
            0,
            LIMITE_FOTOS_POR_ITEM
          );

          setFotosTemporariasPos((prev) => ({
            ...prev,
            [item.id]: arquivos,
          }));

          setAuditoriaAlterada(true);
        }}
      />
      <span className="inline-flex items-center gap-2 text-xs px-3 py-1 border rounded-lg cursor-pointer">
        <Image size={14} />
        Adicionar fotos da avaria
      </span>
    </label>
    )}

    {/* PREVIEW DAS FOTOS */}
<div className="flex gap-2 flex-wrap">
  {/* Fotos já salvas */}
  {(item.fotosPos || []).map((foto, idx) => (
    <img
      key={`saved-${idx}`}
      src={foto}
      className="w-16 h-16 object-cover rounded-lg border border-gray-200 dark:border-gray-600"
    />
  ))}

  {/* Fotos temporárias (preview imediato) */}
  {(fotosTemporariasPos[item.id] || []).map((file, idx) => (
    <img
      key={`temp-${idx}`}
      src={URL.createObjectURL(file)}
      className="w-16 h-16 object-cover rounded-lg border border-gray-200 dark:border-gray-600"
    />
  ))}
</div>
  </div>
)}
                </>
              )}

              {/* PRÉ EVENTO */}
              {isPre && (
                <>
                  <label>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={(e) => {
                        const arquivos = Array.from(e.target.files || []);
                        setFotosTemporarias((prev) => ({
                          ...prev,
                          [item.id]: arquivos,
                        }));
                        setAuditoriaAlterada(true);
                      }}
                    />
                    <span className="inline-flex items-center gap-2 text-xs px-3 py-1 border rounded-lg cursor-pointer">
                      <Image size={14} /> Adicionar fotos
                    </span>
                  </label>

                  <div className="flex gap-2 mt-2 flex-wrap">
  {/* Fotos já salvas */}
  {(item.fotosPre || []).map((foto, idx) => (
    <img
      key={`saved-${idx}`}
      src={foto}
      className="w-16 h-16 object-cover rounded-lg border border-gray-200 dark:border-gray-600"
    />
  ))}

  {/* Fotos temporárias (preview imediato) */}
  {(fotosTemporarias[item.id] || []).map((file, idx) => (
    <img
      key={`temp-${idx}`}
      src={URL.createObjectURL(file)}
      className="w-16 h-16 object-cover rounded-lg border border-gray-200 dark:border-gray-600"
    />
  ))}
</div>

                  {!somenteLeitura && (
                    <button
                      onClick={() => {
                        setItensChecklist((prev) =>
                          prev.filter((i) => i.id !== item.id)
                        );
                        setAuditoriaAlterada(true);
                      }}
                      className="text-xs text-red-500"
                    >
                      Remover item
                    </button>
                  )}
                </>
              )}
            </div>
          ))}

          {/* OBSERVAÇÕES */}
          <textarea
          disabled={somenteLeitura}
            rows={3}
            placeholder={placeholderObservacoes}
            value={obsAuditoria}
            onChange={(e) => {
              setObsAuditoria(e.target.value);
              setAuditoriaAlterada(true);
            }}
            className="w-full border border-gray-200 dark:border-gray-600 rounded-lg p-3 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          />
        </div>

        {/* FOOTER */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 space-y-2">
        {!somenteLeitura && (
  <button
    onClick={registrarAuditoria}
    className="w-full bg-sky-500 text-white py-3 rounded-xl font-semibold"
  >
    {isPre
      ? "Salvar pré-vistoria"
      : existeAvaria
      ? "Encaminhar para análise"
      : "Encerrar auditoria"}
  </button>
)}
          <button
            onClick={onClose}
            className="w-full text-sm text-zinc-500 dark:text-gray-400"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}
