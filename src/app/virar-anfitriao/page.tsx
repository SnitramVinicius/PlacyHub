"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

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

  const [estados, setEstados] = useState<Estado[]>([]);
  const [loadingEstados, setLoadingEstados] = useState(true);

  const [draft, setDraft] = useState<Step1Data | null>(null);

  /* ========================== PROTEÇÃO =========================== */
useEffect(() => {
  if (!user) return;

  // só redireciona se NÃO estiver no meio do fluxo
  if (isAnfitriao && step === 1) {
    router.replace("/anfitriao");
  }
}, [user, isAnfitriao, step, router]);

  /* ========================== RESTAURA STEP 1 =========================== */
useEffect(() => {
  const raw = localStorage.getItem(STORAGE_KEY);

  if (raw) {
    const parsed: Step1Data = JSON.parse(raw);
    setDraft(parsed);
    // 🚫 NÃO muda o step aqui
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

      // ⚠️ APAGAR quando usar banco
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

      /**
       * ⚠️ PERFIL TEMPORÁRIO
       * APAGAR quando persistir no banco
       */
      localStorage.setItem(
        "placyhub_perfil_anfitriao",
        JSON.stringify({
          ...step1,
          cpf,
          criadoEm: new Date().toISOString(),
        })
      );

      // ✅ FORMA CORRETA (atualiza token + contexto)
     try {
  await virarAnfitriao(cpf);

  localStorage.removeItem(STORAGE_KEY);

  toast.success("Agora você é um anfitrião");

router.replace("/anfitriao");
} catch (err: any) {
  toast.error(err.message || "Erro ao virar anfitrião");
}

    }
  };

  if (!user) return null;

  return (
    <>
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-full max-w-2xl p-8 rounded-2xl shadow-md bg-white">
          <h2 className="text-2xl font-semibold mb-6">
            Torne-se um anfitrião no PlacyHub
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {step === 1 && (
              <>
                <input
                  name="nome"
                  defaultValue={draft?.nome || user.name}
                  placeholder="Nome completo"
                  className="input"
                />

                <input
                  name="telefone"
                  defaultValue={draft?.telefone || user.telefone || ""}
                  placeholder="Telefone"
                  className="input"
                />

                <input
                  name="cidade"
                  defaultValue={draft?.cidade || user.cidade || ""}
                  placeholder="Cidade"
                  className="input"
                />

                <select
                  name="estado"
                  defaultValue={draft?.estado || user.estado || ""}
                  disabled={loadingEstados}
                  className="input"
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
                <input name="cpf" placeholder="CPF" className="input" />

                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" name="termos" />
                  Aceito os{" "}
                  <button
                    type="button"
                    onClick={() => setShowTerms(true)}
                    className="text-sky-600 hover:underline"
                  >
                    Termos de Uso
                  </button>
                </label>
              </>
            )}

            <button className="w-full bg-sky-500 text-white py-2 rounded-xl font-semibold">
              {step === 1 ? "Continuar" : "Confirmar e virar anfitrião"}
            </button>
          </form>
        </div>
      </div>

      {/* MODAL TERMOS */}
      {showTerms && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
          <div className="bg-white max-w-lg w-full p-6 rounded-2xl shadow-xl relative">
            <button
              onClick={() => setShowTerms(false)}
              className="absolute top-4 right-4 text-gray-400 text-xl"
            >
              ×
            </button>

            <h3 className="text-xl font-semibold mb-4">Termos de Uso</h3>

            <div className="max-h-80 overflow-y-auto text-sm text-gray-600 space-y-3">
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
              className="mt-6 w-full bg-sky-500 text-white py-2 rounded-xl"
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
        }
      `}</style>
    </>
  );
}
