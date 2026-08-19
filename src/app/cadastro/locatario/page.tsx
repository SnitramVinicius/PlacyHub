"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Eye, EyeOff, X } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";
import { LegalContent, type LegalDocumentType } from "@/components/legal/LegalContent";

interface EstadoIBGE {
  id: number;
  sigla: string;
  nome: string;
}

interface CidadeIBGE {
  id: number;
  nome: string;
}

type FieldErrors = Partial<
  Record<
    | "nome"
    | "email"
    | "senha"
    | "confirmarSenha"
    | "telefone"
    | "cidade"
    | "estado"
    | "dataNascimento"
    | "termos",
    string
  >
>;

const validarSenha = (senha: string) => /^(?=.*[A-Z])(?=.*\d).{8,}$/.test(senha);

const formatarTelefone = (valor: string) => {
  const numeros = normalizarTelefoneBrasileiro(valor);
  if (numeros.length <= 2) return numeros ? `(${numeros}` : "";
  if (numeros.length <= 6) return `(${numeros.slice(0, 2)}) ${numeros.slice(2)}`;
  if (numeros.length <= 10) {
    return `(${numeros.slice(0, 2)}) ${numeros.slice(2, 6)}-${numeros.slice(6)}`;
  }
  return `(${numeros.slice(0, 2)}) ${numeros.slice(2, 7)}-${numeros.slice(7)}`;
};

const dataMaximaNascimento = () => {
  const hoje = new Date();
  const limite = new Date(hoje.getFullYear() - 18, hoje.getMonth(), hoje.getDate());
  return limite.toISOString().split("T")[0];
};

function validarDataNascimento(data: string) {
  if (!data) return "Informe sua data de nascimento.";
  const nascimento = new Date(`${data}T12:00:00`);
  const hoje = new Date();
  if (Number.isNaN(nascimento.getTime())) return "Informe uma data válida.";
  if (nascimento > hoje) return "A data de nascimento não pode estar no futuro.";

  let idade = hoje.getFullYear() - nascimento.getFullYear();
  const aniversarioAindaNaoOcorreu =
    hoje.getMonth() < nascimento.getMonth() ||
    (hoje.getMonth() === nascimento.getMonth() && hoje.getDate() < nascimento.getDate());
  if (aniversarioAindaNaoOcorreu) idade--;
  if (idade < 18) return "Você precisa ter pelo menos 18 anos para criar uma conta.";
  if (idade > 120) return "Confira a data de nascimento informada.";
  return "";
}

function normalizarTelefoneBrasileiro(valor: string) {
  let numeros = valor.replace(/\D/g, "");
  if ((numeros.length === 12 || numeros.length === 13) && numeros.startsWith("55")) {
    numeros = numeros.slice(2);
  }
  return numeros.slice(0, 11);
}

