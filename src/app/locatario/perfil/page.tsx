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
    <div className="p-6 relative">
      <h1 className="text-2xl font-bold mb-6">Meu Perfil</h1>

      {/* Cabeçalho */}
      <div className="bg-white p-6 rounded-2xl shadow mb-6 flex flex-col md:flex-row gap-6">
        <div className="relative">
          <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-200">
            {usuario.fotoUrl ? (
              <img src={usuario.fotoUrl} className="w-full h-full object-cover" />
            ) : (
              <span className="flex h-full items-center justify-center text-gray-400">
                Sem foto
              </span>
            )}
          </div>
          <label className="absolute bottom-0 right-0 bg-sky-500 p-2 rounded-full cursor-pointer">
            <Camera size={18} className="text-white" />
            <input type="file" hidden onChange={handleFotoChange} />
          </label>
        </div>

        <div>
          <h2 className="text-xl font-semibold">{usuario.nome}</h2>
          <p className="text-gray-600">{usuario.email}</p>
        </div>
      </div>

      {/* Dados pessoais */}
      <Section
        title="Dados Pessoais"
        editando={editando}
        onEditar={() => setEditando(true)}
        onSalvar={handleSalvar}
      >
        <Input label="Nome" value={usuario.nome} disabled={!editando}
          onChange={(v) => setUsuario({ ...usuario, nome: v })} />

        <Input label="CPF" value={usuario.cpf || ""} disabled={!editando}
          onChange={(v) => setUsuario({ ...usuario, cpf: v })} />

        <Input label="Telefone" value={usuario.telefone || ""} disabled={!editando}
          onChange={(v) => setUsuario({ ...usuario, telefone: v })} />
      </Section>

      {/* Endereço */}
      <Section title="Endereço">
        <Input label="CEP" value={usuario.endereco?.cep || ""} disabled={!editando}
          onChange={(v) =>
            setUsuario({ ...usuario, endereco: { ...usuario.endereco, cep: v } })
          } />
        <Input label="Cidade" value={usuario.endereco?.cidade || ""} disabled={!editando}
          onChange={(v) =>
            setUsuario({ ...usuario, endereco: { ...usuario.endereco, cidade: v } })
          } />
        <Input label="Estado" value={usuario.endereco?.estado || ""} disabled={!editando}
          onChange={(v) =>
            setUsuario({ ...usuario, endereco: { ...usuario.endereco, estado: v } })
          } />
      </Section>

      {/* Dados do Anfitrião */}
      {isAnfitriao && (
        <Section title="Dados do Anfitrião">
          <div className="flex items-center gap-2 text-sky-600">
            <BadgeCheck size={18} />
            Status: <strong>{usuario.anfitriao?.status}</strong>
          </div>
        </Section>
      )}

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <Card icon={<Lock size={32} className="text-sky-500" />} title="Segurança"
          text="Altere sua senha ou veja dispositivos conectados."
          onClick={() => router.push("/locatario/seguranca")} />

        <Card icon={<Settings size={32} className="text-sky-500" />} title="Preferências"
          text="Idioma, tema e notificações."
          onClick={() => router.push("/locatario/preferencias")} />

        <Card icon={<Heart size={32} className="text-sky-500" />} title="Favoritos"
          text="Veja seus espaços favoritos."
          onClick={() => router.push("/favoritos")} />

        <Card icon={<LogOut size={32} className="text-red-500" />} title="Sair da Conta"
          text="Desconecte-se da sua conta."
          danger
          onClick={() => setConfirmarLogout(true)} />
      </div>

      {/* Modal Logout */}
      {confirmarLogout && (
        <div className="fixed inset-0 bg-black/20 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl w-full max-w-sm">
            <p className="mb-4">Deseja sair da conta?</p>
            <div className="flex gap-3">
              <button className="w-1/2 border py-2 rounded"
                onClick={() => setConfirmarLogout(false)}>
                Cancelar
              </button>
              <button className="w-1/2 bg-sky-500 text-white py-2 rounded"
                onClick={handleLogout}>
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
    <div className="bg-white p-6 rounded-2xl shadow mb-6">
      <div className="flex justify-between mb-4">
        <h2 className="font-semibold">{title}</h2>
        {onEditar && (
          !editando ? (
            <button onClick={onEditar} className="text-sky-500 flex gap-1">
              <Edit3 size={16} /> Editar
            </button>
          ) : (
            <button onClick={onSalvar} className="text-green-600 flex gap-1">
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

function Input({ label, value, onChange, disabled, type = "text" }: any) {
  return (
    <div>
      <label className="text-sm text-gray-700">{label}</label>
      <input
        type={type}
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full border rounded-xl px-3 py-2 ${
          disabled ? "bg-gray-100" : ""
        }`}
      />
    </div>
  );
}

function Card({ icon, title, text, onClick, danger }: any) {
  return (
    <div
      onClick={onClick}
      className={`bg-white p-6 rounded-2xl shadow cursor-pointer text-center ${
        danger ? "text-red-600" : ""
      }`}
    >
      {icon}
      <h3 className="font-semibold mt-2">{title}</h3>
      <p className="text-gray-500 text-sm">{text}</p>
    </div>
  );
}
