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
  Heart
} from "lucide-react";
import { Toaster, toast } from "sonner";

interface Usuario {
  nome: string;
  email: string;
  telefone?: string;
  cidade?: string;
  estado?: string;
  dataNascimento?: string;
  roles: string[];
}

export default function PerfilUsuario() {
  const router = useRouter();

  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [foto, setFoto] = useState<string | null>(null);
  const [editando, setEditando] = useState(false);
  const [confirmarLogout, setConfirmarLogout] = useState(false);

  // 🔹 Carregar dados do localStorage
  useEffect(() => {
    const dados = localStorage.getItem("usuario");

    if (!dados) {
      router.push("/login");
      return;
    }

    setUsuario(JSON.parse(dados));
  }, [router]);

  const handleFotoChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFoto(URL.createObjectURL(e.target.files[0]));
      toast.success("Foto de perfil atualizada!");
    }
  };

  const handleSalvar = () => {
    if (!usuario) return;

    localStorage.setItem("usuario", JSON.stringify(usuario));
    setEditando(false);
    toast.success("Informações atualizadas com sucesso!");
  };

  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    router.push("/login");
  };

  if (!usuario) return null;

  return (
    <div className="p-6 relative">
      <Toaster position="top-right" richColors />

      <h1 className="text-2xl font-bold mb-6">Meu Perfil</h1>

      {/* Cabeçalho */}
      <div className="bg-white p-6 rounded-2xl shadow mb-6 flex flex-col md:flex-row items-center md:items-start gap-6">
        <div className="relative">
          <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
            {foto ? (
              <img src={foto} alt="Foto de perfil" className="w-full h-full object-cover" />
            ) : (
              <span className="text-gray-400">Sem foto</span>
            )}
          </div>
          <label className="absolute bottom-0 right-0 bg-sky-500 hover:bg-sky-600 text-white p-2 rounded-full cursor-pointer transition">
            <Camera size={18} />
            <input type="file" accept="image/*" onChange={handleFotoChange} className="hidden" />
          </label>
        </div>

        <div className="flex-1 text-center md:text-left">
          <h2 className="text-xl font-semibold">{usuario.nome}</h2>
          <p className="text-gray-600">{usuario.email}</p>
          <p className="text-gray-500 text-sm">Membro do PlacyHub</p>
        </div>
      </div>

      {/* Informações pessoais */}
      <div className="bg-white p-6 rounded-2xl shadow mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Informações Pessoais</h2>

          {!editando ? (
            <button
              onClick={() => setEditando(true)}
              className="text-sky-500 hover:text-sky-600 flex items-center gap-1"
            >
              <Edit3 size={16} /> Editar
            </button>
          ) : (
            <button
              onClick={handleSalvar}
              className="text-green-600 hover:text-green-700 flex items-center gap-1"
            >
              <Save size={16} /> Salvar
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Nome completo"
            value={usuario.nome}
            disabled={!editando}
            onChange={(v) => setUsuario({ ...usuario, nome: v })}
          />

          <Input
            label="E-mail"
            value={usuario.email}
            disabled={!editando}
            onChange={(v) => setUsuario({ ...usuario, email: v })}
          />

          <Input
            label="Telefone"
            value={usuario.telefone || ""}
            disabled={!editando}
            onChange={(v) => setUsuario({ ...usuario, telefone: v })}
          />

          <Input
            label="Data de Nascimento"
            type="date"
            value={usuario.dataNascimento || ""}
            disabled={!editando}
            onChange={(v) => setUsuario({ ...usuario, dataNascimento: v })}
          />
        </div>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <Card
          icon={<Lock size={32} className="text-sky-500" />}
          title="Segurança"
          text="Altere sua senha ou veja dispositivos conectados."
          onClick={() => router.push("/locatario/seguranca")}
        />

        <Card
          icon={<Settings size={32} className="text-sky-500" />}
          title="Preferências"
          text="Idioma, tema e notificações."
          onClick={() => router.push("/locatario/preferencias")}
        />

        <Card
          icon={<Heart size={32} className="text-sky-500" />}
          title="Favoritos"
          text="Veja todos os espaços que você favoritou."
          onClick={() => router.push("/favoritos")}
        />

        <Card
          icon={<LogOut size={32} className="text-red-500" />}
          title="Sair da Conta"
          text="Desconecte-se da sua conta com segurança."
          danger
          onClick={() => setConfirmarLogout(true)}
        />
      </div>

      {/* Modal Logout */}
      {confirmarLogout && (
        <div className="fixed inset-0 bg-white/10 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-sm">
            <h3 className="font-semibold text-lg mb-2 text-center">Sair da conta?</h3>
            <p className="text-gray-600 text-sm text-center mb-6">
              Tem certeza que deseja sair?
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setConfirmarLogout(false)}
                className="w-1/2 border rounded-xl py-2"
              >
                Cancelar
              </button>
              <button
                onClick={handleLogout}
                className="w-1/2 bg-sky-500 text-white rounded-xl py-2"
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

/* 🔹 Componentes auxiliares */
function Input({
  label,
  value,
  onChange,
  disabled,
  type = "text"
}: any) {
  return (
    <div>
      <label className="block text-sm text-gray-700">{label}</label>
      <input
        type={type}
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full border rounded-xl px-3 py-2 focus:ring-2 focus:ring-sky-500 outline-none ${
          disabled ? "bg-gray-100 cursor-not-allowed" : ""
        }`}
      />
    </div>
  );
}

function Card({ icon, title, text, onClick, danger }: any) {
  return (
    <div
      className={`bg-white p-6 rounded-2xl shadow flex flex-col items-center text-center hover:shadow-md transition cursor-pointer ${
        danger ? "text-red-600" : ""
      }`}
      onClick={onClick}
    >
      {icon}
      <h3 className="font-semibold mt-2 mb-1">{title}</h3>
      <p className="text-gray-500 text-sm">{text}</p>
    </div>
  );
}