export default function CadastroLocatario() {
  const [loading, setLoading] = useState(false);
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [mostrarConfirmarSenha, setMostrarConfirmarSenha] = useState(false);
  const [estados, setEstados] = useState<EstadoIBGE[]>([]);
  const [cidades, setCidades] = useState<CidadeIBGE[]>([]);
  const [estadoSelecionado, setEstadoSelecionado] = useState("");
  const [cidadeSelecionada, setCidadeSelecionada] = useState("");
  const [telefone, setTelefone] = useState("");
  const [loadingEstados, setLoadingEstados] = useState(true);
  const [loadingCidades, setLoadingCidades] = useState(false);
  const [erros, setErros] = useState<FieldErrors>({});
  const [modalAberto, setModalAberto] = useState<"termos" | "privacidade" | null>(null);

  const router = useRouter();
  const { login } = useAuth();
  const maxDataNascimento = useMemo(dataMaximaNascimento, []);

  useEffect(() => {
    const controller = new AbortController();

    async function carregarEstados() {
      try {
        const res = await fetch(
          "https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome",
          { signal: controller.signal }
        );
        if (!res.ok) throw new Error("Falha ao carregar estados");
        setEstados(await res.json());
      } catch (error) {
        if ((error as Error).name !== "AbortError") toast.error("Erro ao carregar estados.");
      } finally {
        if (!controller.signal.aborted) setLoadingEstados(false);
      }
    }

    carregarEstados();
    return () => controller.abort();
  }, []);

  useEffect(() => {
    setCidades([]);
    setCidadeSelecionada("");
    setErros((atuais) => ({ ...atuais, cidade: undefined }));
    if (!estadoSelecionado) return;

    const controller = new AbortController();

    async function carregarCidades() {
      setLoadingCidades(true);
      try {
        const res = await fetch(
          `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${estadoSelecionado}/municipios?orderBy=nome`,
          { signal: controller.signal }
        );
        if (!res.ok) throw new Error("Falha ao carregar cidades");
        setCidades(await res.json());
      } catch (error) {
        if ((error as Error).name !== "AbortError") toast.error("Erro ao carregar cidades.");
      } finally {
        if (!controller.signal.aborted) setLoadingCidades(false);
      }
    }

    carregarCidades();
    return () => controller.abort();
  }, [estadoSelecionado]);

  const limparErro = (campo: keyof FieldErrors) =>
    setErros((atuais) => ({ ...atuais, [campo]: undefined }));

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const usuario = {
      nome: formData.get("nome")?.toString().trim() ?? "",
      email: formData.get("email")?.toString().trim() ?? "",
      senha: formData.get("senha")?.toString() ?? "",
      confirmarSenha: formData.get("confirmarSenha")?.toString() ?? "",
      telefone,
      cidade: cidadeSelecionada,
      estado: estadoSelecionado,
      dataNascimento: formData.get("dataNascimento")?.toString() ?? "",
      termos: formData.get("termos") === "on",
    };

    const novosErros: FieldErrors = {};
    if (!usuario.nome) novosErros.nome = "Informe seu nome completo.";
    if (!usuario.email) novosErros.email = "Informe seu e-mail.";
    if (!usuario.senha) novosErros.senha = "Informe uma senha.";
    else if (!validarSenha(usuario.senha)) {
      novosErros.senha = "Use 8 ou mais caracteres, uma letra maiúscula e um número.";
    }
    if (!usuario.confirmarSenha) novosErros.confirmarSenha = "Confirme sua senha.";
    else if (usuario.senha !== usuario.confirmarSenha) {
      novosErros.confirmarSenha = "As senhas não coincidem.";
    }
    const telefoneNumeros = normalizarTelefoneBrasileiro(usuario.telefone);
    if (!telefoneNumeros) novosErros.telefone = "Informe seu telefone.";
    else if (![10, 11].includes(telefoneNumeros.length)) {
      novosErros.telefone = "Informe um telefone com DDD válido.";
    }
    if (!usuario.estado) novosErros.estado = "Selecione seu estado.";
    if (!usuario.cidade) novosErros.cidade = "Selecione sua cidade.";
    const erroData = validarDataNascimento(usuario.dataNascimento);
    if (erroData) novosErros.dataNascimento = erroData;
    if (!usuario.termos) novosErros.termos = "Aceite os termos para continuar.";

    setErros(novosErros);
    if (Object.keys(novosErros).length > 0) {
      document.getElementById(Object.keys(novosErros)[0])?.focus();
      return;
    }

    setLoading(true);
    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: usuario.email,
        password: usuario.senha,
        options: {
          data: {
            name: usuario.nome,
            telefone: telefoneNumeros,
            cidade: usuario.cidade,
            estado: usuario.estado,
            data_nascimento: usuario.dataNascimento || null,
          },
        },
      });

      if (authError) throw authError;
      if (!authData.user) throw new Error("Não foi possível criar o usuário.");

      const { error } = await supabase
        .from("users")
        .update({
          telefone: telefoneNumeros,
          cidade: usuario.cidade,
          estado: usuario.estado,
          data_nascimento: usuario.dataNascimento || null,
          is_anfitriao: false,
          roles: ["LOCATARIO"],
        })
        .eq("id", authData.user.id);

      if (error) throw error;

      const loginSuccess = await login(usuario.email, usuario.senha);
      if (loginSuccess) {
        toast.success("Conta criada com sucesso!");
        router.push("/");
      } else {
        toast.info("Conta criada. Confirme seu e-mail e faça login para continuar.");
        router.push("/login");
      }
    } catch (error) {
      console.error("Erro ao criar conta:", error);
      toast.error(error instanceof Error ? error.message : "Erro ao criar conta. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const formularioIndisponivel = loading || loadingEstados || loadingCidades;

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <div className="flex justify-center pt-6 pb-2">
        <Link href="/" aria-label="Ir para a página inicial">
          <Image src="/placyhub.png" alt="PlacyHub" width={180} height={48} className="h-12 w-auto" priority />
        </Link>
      </div>

      <main className="max-w-2xl mx-auto px-4 py-4 sm:py-6">
        <Link
          href="/login"
          className="inline-flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-sky-600 dark:hover:text-sky-400 transition-colors mb-4"
        >
          <ArrowLeft size={18} aria-hidden="true" />
          <span>Voltar para o login</span>
        </Link>

        <div className="bg-white dark:bg-gray-800 p-6 sm:p-8">
          <h1 className="text-xl sm:text-2xl font-semibold text-gray-800 dark:text-gray-100">
            Crie sua conta no PlacyHub
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1 mb-6 sm:mb-8">
            Comece a alugar os melhores espaços da sua cidade.
          </p>

          <form onSubmit={handleSubmit} noValidate className="space-y-4 sm:space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input id="nome" label="Nome completo" name="nome" autoComplete="name" required error={erros.nome} onChange={() => limparErro("nome")} />
              <Input id="email" label="E-mail" name="email" type="email" autoComplete="email" required error={erros.email} onChange={() => limparErro("email")} />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <PasswordInput id="senha" label="Senha" name="senha" autoComplete="new-password" show={mostrarSenha} toggle={() => setMostrarSenha((valor) => !valor)} required error={erros.senha} onChange={() => limparErro("senha")} description="Mínimo de 8 caracteres, uma letra maiúscula e um número." />
              <PasswordInput id="confirmarSenha" label="Confirmar senha" name="confirmarSenha" autoComplete="new-password" show={mostrarConfirmarSenha} toggle={() => setMostrarConfirmarSenha((valor) => !valor)} required error={erros.confirmarSenha} onChange={() => limparErro("confirmarSenha")} />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input id="telefone" label="Telefone" name="telefone" type="tel" inputMode="numeric" autoComplete="tel" placeholder="(11) 99999-9999" value={telefone} required error={erros.telefone} onChange={(event: React.ChangeEvent<HTMLInputElement>) => { setTelefone(formatarTelefone(event.target.value)); limparErro("telefone"); }} />
              <Select id="estado" label="Estado" name="estado" value={estadoSelecionado} disabled={loadingEstados} required error={erros.estado} onChange={(event: React.ChangeEvent<HTMLSelectElement>) => { setEstadoSelecionado(event.target.value); limparErro("estado"); }}>
                <option value="">{loadingEstados ? "Carregando estados..." : "Selecione seu estado"}</option>
                {estados.map((estado) => <option key={estado.id} value={estado.sigla}>{estado.nome} ({estado.sigla})</option>)}
              </Select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Select id="cidade" label="Cidade" name="cidade" value={cidadeSelecionada} disabled={!estadoSelecionado || loadingCidades} required error={erros.cidade} onChange={(event: React.ChangeEvent<HTMLSelectElement>) => { setCidadeSelecionada(event.target.value); limparErro("cidade"); }}>
                <option value="">{!estadoSelecionado ? "Selecione primeiro o estado" : loadingCidades ? "Carregando cidades..." : "Selecione sua cidade"}</option>
                {cidades.map((cidade) => <option key={cidade.id} value={cidade.nome}>{cidade.nome}</option>)}
              </Select>
              <Input id="dataNascimento" label="Data de nascimento" name="dataNascimento" type="date" autoComplete="bday" max={maxDataNascimento} required error={erros.dataNascimento} onChange={() => limparErro("dataNascimento")} />
            </div>

            <div>
              <label className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
                <input id="termos" type="checkbox" name="termos" required aria-invalid={Boolean(erros.termos)} aria-describedby={erros.termos ? "termos-error" : undefined} className="mt-1" onChange={() => limparErro("termos")} />
                <span>Aceito os <button type="button" onClick={() => setModalAberto("termos")} className="text-sky-600 dark:text-sky-400 hover:underline">Termos de Uso</button> e a <button type="button" onClick={() => setModalAberto("privacidade")} className="text-sky-600 dark:text-sky-400 hover:underline">Política de Privacidade</button></span>
              </label>
              {erros.termos && <FieldError id="termos-error">{erros.termos}</FieldError>}
            </div>

            <button type="submit" disabled={formularioIndisponivel} className="w-full bg-sky-500 hover:bg-sky-600 disabled:opacity-50 disabled:cursor-not-allowed text-white py-3 rounded-xl font-medium transition">
              {loading ? "Criando conta..." : loadingEstados || loadingCidades ? "Carregando localização..." : "Criar conta"}
            </button>

            <p className="text-center text-sm text-gray-500 dark:text-gray-400">
              Já tem uma conta? <Link href="/login" className="text-sky-600 dark:text-sky-400 hover:underline">Entrar</Link>
            </p>
          </form>
        </div>
      </main>

      {modalAberto && <Modal type={modalAberto} onClose={() => setModalAberto(null)} />}
    </div>
  );
}

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  id: string;
  label: string;
  error?: string;
};

