"use client";

import { Image } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";

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
  auditoriaPos?: Auditoria;
  hoje: Date;
  onClose: () => void;
  onSalvar: (auditoria: Auditoria) => void;
}

// Função auxiliar para fazer upload de fotos e retornar URLs públicas
async function uploadFotos(
  fotosTemporarias: Record<string, File[]>,
  reservaId: string,
  tipo: "pre" | "pos"
): Promise<Record<string, string[]>> {
  const result: Record<string, string[]> = {};

  for (const [itemId, arquivos] of Object.entries(fotosTemporarias)) {
    if (!arquivos.length) continue;

    const uploadedUrls: string[] = [];
    for (const file of arquivos) {
      const fileName = `vistoria_${reservaId}_${tipo}_${itemId}_${Date.now()}_${Math.random()
        .toString(36)
        .substring(2, 8)}.jpg`;

      const { error: uploadError } = await supabase.storage
        .from("vistorias")
        .upload(fileName, file, { cacheControl: "3600", upsert: true });

      if (uploadError) {
        console.error("Erro no upload:", uploadError);
        throw new Error(`Falha ao enviar foto: ${uploadError.message}`);
      }

      const { data: publicUrlData } = supabase.storage
        .from("vistorias")
        .getPublicUrl(fileName);

      uploadedUrls.push(publicUrlData.publicUrl);
    }
    result[itemId] = uploadedUrls;
  }
  return result;
}

