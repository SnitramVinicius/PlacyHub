"use client";

import { useState, ChangeEvent, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Camera,
  Edit3,
  Lock,
  Settings,
  LogOut,
  Save,
  Heart,
  BadgeCheck,
} from "lucide-react";
import { toast } from "sonner";

/* ===================== TIPOS ===================== */

interface Usuario {
  id: string;

  nome: string;
  email: string;
  telefone?: string;
  cpf?: string;
  dataNascimento?: string;
  fotoUrl?: string;

  endereco?: {
    cep?: string;
    rua?: string;
    numero?: string;
    bairro?: string;
    cidade?: string;
    estado?: string;
  };

  configuracoes?: {
    idioma: "pt-BR" | "en-US";
    tema: "light" | "dark" | "system";
    notificacoes: {
      email: boolean;
      whatsapp: boolean;
      push: boolean;
    };
  };

  roles: ("LOCATARIO" | "ANFITRIAO")[];
  anfitriao?: Anfitriao;
}

interface Anfitriao {
  status: "PENDENTE" | "VERIFICADO" | "BLOQUEADO";
  dadosBancarios: {
    banco: string;
    agencia: string;
    conta: string;
    tipoConta: "corrente" | "poupanca";
    titular: string;
    cpfTitular: string;
  };
}

/* ===================== COMPONENTE ===================== */