function Input({ id, label, required, error, ...props }: InputProps) {
  const errorId = `${id}-error`;
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}{required && <span className="text-red-500 ml-1" aria-hidden="true">*</span>}</label>
      <input id={id} required={required} aria-required={required} aria-invalid={Boolean(error)} aria-describedby={error ? errorId : undefined} {...props} className={`w-full border rounded-xl px-3 py-2.5 focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none transition bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 ${error ? "border-red-500" : "border-gray-300 dark:border-gray-600"}`} />
      {error && <FieldError id={errorId}>{error}</FieldError>}
    </div>
  );
}

type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement> & {
  id: string;
  label: string;
  error?: string;
};

function Select({ id, label, children, required, error, ...props }: SelectProps) {
  const errorId = `${id}-error`;
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}{required && <span className="text-red-500 ml-1" aria-hidden="true">*</span>}</label>
      <select id={id} required={required} aria-required={required} aria-invalid={Boolean(error)} aria-describedby={error ? errorId : undefined} {...props} className={`w-full border rounded-xl px-3 py-2.5 focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none transition bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 disabled:opacity-60 disabled:cursor-not-allowed ${error ? "border-red-500" : "border-gray-300 dark:border-gray-600"}`}>{children}</select>
      {error && <FieldError id={errorId}>{error}</FieldError>}
    </div>
  );
}

