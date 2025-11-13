"use client";
import Navbar from "@/components/navbar";
import { Heart } from "lucide-react";
import Link from "next/link";

interface Espaco {
  id: string;
  imagem: string;
  nome: string;
  preco: string;
  duracao: string;
  avaliacao: number;
}

const espacosIndicados: Espaco[] = [
  { id:"1", imagem: "/1.jpg", nome: "Salão de Festas Salagadum Buffet", preco: "R$ 500,00", duracao: "5 horas de festa", avaliacao: 4.0 },
  { id:"2", imagem: "/2.jpg", nome: "Espaço Alegria Kids", preco: "R$ 480,00", duracao: "5 horas", avaliacao: 4.5 },
  { id:"3", imagem: "/3.jpg", nome: "Chácara Recanto Feliz", preco: "R$ 650,00", duracao: "6 horas", avaliacao: 4.8 },
  { id:"4", imagem: "/4.jpeg", nome: "Espaço Estrela", preco: "R$ 700,00", duracao: "6 horas", avaliacao: 4.7 },
  { id:"5", imagem: "/5.jpeg", nome: "Buffet Infantil Encanto", preco: "R$ 520,00", duracao: "5 horas", avaliacao: 4.6 },
  { id:"6", imagem: "/1.jpg", nome: "Salão Premium", preco: "R$ 600,00", duracao: "5 horas", avaliacao: 4.3 },
];

const espacosDestaque = [...espacosIndicados];
const espacosDisponiveis = [...espacosIndicados];

export default function Home() {
  const renderSection = (titulo: string, lista: Espaco[]) => (
    <>
      <div className="flex justify-center">
        <h1 className="font-bold text-2xl mt-10 mb-10">{titulo}</h1>
      </div>
      <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6 px-6 md:px-10 lg:px-10 justify-items-center">
        {lista.map((espaco) => (
          <Link key={espaco.id} href={`/espaco/${espaco.id}`}>
            <div className="bg-white w-full max-w-[300px] rounded-sm shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition">
              <div className="relative">
                <img
                  src={espaco.imagem}
                  alt={espaco.nome}
                  className="w-full h-[160px] object-cover"
                />
                <button className="absolute top-2 right-2 bg-white/80 hover:bg-white rounded-full p-2 shadow-sm transition">
                  <Heart size={20} className="text-[#02aeee]" />
                </button>
              </div>
              <div className="p-3">
                <div className="flex justify-between items-center">
                  <p className="font-semibold text-[14px]">{espaco.nome}</p>
                  <div className="flex items-center gap-1">
                    <span className="text-gray-700 text-sm">⭐</span>
                    <p className="text-gray-700 text-sm font-medium">
                      {espaco.avaliacao}
                    </p>
                  </div>
                </div>
                <p className="text-gray-500 text-sm mt-1">
                  {espaco.preco} • {espaco.duracao}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </section>
    </>
  );

  return (
    <>
      {/* <Navbar /> */}
      {renderSection("Indicações da PlacyHub", espacosIndicados)}
      {renderSection("Espaços em destaque", espacosDestaque)}
      {renderSection("Espaços disponíveis para este fim de semana", espacosDisponiveis)}

      <section>
        <div className="bg-[#e5e5e5] w-full h-[500px] flex justify-between items-center px-10 md:px-20 lg:px-32">
          <div>
            <h1 className="font-bold">Anunciantes</h1>
            <h1>Cadastre seu espaço</h1>
            <h1>Como funciona o PlacyHub</h1>
            <h1>Planos e comissões</h1>
            <h1>Suporte para locador</h1>
          </div>
          <div>
            <h1 className="font-bold">Sobre o PlacyHub</h1>
            <h1>Nossa história</h1>
            <h1>Termos de uso</h1>
            <h1>Política de privacidade</h1>
          </div>
          <div>
            <h1 className="font-bold">Extras</h1>
            <h1>Redes sociais</h1>
            <h1>Termos de uso</h1>
            <h1>Formas de pagamentos aceitos</h1>
          </div>
          <div>
            <h1 className="font-bold">Atendimento</h1>
            <h1>Fale conosco</h1>
            <h1>Políticas de cancelamento</h1>
          </div>
        </div>
      </section>
    </>
  );
}
