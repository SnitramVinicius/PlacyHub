// app/perfil/page.tsx
"use client";

import { useState, ChangeEvent } from "react";

export default function PerfilPage() {
  // Informações pessoais
  const [nome, setNome] = useState("Vinicius Martins");
  const [email, setEmail] = useState("vinicius@email.com");
  const [telefone, setTelefone] = useState("(67) 99999-9999");
  const [cpf, setCpf] = useState("000.000.000-00");

  // Foto de perfil
  const [fotoPerfil, setFotoPerfil] = useState<File | null>(null);
  const [previewFoto, setPreviewFoto] = useState<string | null>(null);

  const handleFotoChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFotoPerfil(e.target.files[0]);
      setPreviewFoto(URL.createObjectURL(e.target.files[0]));
    }
  };

  // Dados financeiros
  const [banco, setBanco] = useState("Banco do Brasil");
  const [agencia, setAgencia] = useState("1234");
  const [conta, setConta] = useState("56789-0");
  const [titular, setTitular] = useState("Vinicius Martins");

  // Segurança
  const [senhaAtual, setSenhaAtual] = useState("");
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");

  // Documentos
  const [rg, setRg] = useState<File | null>(null);
  const [cnh, setCnh] = useState<File | null>(null);
  const [comprovante, setComprovante] = useState<File | null>(null);

  const handleDocumentoChange = (
    e: ChangeEvent<HTMLInputElement>,
    tipo: "rg" | "cnh" | "comprovante"
  ) => {
    if (e.target.files && e.target.files[0]) {
      if (tipo === "rg") setRg(e.target.files[0]);
      if (tipo === "cnh") setCnh(e.target.files[0]);
      if (tipo === "comprovante") setComprovante(e.target.files[0]);
    }
  };

  return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Meu Perfil</h1>

        {/* Foto de perfil */}
        <div className="bg-white p-6 rounded-2xl shadow mb-6 flex flex-col md:flex-row items-center gap-6">
          <div>
            <p className="font-semibold mb-2">Foto de Perfil</p>
            <div className="w-32 h-32 bg-gray-200 rounded-full overflow-hidden flex items-center justify-center">
              {previewFoto ? (
                <img src={previewFoto} alt="Perfil" className="w-full h-full object-cover" />
              ) : (
                <span className="text-gray-400">Sem foto</span>
              )}
            </div>
            <input
              type="file"
              accept="image/*"
              className="mt-2"
              onChange={handleFotoChange}
            />
          </div>
        </div>

        {/* Informações Pessoais */}
        <div className="bg-white p-6 rounded-2xl shadow mb-6">
          <h2 className="text-lg font-semibold mb-4">Informações Pessoais</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-700">Nome completo</label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded-xl px-3 py-2 focus:ring-2 focus:ring-sky-500 outline-none"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm text-gray-700">E-mail</label>
              <input
                type="email"
                className="w-full border border-gray-300 rounded-xl px-3 py-2 focus:ring-2 focus:ring-sky-500 outline-none"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm text-gray-700">Telefone</label>
              <input
                type="tel"
                className="w-full border border-gray-300 rounded-xl px-3 py-2 focus:ring-2 focus:ring-sky-500 outline-none"
                value={telefone}
                onChange={(e) => setTelefone(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm text-gray-700">CPF</label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded-xl px-3 py-2 focus:ring-2 focus:ring-sky-500 outline-none"
                value={cpf}
                onChange={(e) => setCpf(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Dados Financeiros */}
        <div className="bg-white p-6 rounded-2xl shadow mb-6">
          <h2 className="text-lg font-semibold mb-4">Dados Financeiros</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-700">Banco</label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded-xl px-3 py-2 focus:ring-2 focus:ring-sky-500 outline-none"
                value={banco}
                onChange={(e) => setBanco(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm text-gray-700">Agência</label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded-xl px-3 py-2 focus:ring-2 focus:ring-sky-500 outline-none"
                value={agencia}
                onChange={(e) => setAgencia(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm text-gray-700">Conta</label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded-xl px-3 py-2 focus:ring-2 focus:ring-sky-500 outline-none"
                value={conta}
                onChange={(e) => setConta(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm text-gray-700">Titular</label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded-xl px-3 py-2 focus:ring-2 focus:ring-sky-500 outline-none"
                value={titular}
                onChange={(e) => setTitular(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Segurança */}
        <div className="bg-white p-6 rounded-2xl shadow mb-6">
          <h2 className="text-lg font-semibold mb-4">Segurança</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-700">Senha Atual</label>
              <input
                type="password"
                className="w-full border border-gray-300 rounded-xl px-3 py-2 focus:ring-2 focus:ring-sky-500 outline-none"
                value={senhaAtual}
                onChange={(e) => setSenhaAtual(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm text-gray-700">Nova Senha</label>
              <input
                type="password"
                className="w-full border border-gray-300 rounded-xl px-3 py-2 focus:ring-2 focus:ring-sky-500 outline-none"
                value={novaSenha}
                onChange={(e) => setNovaSenha(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm text-gray-700">Confirmar Nova Senha</label>
              <input
                type="password"
                className="w-full border border-gray-300 rounded-xl px-3 py-2 focus:ring-2 focus:ring-sky-500 outline-none"
                value={confirmarSenha}
                onChange={(e) => setConfirmarSenha(e.target.value)}
              />
            </div>
          </div>
        </div>

       {/* Upload de documentos */}
<div className="bg-white p-6 rounded-2xl shadow mb-6">
  <h2 className="text-lg font-semibold mb-4">Documentos</h2>

  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
    {/* RG */}
    <div>
      <label className="block text-sm text-gray-700 mb-2">RG</label>
      <label className="flex items-center justify-center bg-sky-500 hover:bg-sky-600 text-white text-sm font-semibold py-2 px-4 rounded-xl cursor-pointer transition">
        Selecionar arquivo
        <input
          type="file"
          onChange={(e) => handleDocumentoChange(e, "rg")}
          className="hidden"
        />
      </label>
      {rg && <p className="text-green-600 mt-2 text-sm">{rg.name}</p>}
    </div>

    {/* CNH */}
    <div>
      <label className="block text-sm text-gray-700 mb-2">CNH</label>
      <label className="flex items-center justify-center bg-sky-500 hover:bg-sky-600 text-white text-sm font-semibold py-2 px-4 rounded-xl cursor-pointer transition">
        Selecionar arquivo
        <input
          type="file"
          onChange={(e) => handleDocumentoChange(e, "cnh")}
          className="hidden"
        />
      </label>
      {cnh && <p className="text-green-600 mt-2 text-sm">{cnh.name}</p>}
    </div>

    {/* Comprovante de Endereço */}
    <div>
      <label className="block text-sm text-gray-700 mb-2">
        Comprovante de Endereço
      </label>
      <label className="flex items-center justify-center bg-sky-500 hover:bg-sky-600 text-white text-sm font-semibold py-2 px-4 rounded-xl cursor-pointer transition">
        Selecionar arquivo
        <input
          type="file"
          onChange={(e) => handleDocumentoChange(e, "comprovante")}
          className="hidden"
        />
      </label>
      {comprovante && (
        <p className="text-green-600 mt-2 text-sm">{comprovante.name}</p>
      )}
    </div>
  </div>
</div>


        <button className="bg-sky-500 text-white px-6 py-3 rounded-xl hover:bg-sky-600 transition">
          Salvar Alterações
        </button>
      </div>
  );
}