type PasswordInputProps = InputProps & {
  show: boolean;
  toggle: () => void;
  description?: string;
};

function PasswordInput({ id, label, show, toggle, required, error, description, ...props }: PasswordInputProps) {
  const errorId = `${id}-error`;
  const descriptionId = `${id}-description`;
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}{required && <span className="text-red-500 ml-1" aria-hidden="true">*</span>}</label>
      <div className="relative">
        <input id={id} type={show ? "text" : "password"} required={required} minLength={8} aria-required={required} aria-invalid={Boolean(error)} aria-describedby={[description ? descriptionId : "", error ? errorId : ""].filter(Boolean).join(" ") || undefined} {...props} className={`w-full border rounded-xl px-3 py-2.5 pr-10 focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none transition bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 ${error ? "border-red-500" : "border-gray-300 dark:border-gray-600"}`} />
        <button type="button" onClick={toggle} aria-label={show ? `Ocultar ${label.toLowerCase()}` : `Mostrar ${label.toLowerCase()}`} aria-pressed={show} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200">{show ? <EyeOff size={18} aria-hidden="true" /> : <Eye size={18} aria-hidden="true" />}</button>
      </div>
      {description && <p id={descriptionId} className="text-xs text-gray-500 dark:text-gray-400">{description}</p>}
      {error && <FieldError id={errorId}>{error}</FieldError>}
    </div>
  );
}

function FieldError({ id, children }: { id: string; children: React.ReactNode }) {
  return <p id={id} role="alert" className="text-xs text-red-600 dark:text-red-400 mt-1">{children}</p>;
}

function Modal({ type, onClose }: { type: LegalDocumentType; onClose: () => void }) {
  const titulo = type === "termos" ? "Termos de Uso" : "Política de Privacidade";
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <div role="dialog" aria-modal="true" aria-labelledby="modal-title" className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl max-w-3xl w-full p-6 relative">
        <button type="button" onClick={onClose} aria-label="Fechar" className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"><X size={18} aria-hidden="true" /></button>
        <h2 id="modal-title" className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">{titulo}</h2>
        <div className="text-sm max-h-[65vh] overflow-y-auto pr-2">
          <LegalContent type={type} compact />
        </div>
        <button type="button" onClick={onClose} className="mt-4 w-full bg-sky-500 hover:bg-sky-600 text-white py-2 rounded-xl font-medium transition">Fechar</button>
      </div>
    </div>
  );
}
