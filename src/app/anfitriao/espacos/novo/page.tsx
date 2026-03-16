"use client";
import { useRouter } from "next/navigation";
import EspacoForm, { EspacoFormData } from "@/components/EspacoForm";

export default function NovoEspaco() {
  const router = useRouter();

  const handleSubmit = (dados: EspacoFormData) => {
    const todos = JSON.parse(localStorage.getItem("espacos") || "[]");

    const novoEspaco = {
      ...dados,
      id: Date.now().toString(),
      criadoEm: new Date().toISOString(),
    };

    localStorage.setItem(
      "espacos",
      JSON.stringify([...todos, novoEspaco])
    );

    alert("Espaço cadastrado com sucesso!");

    router.push("/anfitriao/espacos");
  };

  return (
    <EspacoForm
      modo="criar"
      dadosIniciais={null}
      onSubmit={handleSubmit}
    />
  );
}