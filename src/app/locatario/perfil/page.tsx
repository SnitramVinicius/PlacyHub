"use client";

import { useState, ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import { Camera, Edit3, Lock, CreditCard, Settings, LogOut, Save } from "lucide-react";
import { Toaster, toast } from "sonner";

export default function PerfilUsuario() {
  const router = useRouter();

  const [nome, setNome] = useState("Vinicius Martins");
  const [email, setEmail] = useState("vinicius@email.com");
  const [telefone, setTelefone] = useState("(67) 99999-9999");
  const [nascimento, setNascimento] = useState("1999-01-01");
  const [foto, setFoto] = useState<string | null>(null);
  const [editando, setEditando] = useState(false);

  // 🔥 Estado para abrir o modal
  const [confirmarLogout, setConfirmarLogout] = useState(false);

  const handleFotoChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFoto(URL.createObjectURL(e.target.files[0]));
      toast.success("Foto de perfil atualizada!");
    }
  };

  const handleSalvar = () => {
    setEditando(false);
    toast.success("Informações atualizadas com sucesso!");
  };

  const handleLogout = () => {
    // ⚠️ Aqui você coloca sua lógica de logout real (remover token, limpar storage etc)
    localStorage.clear();
    sessionStorage.clear();

    router.push("/login");
  };

  return (
    <div className="p-6 relative">
      <Toaster position="top-right" richColors />

      <h1 className="text-2xl font-bold mb-6">Meu Perfil</h1>

      {/* Cabeçalho com foto */}
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
          <h2 className="text-xl font-semibold">{nome}</h2>
          <p className="text-gray-600">{email}</p>
          <p className="text-gray-500 text-sm">Membro desde abril de 2025</p>
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
          <div>
            <label className="block text-sm text-gray-700">Nome completo</label>
            <input
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              disabled={!editando}
              className={`w-full border border-gray-300 rounded-xl px-3 py-2 focus:ring-2 focus:ring-sky-500 outline-none ${
                !editando ? "bg-gray-100 cursor-not-allowed" : ""
              }`}
            />
          </div>

          <div>
            <label className="block text-sm text-gray-700">E-mail</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={!editando}
              className={`w-full border border-gray-300 rounded-xl px-3 py-2 focus:ring-2 focus:ring-sky-500 outline-none ${
                !editando ? "bg-gray-100 cursor-not-allowed" : ""
              }`}
            />
          </div>

          <div>
            <label className="block text-sm text-gray-700">Telefone</label>
            <input
              type="tel"
              value={telefone}
              onChange={(e) => setTelefone(e.target.value)}
              disabled={!editando}
              className={`w-full border border-gray-300 rounded-xl px-3 py-2 focus:ring-2 focus:ring-sky-500 outline-none ${
                !editando ? "bg-gray-100 cursor-not-allowed" : ""
              }`}
            />
          </div>

          <div>
            <label className="block text-sm text-gray-700">Data de Nascimento</label>
            <input
              type="date"
              value={nascimento}
              onChange={(e) => setNascimento(e.target.value)}
              disabled={!editando}
              className={`w-full border border-gray-300 rounded-xl px-3 py-2 focus:ring-2 focus:ring-sky-500 outline-none ${
                !editando ? "bg-gray-100 cursor-not-allowed" : ""
              }`}
            />
          </div>
        </div>
      </div>

      {/* Segurança e Pagamentos */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white p-6 rounded-2xl shadow flex flex-col items-center text-center hover:shadow-md transition">
          <Lock className="text-sky-500 mb-2" size={32} />
          <h3 className="font-semibold mb-1">Segurança</h3>
          <p className="text-gray-500 text-sm mb-3">
            Altere sua senha ou veja dispositivos conectados.
          </p>
          <button
            onClick={() => router.push("/locatario/seguranca")}
            className="text-sky-500 hover:text-sky-600 font-medium"
          >
            Gerenciar
          </button>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow flex flex-col items-center text-center hover:shadow-md transition">
          <CreditCard className="text-sky-500 mb-2" size={32} />
          <h3 className="font-semibold mb-1">Pagamentos</h3>
          <p className="text-gray-500 text-sm mb-3">
            Adicione, remova ou atualize seus métodos de pagamento.
          </p>
          <button
            onClick={() => router.push("/locatario/pagamentos")}
            className="text-sky-500 hover:text-sky-600 font-medium"
          >
            Gerenciar
          </button>
        </div>
      </div>

      {/* Preferências e Logout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow flex flex-col items-center text-center hover:shadow-md transition">
          <Settings className="text-sky-500 mb-2" size={32} />
          <h3 className="font-semibold mb-1">Preferências</h3>
          <p className="text-gray-500 text-sm mb-3">
            Idioma, tema e notificações.
          </p>
          <button
            onClick={() => router.push("/locatario/preferencias")}
            className="text-sky-500 hover:text-sky-600 font-medium"
          >
            Configurar
          </button>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow flex flex-col items-center text-center hover:shadow-md transition">
          <LogOut className="text-red-500 mb-2" size={32} />
          <h3 className="font-semibold mb-1 text-red-600">Sair da Conta</h3>
          <p className="text-gray-500 text-sm mb-3">Desconecte-se da sua conta com segurança.</p>
          <button
            onClick={() => setConfirmarLogout(true)}
            className="text-red-500 hover:text-red-600 font-medium"
          >
            Sair
          </button>
        </div>
      </div>

      {/* 🔥 MODAL DE CONFIRMAÇÃO — estilo Airbnb com animação */}
      {confirmarLogout && (
        <div className="fixed inset-0 bg-white/10 backdrop-blur-sm flex items-center justify-center p-4 z-50">

          <div
            className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-sm animate-[fadeIn_0.2s_ease,scaleUp_0.2s_ease]"
            style={{
              animation: "fadeIn 0.2s ease, scaleUp 0.2s ease",
            }}
          >
            <h3 className="font-semibold text-lg mb-2 text-center">Sair da conta?</h3>
            <p className="text-gray-600 text-sm text-center mb-6">
              Tem certeza de que deseja sair do PlacyHub?
            </p>

            <div className="flex items-center justify-between">
              <button
                onClick={() => setConfirmarLogout(false)}
                className="px-4 py-2 rounded-xl border hover:bg-gray-100 transition w-[48%]"
              >
                Cancelar
              </button>

<button
  onClick={handleLogout}
  className="px-4 py-2 bg-sky-500 text-white rounded-xl hover:bg-sky-600 transition w-[48%]"
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
