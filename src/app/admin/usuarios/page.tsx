"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

interface Usuario {
  id: string;

  name: string;
  email: string;

  telefone: string | null;
  cpf: string |null;

  cidade: string | null;
  estado: string | null;

  foto_url: string | null;

  roles: ("LOCATARIO" | "ANFITRIAO" | "ADMIN")[];

  created_at: string;

  quantidadeEspacos: number;
  quantidadeReservas: number;

  dadosRecebimento?: {
    tipo_recebimento: string;
    pix_tipo: string | null;
    pix_chave: string |null;
    banco: string | null;
    agencia: string | null;
    conta: string | null;
    titular: string | null;
  };
}

export default function UsuariosAdminPage() {
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [pesquisa, setPesquisa] = useState("");
  const [usuarioSelecionado, setUsuarioSelecionado] =
    useState<Usuario | null>(null);

    const [filtroRole, setFiltroRole] = useState<
  "TODOS" | "LOCATARIO" | "ANFITRIAO" | "ADMIN"
>("TODOS");

  useEffect(() => {
    carregarUsuarios();
  }, []);

  async function carregarUsuarios() {
    setLoading(true);
    setErro("");

    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const token = sessionData.session?.access_token;
      if (!token) throw new Error("Sua sessão expirou. Faça login novamente.");

      const response = await fetch("/api/admin/usuarios", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Erro ao carregar usuários.");

      setUsuarios(result.usuarios ?? []);
    } catch (error) {
      setUsuarios([]);
      setErro(error instanceof Error ? error.message : "Erro ao carregar usuários.");
    } finally {
      setLoading(false);
    }
  }

 const lista = usuarios.filter((u) => {

  const texto = pesquisa.toLowerCase();

  const correspondePesquisa =
    u.name?.toLowerCase().includes(texto) ||
    u.email?.toLowerCase().includes(texto);


const correspondeRole =
filtroRole === "TODOS" ||
u.roles?.includes(filtroRole)
  return correspondePesquisa && correspondeRole;
});

  if (loading) {
    return (
      <div className="p-10 text-center">
        Carregando usuários...
      </div>
    );
  }

  if (erro) {
    return (
      <div className="p-10 text-center">
        <p className="text-red-600 mb-4">{erro}</p>
        <button onClick={carregarUsuarios} className="bg-sky-500 text-white px-4 py-2 rounded-xl">
          Tentar novamente
        </button>
      </div>
    );
  }


  async function abrirUsuario(usuario: Usuario) {
  // Busca dados de recebimento
  const { data: recebimento } = await supabase
    .from("dados_recebimento")
    .select("*")
    .eq("user_id", usuario.id)
    .maybeSingle();

  // Conta espaços
  const { count: espacos } = await supabase
    .from("spaces")
    .select("*", { count: "exact", head: true })
    .eq("user_id", usuario.id);

  // Conta reservas
  const { count: reservas } = await supabase
    .from("reservas")
    .select("*", { count: "exact", head: true })
    .eq("user_id", usuario.id);

  setUsuarioSelecionado({
    ...usuario,
    dadosRecebimento: recebimento || undefined,
    quantidadeEspacos: espacos || 0,
    quantidadeReservas: reservas || 0,
  });
}

  return (
    <div className="max-w-5xl mx-auto p-6">

      <h1 className="text-3xl font-bold mb-6">
        Usuários
      </h1>

      <input
        type="text"
        placeholder="Pesquisar usuário..."
        value={pesquisa}
        onChange={(e) => setPesquisa(e.target.value)}
        className="w-full border rounded-xl p-3 mb-6"
      />

<div className="flex flex-wrap gap-3 mb-6">

  <button
    onClick={() => setFiltroRole("TODOS")}
    className={`px-4 py-2 rounded-xl text-sm ${
      filtroRole === "TODOS"
        ? "bg-sky-500 text-white"
        : "bg-gray-100"
    }`}
  >
    Todos
  </button>


  <button
    onClick={() => setFiltroRole("ANFITRIAO")}
    className={`px-4 py-2 rounded-xl text-sm ${
      filtroRole === "ANFITRIAO"
        ? "bg-green-500 text-white"
        : "bg-gray-100"
    }`}
  >
    Anfitriões
  </button>


  <button
    onClick={() => setFiltroRole("LOCATARIO")}
    className={`px-4 py-2 rounded-xl text-sm ${
      filtroRole === "LOCATARIO"
        ? "bg-blue-500 text-white"
        : "bg-gray-100"
    }`}
  >
    Locatários
  </button>


  <button
    onClick={() => setFiltroRole("ADMIN")}
    className={`px-4 py-2 rounded-xl text-sm ${
      filtroRole === "ADMIN"
        ? "bg-red-500 text-white"
        : "bg-gray-100"
    }`}
  >
    Admin
  </button>

</div>

      <div className="space-y-4">
  {lista.map((usuario) => (
    <div
      key={usuario.id}
      onClick={() => abrirUsuario(usuario)}
      className="bg-white rounded-2xl shadow hover:shadow-lg transition cursor-pointer p-5"
    >
      <div className="flex items-center justify-between">

        <div className="flex items-center gap-4">

          {usuario.foto_url ? (
            <img
              src={usuario.foto_url}
              className="w-16 h-16 rounded-full object-cover"
            />
          ) : (
            <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center text-2xl">
              👤
            </div>
          )}

          <div>

            <h2 className="font-bold text-lg">
              {usuario.name}
            </h2>

            <p className="text-gray-500">
              {usuario.email}
            </p>

            <p className="text-sm text-gray-400">
              {usuario.cidade || "-"} / {usuario.estado || "-"}
            </p>

            <div className="flex gap-2 mt-2 flex-wrap">

              {usuario.roles?.includes("LOCATARIO") && (
                <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs">
                  LOCATÁRIO
                </span>
              )}

              {usuario.roles?.includes("ANFITRIAO") && (
                <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs">
                  ANFITRIÃO
                </span>
              )}

              {usuario.roles?.includes("ADMIN") && (
                <span className="bg-red-100 text-red-700 px-2 py-1 rounded-full text-xs">
                  ADMIN
                </span>
              )}

            </div>

          </div>

        </div>

        <div className="text-right">

          <p className="text-xs text-gray-400">
            Cadastro
          </p>

          <p className="font-medium">
            {new Date(usuario.created_at).toLocaleDateString("pt-BR")}
          </p>

        </div>

      </div>
    </div>
  ))}
</div>

      {usuarioSelecionado && (

<div 
className="
fixed 
inset-0 
bg-black/50 
flex 
items-center 
justify-center 
z-50 
p-4
overflow-y-auto
"
>

  <div className="
    bg-white 
    rounded-2xl 
    w-full 
    max-w-lg 
    max-h-[90vh]
    overflow-y-auto
    p-6
    shadow-xl
  ">
            <div className="flex justify-between items-center mb-6">

              <h2 className="text-2xl font-bold">
                Informações
              </h2>

              <button
                onClick={() => setUsuarioSelecionado(null)}
                className="text-gray-500 text-xl"
              >
                ✕
              </button>

            </div>

            <div className="flex flex-col items-center mb-6">

              {usuarioSelecionado.foto_url ? (

                <img
                  src={usuarioSelecionado.foto_url}
                  className="w-24 h-24 rounded-full object-cover"
                />

              ) : (

                <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center text-3xl">
                  👤
                </div>

              )}

              <h3 className="text-xl font-bold mt-4">
                {usuarioSelecionado.name}
              </h3>

             <p className="text-gray-500">
  {usuarioSelecionado.roles?.join(" • ")}
</p>

            </div>

            <div className="space-y-3 text-sm">

              <Linha
                titulo="Email"
                valor={usuarioSelecionado.email}
              />

              <Linha
                titulo="Telefone"
                valor={usuarioSelecionado.telefone}
              />

              <Linha
                titulo="CPF"
                valor={usuarioSelecionado.cpf}
              />

              <Linha
                titulo="Cidade"
                valor={usuarioSelecionado.cidade}
              />

              <Linha
                titulo="Estado"
                valor={usuarioSelecionado.estado}
              />

              <Linha
                titulo="Cadastro"
                valor={new Date(
                  usuarioSelecionado.created_at
                ).toLocaleDateString("pt-BR")}
              />

              <Linha
  titulo="Espaços cadastrados"
  valor={usuarioSelecionado.quantidadeEspacos}
/>

<Linha
  titulo="Reservas"
  valor={usuarioSelecionado.quantidadeReservas}
/>

{usuarioSelecionado.dadosRecebimento && (
  <>
    <hr className="my-4" />

    <h3 className="font-semibold">
      Dados de Recebimento
    </h3>

    <Linha
      titulo="Forma"
      valor={usuarioSelecionado.dadosRecebimento.tipo_recebimento}
    />

    {usuarioSelecionado.dadosRecebimento.tipo_recebimento === "PIX" ? (
      <>
        <Linha
          titulo="Tipo da chave"
          valor={usuarioSelecionado.dadosRecebimento.pix_tipo}
        />

        <Linha
          titulo="Chave PIX"
          valor={usuarioSelecionado.dadosRecebimento.pix_chave}
        />
      </>
    ) : (
      <>
        <Linha
          titulo="Banco"
          valor={usuarioSelecionado.dadosRecebimento.banco}
        />

        <Linha
          titulo="Agência"
          valor={usuarioSelecionado.dadosRecebimento.agencia}
        />

        <Linha
          titulo="Conta"
          valor={usuarioSelecionado.dadosRecebimento.conta}
        />

        <Linha
          titulo="Titular"
          valor={usuarioSelecionado.dadosRecebimento.titular}
        />
      </>
    )}
  </>
)}
            </div>

          </div>

        </div>

      )}

    </div>
  );
}

function Linha({
  titulo,
  valor,
}: {
  titulo: string;
  valor: any;
}) {
  return (
    <div className="flex justify-between border-b pb-2">

      <span className="text-gray-500">
        {titulo}
      </span>

      <span className="font-medium">
        {valor || "-"}
      </span>

    </div>
  );
}