export default function AuditoriaModal({
  tipo,
  reserva,
  auditoriaPre,
  auditoriaPos,
  hoje,
  onClose,
  onSalvar,
}: Props) {
  const isPre = tipo === "pre";
  const isPos = tipo === "pos";

  // =======================
// CONTROLE DE DATA DO EVENTO
// =======================
const dataEvento = new Date(reserva.dataInicio + "T12:00:00");
const hojeNormalizado = new Date();
hojeNormalizado.setHours(0, 0, 0, 0);
dataEvento.setHours(0, 0, 0, 0);

// Evento já passou? (data do evento < hoje)
const eventoFinalizado = dataEvento.getTime() < hojeNormalizado.getTime();

// Evento é hoje?
const eventoHoje = dataEvento.getTime() === hojeNormalizado.getTime();
  /* =======================
     STATES
  ======================= */
 
const [itensChecklist, setItensChecklist] = useState<ItemChecklist[]>(() => {
  // PRÉ-VISTORIA: usa os itens da própria reserva
  if (isPre) return reserva.auditoriaPre?.itens || [];

  // PÓS-VISTORIA: usa os itens da PRÉ-vistoria como base
  const preItens = reserva.auditoriaPre?.itens || [];
  const posItens = reserva.auditoriaPos?.itens || [];
  
  console.log("📋 Itens da pré-vistoria:", preItens);
  console.log("📋 Itens da pós-vistoria existentes:", posItens);
  
  return preItens.map((item) => {
    // Procura se já existe uma pós-vistoria para este item
    const itemExistente = posItens.find(i => i.id === item.id);
    
    return {
      ...item,
      estadoPos: itemExistente?.estadoPos ?? "ok",
      observacaoPos: itemExistente?.observacaoPos || "",
      fotosPos: itemExistente?.fotosPos || [],  // ← CARREGA AS FOTOS EXISTENTES
    };
  });
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
  (isPre && eventoFinalizado) ||  // Pré: bloqueia se evento já passou
  (isPos && 
   reserva.auditoriaPos && 
   reserva.auditoriaPos.status === "aprovada");

    
  /* =======================
     SALVAR
  ======================= */
    async function registrarAuditoria() {
    if (itensChecklist.length === 0) {
      toast("Adicione pelo menos um item ao checklist.");
      return;
    }

    // Validação das avarias com fotos (já existente)
    if (isPos) {
      for (const item of itensChecklist) {
        if (
          item.estadoPos === "avaria" &&
          (!fotosTemporariasPos[item.id]?.length && !item.fotosPos?.length)
        ) {
          toast.error(`Adicione pelo menos uma foto da avaria no item: ${item.nome}`);
          return;
        }
      }
    }

    try {
      // 1. Fazer upload das fotos temporárias (pré ou pós)
      let fotosUploaded: Record<string, string[]> = {};
      if (isPre && Object.keys(fotosTemporarias).length) {
        fotosUploaded = await uploadFotos(fotosTemporarias, reserva.id, "pre");
      }
      if (isPos && Object.keys(fotosTemporariasPos).length) {
        fotosUploaded = await uploadFotos(fotosTemporariasPos, reserva.id, "pos");
      }

      // 2. Montar os itens finais, substituindo URLs blob pelas URLs reais
      const itensFinal = itensChecklist.map((item) => {
        if (isPre) {
          const fotosAntigas = item.fotosPre || [];
          const fotosNovas = fotosUploaded[item.id] || [];
          return {
            ...item,
            fotosPre: [...fotosAntigas, ...fotosNovas],
          };
        } else {
          const fotosAntigas = item.fotosPos || [];
          const fotosNovas = fotosUploaded[item.id] || [];
          return {
            ...item,
            fotosPos: [...fotosAntigas, ...fotosNovas],
          };
        }
      });

      const existeAvaria = isPos
        ? itensChecklist.some((item) => item.estadoPos === "avaria")
        : false;

      const statusAuditoria: StatusAuditoria = isPos
        ? existeAvaria
          ? "encaminhada_analise"
          : "aprovada"
        : "aprovada";

      // 3. Chamar o callback com os dados finais
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
    } catch (error) {
      console.error("Erro no upload ou salvamento:", error);
      toast.error("Erro ao processar as fotos. Tente novamente.");
    }
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

{isPre && eventoFinalizado && (
  <div className="mx-6 mt-4 rounded-lg border border-yellow-300 bg-yellow-50 p-3 text-sm text-yellow-800">
    ⚠️ O evento já foi finalizado. A pré-vistoria está disponível apenas para visualização.
  </div>
)}

{eventoHoje && (
  <div className="mx-6 mt-4 rounded-lg border border-blue-300 bg-blue-50 p-3 text-sm text-blue-800">
    ℹ️ O evento está acontecendo hoje. A vistoria pode ser realizada normalmente.
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

{/* PÓS EVENTO - MESMO ESTILO DA PRÉ-VISTORIA */}
{isPos && (
  <>
    {/* Mostra o estado da PRÉ-vistoria como referência */}
    <div className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 p-2 rounded-lg">
       <strong>Pré-vistoria:</strong> {item.estadoPre === "ok" ? "✓ OK" : "⚠️ Avaria"}
      {item.estadoPre === "avaria" && item.observacaoPre && (
        <div className="mt-1 text-gray-600 dark:text-gray-400">
          Observação original: {item.observacaoPre}
        </div>
      )}
      {/* Mostra quantas fotos foram tiradas na pré-vistoria */}
      {(item.fotosPre?.length || 0) > 0 && (
        <div className="mt-1 text-gray-500">
           {item.fotosPre?.length} foto(s) na pré-vistoria
        </div>
      )}
    </div>

    {/* BOTÃO DE RADIO: Teve avaria ou não? */}
<div className="flex gap-4">
  <label className="flex items-center gap-2">
    <input
      type="radio"
      name={`teve-avaria-${item.id}`}
      checked={item.estadoPos === "ok"}
      onChange={() => {
        console.log("📝 Marcando OK para:", item.nome);
        setItensChecklist((prev) =>
          prev.map((i) =>
            i.id === item.id 
              ? { ...i, estadoPos: "ok", observacaoPos: "", fotosPos: [] } 
              : i
          )
        );
        setAuditoriaAlterada(true);
      }}
      // ← TEMPORARIAMENTE FORÇANDO false PARA TESTAR
    />
    <span className="text-sm">✓ OK - Sem avarias</span>
  </label>
  <label className="flex items-center gap-2">
    <input
      type="radio"
      name={`teve-avaria-${item.id}`}
      checked={item.estadoPos === "avaria"}
      onChange={() => {
        console.log("📝 Marcando AVARIA para:", item.nome);
        setItensChecklist((prev) =>
          prev.map((i) =>
            i.id === item.id ? { ...i, estadoPos: "avaria" } : i
          )
        );
        setAuditoriaAlterada(true);
      }}
      // ← TEMPORARIAMENTE FORÇANDO false PARA TESTAR
    />
    <span className="text-sm">⚠️ Teve avaria</span>
  </label>
</div>

    {/* SE TEVE AVARIA, MOSTRA CAMPOS PARA REGISTRAR */}
    {item.estadoPos === "avaria" && (
      <div className="space-y-3 pl-4 border-l-2 border-red-300">
        {/* Alerta de comparação */}
        {item.estadoPre === "ok" && (
          <div className="text-xs text-red-600 bg-red-50 dark:bg-red-900/20 p-2 rounded-lg">
            ⚠️ Atenção: Este item estava OK na pré-vistoria e agora apresenta avaria!
          </div>
        )}
        
        {/* Campo de descrição da avaria */}
        <textarea
  placeholder="Descreva o que aconteceu com este item (ex: quebrou 2 cadeiras, mesa riscada, etc.)"
  value={item.observacaoPos || ""}
  onChange={(e) => {
    console.log("✏️ Digitando no item:", item.nome, e.target.value);
    setItensChecklist((prev) =>
      prev.map((i) =>
        i.id === item.id ? { ...i, observacaoPos: e.target.value } : i
      )
    );
    setAuditoriaAlterada(true);
  }}
  className="w-full border border-red-300 dark:border-red-700 rounded-lg p-2 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
  rows={2}
/>

        {/* Upload de fotos da avaria */}
{!somenteLeitura && (
  <div>
    <label className="inline-flex items-center gap-2 text-xs px-3 py-1 border border-red-300 rounded-lg cursor-pointer hover:bg-red-50 dark:hover:bg-red-900/20">
      <Image size={14} />
      Adicionar fotos da avaria
      <input
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => {
          const arquivos = Array.from(e.target.files || []).slice(0, LIMITE_FOTOS_POR_ITEM);
          console.log(`📸 Adicionando ${arquivos.length} foto(s) para o item:`, item.nome);
          
          setFotosTemporariasPos((prev) => ({
            ...prev,
            [item.id]: [...(prev[item.id] || []), ...arquivos],
          }));
          
          setAuditoriaAlterada(true);
        }}
      />
    </label>
    <p className="text-xs text-gray-400 mt-1">
      Adicione fotos que comprovem a avaria (máx {LIMITE_FOTOS_POR_ITEM} fotos)
    </p>
  </div>
)}

        {/* Preview das fotos da avaria */}
       {/* Preview das fotos da avaria */}
<div className="flex gap-2 flex-wrap">
  {/* Fotos já salvas do banco */}
  {(item.fotosPos || []).map((foto, idx) => (
    <div key={`saved-${idx}`} className="relative group">
      <img
        src={foto}
        className="w-16 h-16 object-cover rounded-lg border border-red-300"
      />
      {!somenteLeitura && (
        <button
          onClick={() => {
            const novasFotos = (item.fotosPos || []).filter((_, i) => i !== idx);
            setItensChecklist((prev) =>
              prev.map((i) =>
                i.id === item.id ? { ...i, fotosPos: novasFotos } : i
              )
            );
            setAuditoriaAlterada(true);
          }}
          className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-4 h-4 text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
        >
          ×
        </button>
      )}
    </div>
  ))}
  
  {/* Fotos temporárias (pré-visualização antes de salvar) */}
  {(fotosTemporariasPos[item.id] || []).map((file, idx) => (
    <div key={`temp-${idx}`} className="relative group">
      <img
        src={URL.createObjectURL(file)}
        className="w-16 h-16 object-cover rounded-lg border border-red-300"
      />
      {!somenteLeitura && (
        <button
          onClick={() => {
            setFotosTemporariasPos((prev) => ({
              ...prev,
              [item.id]: prev[item.id].filter((_, i) => i !== idx),
            }));
            setAuditoriaAlterada(true);
          }}
          className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-4 h-4 text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
        >
          ×
        </button>
      )}
    </div>
  ))}
</div>

{((item.fotosPos ?? []).length > 0 ||
  (fotosTemporariasPos[item.id] ?? []).length > 0) && (
  <p className="text-xs text-green-600">
    ✓ {(item.fotosPos ?? []).length} foto(s) salvas + {(fotosTemporariasPos[item.id] ?? []).length} nova(s)
  </p>
)}

        {/* Contador de caracteres */}
        <p className="text-xs text-gray-400">
          {item.observacaoPos?.length || 0}/500 caracteres
        </p>
      </div>
    )}

    {/* Se não teve avaria, mostra mensagem sucinta */}
    {item.estadoPos === "ok" && item.estadoPre === "ok" && (
      <div className="text-xs text-green-600 bg-green-50 dark:bg-green-900/20 p-2 rounded-lg">
        ✓ Item confirmado sem avarias.
      </div>
    )}

    {item.estadoPos === "ok" && item.estadoPre === "avaria" && (
      <div className="text-xs text-green-600 bg-green-50 dark:bg-green-900/20 p-2 rounded-lg">
        ✓ Item já estava com avaria na pré-vistoria e continua sem alterações.
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
