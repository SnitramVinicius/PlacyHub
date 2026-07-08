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
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";

/* ===================== TIPOS ===================== */

interface Usuario {
  id: string;

  nome: string;
  email: string;
  telefone?: string;
  cpf?: string;
  dataNascimento?: string;
  fotoUrl?: string;
  dadosRecebimento: DadosRecebimento;

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
}

interface DadosRecebimento {
  tipoRecebimento: "PIX" | "CONTA";

  pixTipo?: string;
  pixChave?: string;

  banco?: string;
  agencia?: string;
  conta?: string;
  tipoConta?: "corrente" | "poupanca";
  titular?: string;
  cpfTitular?: string;
}

/* ===================== COMPONENTE ===================== */

export default function PerfilUsuario() {
  const router = useRouter();
  const { user, updateUser } = useAuth();
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [editando, setEditando] = useState(false);
  const [confirmarLogout, setConfirmarLogout] = useState(false);
useEffect(() => {
  async function carregarPerfil() {
    const dadosLocal = localStorage.getItem("placyhub_user_dev");
        
    if (!dadosLocal) {
      router.push("/login");
      return;
    }

    const userLocal = JSON.parse(dadosLocal);
    
    if (!userLocal.id) {
      console.error("❌ ID do usuário não encontrado!");
      router.push("/login");
      return;
    }
    
const { data: userData, error } = await supabase
  .from("users")
  .select("id, email, name, telefone, cidade, estado, cpf, data_nascimento, foto_url, cep, rua, numero, bairro, roles")
  .eq("id", userLocal.id)
  .single();

const { data: dadosRecebimento } = await supabase
  .from("dados_recebimento")
  .select("*")
  .eq("user_id", userLocal.id)
  .maybeSingle();

if (error) {
  console.error("Erro ao buscar dados:", error);
  setUsuario(userLocal);
  return;
}

const usuarioCompleto: Usuario = {
  id: userData.id,
  nome: userData.name,
  email: userData.email,
  telefone: userData.telefone || "",
  cpf: userData.cpf || "",
  dataNascimento: userData.data_nascimento || "",
  fotoUrl: userData.foto_url || "",
  dadosRecebimento: dadosRecebimento
  ? {
      tipoRecebimento: dadosRecebimento.tipo_recebimento as "PIX" | "CONTA",
      pixTipo: dadosRecebimento.pix_tipo || "",
      pixChave: dadosRecebimento.pix_chave || "",
      banco: dadosRecebimento.banco || "",
      agencia: dadosRecebimento.agencia || "",
      conta: dadosRecebimento.conta || "",
      tipoConta:
        (dadosRecebimento.tipo_conta as "corrente" | "poupanca") ||
        "corrente",
      titular: dadosRecebimento.titular || "",
      cpfTitular: dadosRecebimento.cpf_titular || "",
    }
  : {
      tipoRecebimento: "PIX",
      pixTipo: "",
      pixChave: "",
      banco: "",
      agencia: "",
      conta: "",
      tipoConta: "corrente",
      titular: "",
      cpfTitular: "",
    },
  endereco: {
    cep: userData.cep || "",
    rua: userData.rua || "",
    numero: userData.numero || "",
    bairro: userData.bairro || "",
    cidade: userData.cidade || "",
    estado: userData.estado || "",
  },
  roles: userData.roles || userLocal.roles || ["LOCATARIO"]
};

// Atualiza estado da página
setUsuario(usuarioCompleto);

// Atualiza o AuthContext
updateUser(usuarioCompleto);

// Atualiza o localStorage
localStorage.setItem(
  "placyhub_user_dev",
  JSON.stringify(usuarioCompleto)
);

// Atualiza o AuthContext
updateUser(usuarioCompleto);

// Atualiza o localStorage
localStorage.setItem(
  "placyhub_user_dev",
  JSON.stringify(usuarioCompleto)
);
  }

  carregarPerfil();
}, [router]);

  if (!usuario) return null;

const isAnfitriao =
  usuario.roles.includes("ANFITRIAO");

const handleFotoChange = async (e: ChangeEvent<HTMLInputElement>) => {
  if (!e.target.files?.[0]) return;
  if (!usuario) return;
  
  const file = e.target.files[0];
  
  // Validar tipo e tamanho
  if (!file.type.startsWith('image/')) {
    toast.error("Por favor, selecione uma imagem");
    return;
  }
  
  if (file.size > 2 * 1024 * 1024) { // 2MB
    toast.error("A imagem deve ter no máximo 2MB");
    return;
  }
  
  try {
    toast.loading("Enviando foto...");
    
    // Gerar nome único para o arquivo
    const extensao = file.name.split('.').pop();
    const nomeArquivo = `${usuario.id}-${Date.now()}.${extensao}`;
    
    // Fazer upload para o Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(nomeArquivo, file);
    
    if (uploadError) {
      console.error("Erro no upload:", uploadError);
      toast.error("Erro ao enviar foto");
      return;
    }
    
    // Pegar a URL pública
    const { data: urlData } = supabase.storage
      .from("avatars")
      .getPublicUrl(nomeArquivo);
    
    const fotoUrl = urlData.publicUrl;
    
    // Salvar URL no banco de dados
    const { error: updateError } = await supabase
      .from("users")
      .update({ foto_url: fotoUrl })
      .eq("id", usuario.id);
    
    if (updateError) {
      console.error("Erro ao salvar URL:", updateError);
      toast.error("Erro ao salvar foto");
      return;
    }
    
updateUser({ fotoUrl });
    
    // Atualizar estado local
    setUsuario({ ...usuario, fotoUrl });
    toast.dismiss();
    toast.success("Foto de perfil atualizada!");
    
  } catch (err) {
    console.error("Erro:", err);
    toast.error("Erro ao enviar foto");
  }
};

const handleSalvar = async () => {
  // Atualizar no Supabase
  const { error } = await supabase
    .from("users")
    .update({
      telefone: usuario.telefone,
      cpf: usuario.cpf,
      data_nascimento: usuario.dataNascimento,
      cidade: usuario.endereco?.cidade,
      estado: usuario.endereco?.estado,
          cep: usuario.endereco?.cep,       
    rua: usuario.endereco?.rua,       
    numero: usuario.endereco?.numero, 
    bairro: usuario.endereco?.bairro,  
    })
    .eq("id", usuario.id);

  if (error) {
    console.error("❌ Erro ao salvar:", error);
    toast.error("Erro ao salvar dados");
    return;
  }

const { error: erroRecebimento } = await supabase
  .from("dados_recebimento")
  .upsert(
    {
      user_id: usuario.id,

      tipo_recebimento:
        usuario.dadosRecebimento.tipoRecebimento,

      pix_tipo:
        usuario.dadosRecebimento.pixTipo,

      pix_chave:
        usuario.dadosRecebimento.pixChave,

      banco:
        usuario.dadosRecebimento.banco,

      agencia:
        usuario.dadosRecebimento.agencia,

      conta:
        usuario.dadosRecebimento.conta,

      tipo_conta:
        usuario.dadosRecebimento.tipoConta,

      titular:
        usuario.dadosRecebimento.titular,

      cpf_titular:
        usuario.dadosRecebimento.cpfTitular,
    },
    {
      onConflict: "user_id",
    }
  );

if (erroRecebimento) {
  console.error("Erro recebimento:", erroRecebimento);
  toast.error("Erro ao salvar dados de recebimento");
  return;
}

updateUser(usuario);

localStorage.setItem(
  "placyhub_user_dev",
  JSON.stringify(usuario)
);

setEditando(false);
toast.success("Dados salvos com sucesso!");
};

 const handleLogout = () => {
  localStorage.removeItem("placyhub_user_dev");  // 🔥 MUDOU AQUI
  sessionStorage.clear();
  router.push("/login");
};

// Função para formatar texto com primeira letra maiúscula
const capitalizarTexto = (texto: string) => {
  if (!texto) return texto;
  return texto
    .toLowerCase()
    .split(' ')
    .map(palavra => palavra.charAt(0).toUpperCase() + palavra.slice(1))
    .join(' ');
};

// Função para formatar rua (mantém números)
const formatarRua = (texto: string) => {
  if (!texto) return texto;
  // Separa números e letras, capitaliza apenas as letras
  return texto.replace(/([A-Za-zÀ-ÖØ-öø-ÿ]+)/g, (palavra) => 
    palavra.charAt(0).toUpperCase() + palavra.slice(1).toLowerCase()
  );
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
            {isAnfitriao && (
  <div className="inline-flex items-center gap-1 mt-2 px-3 py-1 bg-sky-100 dark:bg-sky-900 text-sky-700 dark:text-sky-300 rounded-full text-sm">
    <BadgeCheck size={16} />
    <span>Anfitrião</span>
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
    setUsuario({ 
      ...usuario, 
      endereco: { 
        ...usuario.endereco, 
        rua: editando ? formatarRua(v) : v  // 🔥 Formata ao digitar
      } 
    })
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
    setUsuario({ 
      ...usuario, 
      endereco: { 
        ...usuario.endereco, 
        bairro: editando ? capitalizarTexto(v) : v  // 🔥 Formata ao digitar
      } 
    })
  } 
/>
<Input 
  label="Cidade" 
  value={usuario.endereco?.cidade || ""} 
  disabled={!editando}
  onChange={(v: string) =>
    setUsuario({ 
      ...usuario, 
      endereco: { 
        ...usuario.endereco, 
        cidade: editando ? capitalizarTexto(v) : v  // 🔥 Formata ao digitar
      } 
    })
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

     {/* Dados para Recebimento */}
{isAnfitriao && (
  <Section
    title="Dados para Recebimento"
    editando={editando}
    onEditar={() => setEditando(true)}
    onSalvar={handleSalvar}
  >
    <div className="md:col-span-2">
      <label className="text-sm font-medium">
        Forma de Recebimento
      </label>

      <select
        className="w-full border rounded-xl px-4 py-2 mt-1"
        disabled={!editando}
        value={usuario.dadosRecebimento?.tipoRecebimento || "PIX"}
        onChange={(e) => {
  const tipo = e.target.value as "PIX" | "CONTA";

  setUsuario({
    ...usuario,
    dadosRecebimento:
      tipo === "PIX"
        ? {
            tipoRecebimento: "PIX",
            pixTipo: "",
            pixChave: "",

            banco: "",
            agencia: "",
            conta: "",
            tipoConta: "corrente",
            titular: "",
            cpfTitular: "",
          }
        : {
            tipoRecebimento: "CONTA",

            pixTipo: "",
            pixChave: "",

            banco: "",
            agencia: "",
            conta: "",
            tipoConta: "corrente",
            titular: "",
            cpfTitular: "",
          },
  });
}}
      >
        <option value="PIX">PIX</option>
        <option value="CONTA">Conta Bancária</option>
      </select>
    </div>

    {usuario.dadosRecebimento.tipoRecebimento === "PIX"? (
      <>
        <div>
  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
    Tipo da Chave PIX
  </label>

  <select
    disabled={!editando}
    value={usuario.dadosRecebimento.pixTipo || ""}
    onChange={(e) =>
      setUsuario({
        ...usuario,
        dadosRecebimento: {
          ...usuario.dadosRecebimento,
          pixTipo: e.target.value,
        },
      })
    }
    className={`w-full border rounded-xl px-4 py-2.5 mt-1
      bg-white text-gray-900 border-gray-300
      dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600
      ${
        !editando
          ? "bg-gray-100 dark:bg-gray-600 cursor-not-allowed"
          : "hover:border-gray-400 dark:hover:border-gray-500 focus:ring-2 focus:ring-sky-500 focus:outline-none"
      }`}
  >
    <option value="">Selecione...</option>
    <option value="CPF">CPF</option>
    <option value="CELULAR">Celular</option>
    <option value="EMAIL">E-mail</option>
    <option value="ALEATORIA">Chave Aleatória</option>
  </select>
</div>

        <Input
          label="Chave PIX"
          value={usuario.dadosRecebimento?.pixChave || ""}
          disabled={!editando}
          onChange={(v: string) =>
  setUsuario({
    ...usuario,
    dadosRecebimento: {
  ...usuario.dadosRecebimento,
  pixChave: v,
},
  })
}
        />
      </>
    ) : (
      <>
        <Input
          label="Banco"
          value={usuario.dadosRecebimento?.banco || ""}
          disabled={!editando}
          onChange={(v: string) =>
  setUsuario({
    ...usuario,
    dadosRecebimento: {
  ...usuario.dadosRecebimento,
  banco: v,
},
  })
}
        />

        <Input
          label="Agência"
          value={usuario.dadosRecebimento?.agencia || ""}
          disabled={!editando}
          onChange={(v: string) =>
  setUsuario({
    ...usuario,
    dadosRecebimento: {
  ...usuario.dadosRecebimento,
  agencia: v,
},
  })
}
        />

        <Input
          label="Conta"
          value={usuario.dadosRecebimento?.conta || ""}
          disabled={!editando}
          onChange={(v: string) =>
  setUsuario({
    ...usuario,
    dadosRecebimento: {
  ...usuario.dadosRecebimento,
  conta: v,
},
  })
}
        />
        
        <div>
  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
    Tipo da Conta
  </label>

  <select
    disabled={!editando}
    value={usuario.dadosRecebimento.tipoConta || "corrente"}
    onChange={(e) =>
      setUsuario({
        ...usuario,
        dadosRecebimento: {
          ...usuario.dadosRecebimento,
          tipoConta: e.target.value as "corrente" | "poupanca",
        },
      })
    }
    className={`w-full border rounded-xl px-4 py-2.5 mt-1
      bg-white text-gray-900 border-gray-300
      dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600
      ${
        !editando
          ? "bg-gray-100 dark:bg-gray-600 cursor-not-allowed"
          : "hover:border-gray-400 dark:hover:border-gray-500 focus:ring-2 focus:ring-sky-500 focus:outline-none"
      }`}
  >
    <option value="corrente">Conta Corrente</option>
    <option value="poupanca">Conta Poupança</option>
  </select>
</div>

        <Input
          label="Titular"
          value={usuario.dadosRecebimento?.titular || ""}
          disabled={!editando}
         onChange={(v: string) =>
  setUsuario({
    ...usuario,
    dadosRecebimento: {
  ...usuario.dadosRecebimento,
  titular: v,
},
  })
}
        />

        <Input
          label="CPF do Titular"
          value={usuario.dadosRecebimento?.cpfTitular || ""}
          disabled={!editando}
          onChange={(v: string) =>
  setUsuario({
    ...usuario,
    dadosRecebimento: {
  ...usuario.dadosRecebimento,
  cpfTitular: v,
},
  })
}
        />
      </>
    )}
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