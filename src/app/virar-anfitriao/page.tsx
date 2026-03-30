"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

interface Estado {
  sigla: string;
  nome: string;
}

interface Step1Data {
  nome: string;
  telefone: string;
  cidade: string;
  estado: string;
}

/**
 * ⚠️ STORAGE TEMPORÁRIO
 * APAGAR quando migrar para banco de dados
 */
const STORAGE_KEY = "placyhub_anfitriao_step1";

export default function VirarAnfitriao() {
  const router = useRouter();
  const { user, virarAnfitriao, isAnfitriao } = useAuth();

  const [step, setStep] = useState(1);
  const [showTerms, setShowTerms] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false); // Novo estado para controle de submissão

  const [estados, setEstados] = useState<Estado[]>([]);
  const [loadingEstados, setLoadingEstados] = useState(true);

  const [draft, setDraft] = useState<Step1Data | null>(null);

  /* ========================== PROTEÇÃO =========================== */
  useEffect(() => {
    // Só redireciona se NÃO estiver submetendo e se for anfitrião e estiver no step 1
    if (!user || isSubmitting) return;

    if (isAnfitriao && step === 1) {
      router.replace("/anfitriao");
    }
  }, [user, isAnfitriao, step, router, isSubmitting]);

  /* ========================== RESTAURA STEP 1 =========================== */
  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);

    if (raw) {
      const parsed: Step1Data = JSON.parse(raw);
      setDraft(parsed);
    }
  }, []);

  /* ========================== ESTADOS (IBGE) =========================== */
  useEffect(() => {
    async function fetchEstados() {
      try {
        const res = await fetch(
          "https://servicodados.ibge.gov.br/api/v1/localidades/estados"
        );
        const data = await res.json();

        const ordenados = data
          .map((e: any) => ({ sigla: e.sigla, nome: e.nome }))
          .sort((a: Estado, b: Estado) => a.nome.localeCompare(b.nome));

        setEstados(ordenados);
      } catch {
        toast.error("Erro ao carregar estados");
      } finally {
        setLoadingEstados(false);
      }
    }

    fetchEstados();
  }, []);

  /* ========================== SUBMIT =========================== */
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Evita submissões múltiplas
    if (isSubmitting) return;
    
    const formData = new FormData(e.currentTarget);

    /* ---------- STEP 1 ---------- */
    if (step === 1) {
      const dados: Step1Data = {
        nome: String(formData.get("nome") || ""),
        telefone: String(formData.get("telefone") || ""),
        cidade: String(formData.get("cidade") || ""),
        estado: String(formData.get("estado") || ""),
      };

      if (!dados.nome || !dados.telefone || !dados.cidade || !dados.estado) {
        toast.error("Preencha todos os campos");
        return;
      }

      localStorage.setItem(STORAGE_KEY, JSON.stringify(dados));

      setDraft(dados);
      setStep(2);
      return;
    }

    /* ---------- STEP 2 ---------- */
    if (step === 2) {
      const cpf = String(formData.get("cpf") || "");

      if (!cpf) {
        toast.error("Informe o CPF");
        return;
      }

      if (formData.get("termos") !== "on") {
        toast.error("Você precisa aceitar os termos");
        return;
      }

      const step1Raw = localStorage.getItem(STORAGE_KEY);

      if (!step1Raw) {
        toast.error("Dados iniciais não encontrados. Refaça o cadastro.");
        setStep(1);
        return;
      }

      const step1: Step1Data = JSON.parse(step1Raw);

      localStorage.setItem(
        "placyhub_perfil_anfitriao",
        JSON.stringify({
          ...step1,
          cpf,
          criadoEm: new Date().toISOString(),
        })
      );

      try {
        setIsSubmitting(true); // Marca como submetendo antes da requisição
        
        await virarAnfitriao(cpf);

        localStorage.removeItem(STORAGE_KEY);

        toast.success("Agora você é um anfitrião");

        // Pequeno delay para garantir que o estado foi atualizado
        setTimeout(() => {
          router.replace("/anfitriao");
        }, 100);
        
      } catch (err: any) {
        setIsSubmitting(false); // Libera em caso de erro
        toast.error(err.message || "Erro ao virar anfitrião");
      }
    }
  };

  if (!user) return null;

  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-slate-900">
        <div className="w-full max-w-2xl p-8 rounded-2xl shadow-md bg-white dark:bg-slate-800">
          {/* BOTÃO VOLTAR */}
          <div className="w-full mb-8 flex justify-end">
            <Link
              href="/"
              className="flex items-center justify-center
              w-10 h-10 rounded-full
              bg-white dark:bg-slate-800
              border border-gray-200 dark:border-slate-700
              text-gray-500 dark:text-gray-400
              hover:bg-gray-50 dark:hover:bg-slate-700
              hover:border-gray-300 dark:hover:border-slate-600
              hover:text-gray-700 dark:hover:text-gray-200
              hover:shadow-sm
              transition-all duration-300
              group"
              aria-label="Voltar"
            >
              <ArrowLeft size={18} className="group-hover:-translate-x-0.5 transition-transform duration-300" />
            </Link>
          </div>

          <h2 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-white">
            Torne-se um anfitrião no PlacyHub
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {step === 1 && (
              <>
                <input
                  name="nome"
                  defaultValue={draft?.nome || user.name}
                  placeholder="Nome completo"
                  className="input dark:bg-slate-700 dark:border-slate-600 dark:text-white dark:placeholder:text-gray-400"
                />

                <input
                  name="telefone"
                  defaultValue={draft?.telefone || user.telefone || ""}
                  placeholder="Telefone"
                  className="input dark:bg-slate-700 dark:border-slate-600 dark:text-white dark:placeholder:text-gray-400"
                />

                <input
                  name="cidade"
                  defaultValue={draft?.cidade || user.cidade || ""}
                  placeholder="Cidade"
                  className="input dark:bg-slate-700 dark:border-slate-600 dark:text-white dark:placeholder:text-gray-400"
                />

                <select
                  name="estado"
                  defaultValue={draft?.estado || user.estado || ""}
                  disabled={loadingEstados}
                  className="input dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                >
                  <option value="">
                    {loadingEstados
                      ? "Carregando estados..."
                      : "Selecione o estado"}
                  </option>
                  {estados.map((e) => (
                    <option key={e.sigla} value={e.sigla}>
                      {e.nome} ({e.sigla})
                    </option>
                  ))}
                </select>
              </>
            )}

            {step === 2 && (
              <>
                <input
                  name="cpf"
                  placeholder="CPF"
                  className="input dark:bg-slate-700 dark:border-slate-600 dark:text-white dark:placeholder:text-gray-400"
                />

                <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                  <input
                    type="checkbox"
                    name="termos"
                    className="dark:bg-slate-700 dark:border-slate-600"
                  />
                  Aceito os{" "}
                  <button
                    type="button"
                    onClick={() => setShowTerms(true)}
                    className="text-sky-600 dark:text-sky-400 hover:underline"
                  >
                    Termos de Uso
                  </button>
                </label>
              </>
            )}

            <button 
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-sky-500 hover:bg-sky-600 dark:bg-sky-600 dark:hover:bg-sky-700 text-white py-2 rounded-xl font-semibold transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Processando..." : (step === 1 ? "Continuar" : "Confirmar e virar anfitrião")}
            </button>
          </form>
        </div>
      </div>

      {/* MODAL TERMOS */}
      {showTerms && (
        <div className="fixed inset-0 z-50 bg-black/50 dark:bg-black/70 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 max-w-lg w-full p-6 rounded-2xl shadow-xl relative">
            <button
              onClick={() => setShowTerms(false)}
              className="absolute top-4 right-4 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 text-xl transition-colors"
            >
              ×
            </button>

            <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
              Termos de Uso
            </h3>

            <div className="max-h-80 overflow-y-auto text-sm text-gray-600 dark:text-gray-400 space-y-3">
              <p>
                Ao se tornar anfitrião no PlacyHub, você concorda em fornecer
                informações verdadeiras sobre seus espaços.
              </p>
              <p>
                O PlacyHub atua apenas como intermediador entre locatários e
                anfitriões.
              </p>
              <p>
                O anfitrião é responsável pelos valores, regras e informações do
                espaço anunciado.
              </p>
            </div>

            <button
              onClick={() => setShowTerms(false)}
              className="mt-6 w-full bg-sky-500 hover:bg-sky-600 dark:bg-sky-600 dark:hover:bg-sky-700 text-white py-2 rounded-xl transition-colors duration-200"
            >
              Entendi
            </button>
          </div>
        </div>
      )}

      <style jsx>{`
        .input {
          width: 100%;
          border: 1px solid #ddd;
          border-radius: 12px;
          padding: 10px;
          transition: all 0.2s ease;
        }
        
        .input:focus {
          outline: none;
          border-color: #0ea5e9;
          box-shadow: 0 0 0 3px rgba(14, 165, 233, 0.1);
        }
        
        .dark .input {
          border-color: #475569;
        }
        
        .dark .input:focus {
          border-color: #0ea5e9;
          box-shadow: 0 0 0 3px rgba(14, 165, 233, 0.2);
        }
      `}</style>
    </>
  );
}