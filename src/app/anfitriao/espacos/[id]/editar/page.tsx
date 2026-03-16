"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import EspacoForm, { EspacoFormData } from "@/components/EspacoForm";

export default function EditarEspaco() {
  const params = useParams();
  const id = params.id as string;

  const [dados, setDados] = useState<EspacoFormData | null>(null);

  useEffect(() => {
    const todos = JSON.parse(localStorage.getItem("espacos") || "[]");

    const espacoEncontrado = todos.find((e: any) => e.id === id);

    if (espacoEncontrado) {
      setDados(espacoEncontrado);
    }
  }, [id]);

  const handleSubmit = (dadosAtualizados: EspacoFormData) => {
    const todos = JSON.parse(localStorage.getItem("espacos") || "[]");

    const atualizados = todos.map((e: any) =>
      e.id === id ? { ...e, ...dadosAtualizados } : e
    );

    localStorage.setItem("espacos", JSON.stringify(atualizados));

    alert("Espaço atualizado com sucesso!");
  };

  if (!dados) return <p>Carregando...</p>;

  return (
    <EspacoForm
      modo="editar"
      dadosIniciais={dados}
      onSubmit={handleSubmit}
    />
  );
}