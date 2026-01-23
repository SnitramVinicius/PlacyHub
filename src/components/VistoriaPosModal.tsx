
"use client";

import { useState } from "react";
import { Auditoria, ItemChecklist } from "@/types/auditoria";

interface Props {
  auditoriaPre: Auditoria;
  onClose: () => void;
  onSalvar: (auditoria: Auditoria) => void;
}

export default function VistoriaPosModal({
  auditoriaPre,
  onClose,
  onSalvar,
}: Props) {
  const [itens, setItens] = useState<ItemChecklist[]>(
    auditoriaPre.itens.map((item) => ({
      ...item,
      estadoPos: "ok",
    }))
  );

  const [observacoesGerais, setObservacoesGerais] = useState("");

  function atualizarItem(id: string, estado: "ok" | "avaria") {
    setItens((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, estadoPos: estado } : item
      )
    );
  }

  function salvar() {
    onSalvar({
      tipo: "pos",
      itens,
      observacoesGerais,
      finalizada: true,
      data: new Date().toISOString(),
    });

    onClose();
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-lg rounded-2xl p-6 space-y-4">
        <h2 className="text-lg font-semibold">Vistoria pós-evento</h2>

        {itens.map((item) => (
          <div key={item.id} className="border rounded-xl p-4 space-y-2">
            <div className="flex justify-between items-center">
              <p className="text-sm font-medium">
                {item.quantidade} {item.nome}
              </p>

              <select
                value={item.estadoPos}
                onChange={(e) =>
                  atualizarItem(item.id, e.target.value as "ok" | "avaria")
                }
                className="border rounded-lg px-2 py-1 text-sm"
              >
                <option value="ok">Sem avarias</option>
                <option value="avaria">Com avaria</option>
              </select>
            </div>

            {item.estadoPos === "avaria" && (
              <textarea
                placeholder="Descreva a avaria encontrada"
                className="w-full border rounded-lg p-2 text-sm"
                onChange={(e) =>
                  setItens((prev) =>
                    prev.map((i) =>
                      i.id === item.id
                        ? { ...i, observacaoPos: e.target.value }
                        : i
                    )
                  )
                }
              />
            )}
          </div>
        ))}

        <textarea
          placeholder="Observações gerais"
          className="w-full border rounded-lg p-3 text-sm"
          onChange={(e) => setObservacoesGerais(e.target.value)}
        />

        <div className="flex justify-end gap-2">
          <button onClick={onClose}>Cancelar</button>
          <button
            onClick={salvar}
            className="bg-black text-white px-4 py-2 rounded-lg"
          >
            Salvar vistoria
          </button>
        </div>
      </div>
    </div>
  );
}