export default function PerfilUsuario() {
  const router = useRouter();

  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [editando, setEditando] = useState(false);
  const [confirmarLogout, setConfirmarLogout] = useState(false);

  useEffect(() => {
    const dados = localStorage.getItem("usuario");
    if (!dados) {
      router.push("/login");
      return;
    }
    setUsuario(JSON.parse(dados));
  }, [router]);

  if (!usuario) return null;

  const isAnfitriao = usuario.roles.includes("ANFITRIAO");

  const handleFotoChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;
    const url = URL.createObjectURL(e.target.files[0]);
    setUsuario({ ...usuario, fotoUrl: url });
    toast.success("Foto de perfil atualizada!");
  };

  const handleSalvar = () => {
    localStorage.setItem("usuario", JSON.stringify(usuario));
    setEditando(false);
    toast.success("Informações atualizadas com sucesso!");
  };

  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    router.push("/login");
  };

  return (
    <div className="p-4 md:p-6 relative bg-gray-50 dark:bg-gray-900 min-h-screen text-gray-900 dark:text-gray-100">
      <h1 className="text-2xl font-bold mb-6">Meu Perfil</h1>

      {/* Cabeçalho - Mobile first */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow mb-6">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
          {/* Foto - centralizada em mobile, alinhada à esquerda em desktop */}
          <div className="relative flex-shrink-0">
            <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
              {usuario.fotoUrl ? (
                <img 
                  src={usuario.fotoUrl} 
                  alt="Foto de perfil"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-gray-500 dark:text-gray-400 text-sm text-center px-2">
                  Sem foto
                </span>
              )}
            </div>
            <label className="absolute bottom-0 right-0 bg-sky-500 p-2 rounded-full cursor-pointer hover:bg-sky-600 transition-colors shadow-lg">
              <Camera size={18} className="text-white" />
              <input type="file" accept="image/*" hidden onChange={handleFotoChange} />
            </label>
          </div>

          {/* Informações do usuário - centralizadas em mobile, alinhadas à esquerda em desktop */}
          <div className="text-center md:text-left flex-1">
            <h2 className="text-xl font-semibold break-words">{usuario.nome}</h2>
            <p className="text-gray-600 dark:text-gray-300 break-words">{usuario.email}</p>
            
            {/* Badge de anfitrião se for verificado */}
            {isAnfitriao && usuario.anfitriao?.status === "VERIFICADO" && (
              <div className="inline-flex items-center gap-1 mt-2 px-3 py-1 bg-sky-100 dark:bg-sky-900 text-sky-700 dark:text-sky-300 rounded-full text-sm">
                <BadgeCheck size={16} />
                <span>Anfitrião Verificado</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Dados pessoais */}
      <Section
        title="Dados Pessoais"
        editando={editando}
        onEditar={() => setEditando(true)}
        onSalvar={handleSalvar}
      >
        <Input 
          label="Nome" 
          value={usuario.nome} 
          disabled={!editando}
          onChange={(v: string) => setUsuario({ ...usuario, nome: v })} 
        />

        <Input 
          label="CPF" 
          value={usuario.cpf || ""} 
          disabled={!editando}
          onChange={(v: string) => setUsuario({ ...usuario, cpf: v })} 
          mask="cpf"
        />

        <Input 
          label="Telefone" 
          value={usuario.telefone || ""} 
          disabled={!editando}
          onChange={(v: string) => setUsuario({ ...usuario, telefone: v })} 
          mask="phone"
        />

        <Input 
          label="Data de Nascimento" 
          type="date"
          value={usuario.dataNascimento || ""} 
          disabled={!editando}
          onChange={(v: string) => setUsuario({ ...usuario, dataNascimento: v })} 
        />
      </Section>

      {/* Endereço */}
      <Section title="Endereço">
        <Input 
          label="CEP" 
          value={usuario.endereco?.cep || ""} 
          disabled={!editando}
          onChange={(v: string) =>
            setUsuario({ ...usuario, endereco: { ...usuario.endereco, cep: v } })
          } 
          mask="cep"
        />
        <Input 
          label="Rua" 
          value={usuario.endereco?.rua || ""} 
          disabled={!editando}
          onChange={(v: string) =>
            setUsuario({ ...usuario, endereco: { ...usuario.endereco, rua: v } })
          } 
        />
        <Input 
          label="Número" 
          value={usuario.endereco?.numero || ""} 
          disabled={!editando}
          onChange={(v: string) =>
            setUsuario({ ...usuario, endereco: { ...usuario.endereco, numero: v } })
          } 
        />
        <Input 
          label="Bairro" 
          value={usuario.endereco?.bairro || ""} 
          disabled={!editando}
          onChange={(v: string) =>
            setUsuario({ ...usuario, endereco: { ...usuario.endereco, bairro: v } })
          } 
        />
        <Input 
          label="Cidade" 
          value={usuario.endereco?.cidade || ""} 
          disabled={!editando}
          onChange={(v: string) =>
            setUsuario({ ...usuario, endereco: { ...usuario.endereco, cidade: v } })
          } 
        />
        <Input 
          label="Estado" 
          value={usuario.endereco?.estado || ""} 
          disabled={!editando}
          onChange={(v: string) =>
            setUsuario({ ...usuario, endereco: { ...usuario.endereco, estado: v } })
          } 
        />
      </Section>

      {/* Dados do Anfitrião */}
      {isAnfitriao && (
        <Section title="Dados do Anfitrião">
          <div className="col-span-full">
            <div className="flex items-center gap-2 text-sky-600 dark:text-sky-400">
              <BadgeCheck size={18} />
              <span>
                Status: <strong>{usuario.anfitriao?.status === "VERIFICADO" ? "Verificado" : 
                  usuario.anfitriao?.status === "PENDENTE" ? "Pendente" : "Bloqueado"}</strong>
              </span>
            </div>
            
            {usuario.anfitriao?.dadosBancarios && (
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input 
                  label="Banco" 
                  value={usuario.anfitriao.dadosBancarios.banco} 
                  disabled 
                />
                <Input 
                  label="Agência" 
                  value={usuario.anfitriao.dadosBancarios.agencia} 
                  disabled 
                />
                <Input 
                  label="Conta" 
                  value={usuario.anfitriao.dadosBancarios.conta} 
                  disabled 
                />
                <Input 
                  label="Tipo de Conta" 
                  value={usuario.anfitriao.dadosBancarios.tipoConta === "corrente" ? "Corrente" : "Poupança"} 
                  disabled 
                />
              </div>
            )}
          </div>
        </Section>
      )}

      {/* Cards de Ações */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
        <Card 
          icon={<Lock size={28} className="text-sky-500" />} 
          title="Segurança"
          text="Altere sua senha ou veja dispositivos conectados"
          onClick={() => router.push("/locatario/seguranca")} 
        />

        <Card 
          icon={<Settings size={28} className="text-sky-500" />} 
          title="Preferências"
          text="Idioma, tema e notificações"
          onClick={() => router.push("/locatario/preferencias")} 
        />

        <Card 
          icon={<Heart size={28} className="text-sky-500" />} 
          title="Favoritos"
          text="Veja seus espaços favoritos"
          onClick={() => router.push("/favoritos")} 
        />

        <Card 
          icon={<LogOut size={28} className="text-red-500" />} 
          title="Sair da Conta"
          text="Desconecte-se da sua conta"
          danger
          onClick={() => setConfirmarLogout(true)} 
        />
      </div>

      {/* Modal Logout */}
      {confirmarLogout && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl w-full max-w-sm text-gray-900 dark:text-gray-100 shadow-xl">
            <h3 className="text-lg font-semibold mb-2">Sair da conta</h3>
            <p className="mb-6 text-gray-600 dark:text-gray-400">Tem certeza que deseja sair?</p>
            <div className="flex gap-3">
              <button 
                className="flex-1 border border-gray-300 dark:border-gray-600 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                onClick={() => setConfirmarLogout(false)}
              >
                Cancelar
              </button>
              <button 
                className="flex-1 bg-sky-500 hover:bg-sky-600 text-white py-2 rounded-lg transition-colors"
                onClick={handleLogout}
              >
                Sair
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ===================== AUX ===================== */

function Section({ title, children, editando, onEditar, onSalvar }: any) {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow mb-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-4">
        <h2 className="font-semibold text-lg">{title}</h2>
        {onEditar && (
          !editando ? (
            <button 
              onClick={onEditar} 
              className="text-sky-500 hover:text-sky-600 flex items-center gap-1 text-sm font-medium transition-colors"
            >
              <Edit3 size={16} /> Editar
            </button>
          ) : (
            <button 
              onClick={onSalvar} 
              className="text-green-600 hover:text-green-700 flex items-center gap-1 text-sm font-medium transition-colors"
            >
              <Save size={16} /> Salvar
            </button>
          )
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {children}
      </div>
    </div>
  );
}

function Input({ label, value, onChange, disabled, type = "text", mask }: any) {
  // Função simples para formatar valores (você pode implementar máscaras específicas depois)
  const formatValue = (val: string) => {
    if (!mask) return val;
    
    if (mask === "cpf") {
      return val.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
    }
    if (mask === "phone") {
      return val.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
    }
    if (mask === "cep") {
      return val.replace(/(\d{5})(\d{3})/, "$1-$2");
    }
    return val;
  };

  return (
    <div className="space-y-1">
      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
        {label}
      </label>
      <input
        type={type}
        value={formatValue(value)}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full border rounded-xl px-4 py-2.5 transition-colors
          bg-white text-gray-900 border-gray-300
          dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600
          ${disabled ? "bg-gray-100 dark:bg-gray-600 cursor-not-allowed" : "hover:border-gray-400 dark:hover:border-gray-500 focus:ring-2 focus:ring-sky-500 focus:outline-none"}
        `}
      />
    </div>
  );
}

function Card({ icon, title, text, onClick, danger }: any) {
  return (
    <button
      onClick={onClick}
      className={`w-full bg-white dark:bg-gray-800 p-6 rounded-2xl shadow hover:shadow-lg transition-all text-left group
        ${danger ? "hover:bg-red-50 dark:hover:bg-red-900/20" : "hover:bg-gray-50 dark:hover:bg-gray-700/50"}`}
    >
      <div className="flex flex-col items-center text-center">
        <div className="mb-3 transform group-hover:scale-110 transition-transform">
          {icon}
        </div>
        <h3 className={`font-semibold mb-1 ${danger ? "text-red-600 dark:text-red-400" : "text-gray-900 dark:text-gray-100"}`}>
          {title}
        </h3>
        <p className="text-gray-500 dark:text-gray-400 text-sm line-clamp-2">
          {text}
        </p>
      </div>
    </button>
  );
}