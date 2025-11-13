import { notFound } from "next/navigation";
import Navbar from "@/components/navbar";
import { Heart, ChevronDown } from "lucide-react";
import Link from "next/link";
import Avaliacoes from "@/components/Avaliacoes";
import Comentarios from "@/components/Comentarios";
import Agendar from "@/components/Agendar";
import Mapa from "@/components/Mapa";

const espacos = [
  {
    id: "1",
    nome: "Salão de Festas Salagadum Buffet",
    imagem: "/1.jpg",
    preco: "R$ 500,00",
    duracao: "5 horas de festa",
    avaliacao: 4.0,
    descricao: "Espaço aconchegante com buffet completo, ideal para festas infantis e eventos familiares.",
    endereco: "Rua das Flores, 123 - Campo Grande/MS",
    latitude: -20.4816509,
    longitude: -54.6473774,
    capacidade: 120,
    area: "180m²",
    facilidades: ["Ar-condicionado", "Wi-Fi", "Estacionamento", "Churrasqueira"],
    regras: ["Horário máximo até 00h", "Permitido levar própria bebida", "Proibido som automotivo", "Proibido fumar em áreas internas"],
    servicosAdicionais: ["Buffet", "Decoração", "Limpeza"]
  },
  {
    id: "2",
    nome: "Espaço Alegria Kids",
    imagem: "/2.jpg",
    preco: "R$ 480,00",
    duracao: "5 horas",
    avaliacao: 4.5,
    descricao: "Ambiente divertido com brinquedos e área climatizada. Perfeito para aniversários infantis.",
    endereco: "Av. Brasil, 456 - Campo Grande/MS",
    latitude: -20.4816509,
    longitude: -54.6473774,
    capacidade: 80,
    area: "150m²",
    facilidades: ["Ar-condicionado", "Wi-Fi", "Estacionamento"],
    regras: ["Horário máximo até 23h", "Proibido fumar", "Permitido levar própria bebida"],
    servicosAdicionais: ["Buffet", "Decoração", "Fotógrafo"]
  },
  {
    id: "3",
    nome: "Chácara Recanto Feliz",
    imagem: "/3.jpg",
    preco: "R$ 650,00",
    duracao: "6 horas",
    avaliacao: 4.8,
    descricao: "Chácara ampla com área verde, piscina e espaço para churrasco. Ideal para festas de família.",
    endereco: "Rua das Palmeiras, 789 - Campo Grande/MS",
    latitude: -20.4816509,
    longitude: -54.6473774,
    capacidade: 200,
    area: "350m²",
    facilidades: ["Piscina", "Churrasqueira", "Estacionamento", "Palco/Som/Iluminação"],
    regras: ["Horário máximo até 02h", "Permitido levar própria bebida", "Proibido som automotivo"],
    servicosAdicionais: ["Buffet", "DJ/Música", "Segurança", "Limpeza"]
  },
  {
    id: "4",
    nome: "Espaço Estrela",
    imagem: "/4.jpeg",
    preco: "R$ 700,00",
    duracao: "6 horas",
    avaliacao: 4.7,
    descricao: "Ambiente moderno e elegante para festas de adultos e crianças, com buffet incluso.",
    endereco: "Av. Mato Grosso, 1011 - Campo Grande/MS",
    latitude: -20.4816509,
    longitude: -54.6473774,
    capacidade: 150,
    area: "240m²",
    facilidades: ["Ar-condicionado", "Wi-Fi", "Palco/Som/Iluminação"],
    regras: ["Horário máximo até 01h", "Proibido fumar", "Som automotivo permitido até 22h"],
    servicosAdicionais: ["Buffet", "Decoração", "DJ/Música"]
  },
  {
    id: "5",
    nome: "Buffet Infantil Encanto",
    imagem: "/5.jpeg",
    preco: "R$ 520,00",
    duracao: "5 horas",
    avaliacao: 4.6,
    descricao: "Buffet temático infantil com brinquedos e monitores para crianças.",
    endereco: "Rua Goiás, 202 - Campo Grande/MS",
    latitude: -20.4816509,
    longitude: -54.6473774,
    capacidade: 90,
    area: "170m²",
    facilidades: ["Ar-condicionado", "Wi-Fi", "Estacionamento"],
    regras: ["Horário máximo até 23h", "Proibido fumar", "Permitido levar própria bebida"],
    servicosAdicionais: ["Buffet", "Decoração", "Fotógrafo", "Limpeza"]
  },
  {
    id: "6",
    nome: "Salão Premium",
    imagem: "/1.jpg",
    preco: "R$ 600,00",
    duracao: "5 horas",
    avaliacao: 4.3,
    descricao: "Salão sofisticado com espaço gourmet e decoração personalizável.",
    endereco: "Av. Brasil, 303 - Campo Grande/MS",
    latitude: -20.4816509,
    longitude: -54.6473774,
    capacidade: 130,
    area: "220m²",
    facilidades: ["ar condicionado", "wifi", "pscina", "estacionamento","churrasqueira", "palco/som/iluminação"],
    regras: ["Horário máximo até 01h", "Proibido fumar", "Proibido som automotivo"],
    servicosAdicionais: ["Decoração", "Segurança", "Limpeza"]
  },
];


export default async function EspacoPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params; // ✅ aguarda o params
  const espaco = espacos.find((e) => e.id === resolvedParams.id);

  if (!espaco) return notFound();

  return (
    <>
      <Navbar />
      <main className="max-w-4xl mx-auto px-6 py-10">
            <div className="flex w-full mb-10">
  {/* Outros itens de navegação se houver */}

  <Link 
    href="/" 
    className="flex ml-auto px-4 py-2  rounded-lg text-sm font-medium" // <- ADICIONAR ml-auto
  >
    {/* <ChevronLeft size={18} className="text-[#02aeee] fill-[#02aeee]" /> */}
    ← Voltar
  </Link>
</div>
 <h1 className="text-3xl font-bold mt-6 mb-10">{espaco.nome}</h1>
        <div className="relative rounded-2xl overflow-hidden shadow-lg">
          <img
            src={espaco.imagem}
            alt={espaco.nome}
            className="w-full h-[400px] object-cover"
          />
          <button className="absolute top-4 right-4 bg-white/80 hover:bg-white rounded-full p-3 shadow-md transition">
            <Heart size={22} className="text-[#02aeee]" />
          </button>
        </div>
        <div className="flex w-full mb-10">
  {/* Outros itens de navegação se houver */}

  <Link 
    href="" 
    className="flex ml-auto px-4 py-2  rounded-lg text-sm font-medium" // <- ADICIONAR ml-auto
  >
    <ChevronDown size={18} className="text-[#02aeee] fill-[#02aeee]" />
    Ver mais
    
  </Link>
</div>
<h2 className="font-bold text-xl mt-8 mb-3">Descrição</h2>
        <p className="text-gray-700 leading-relaxed">{espaco.descricao}</p>
       
        <p className="text-gray-600 mt-2">Localização: {espaco.endereco}</p>

<div className="flex items-center gap-1 mt-4">
  <p className="text-gray-700 font-medium mr-2">Avaliação:</p>
  
  {/* 4 estrelas amarelas */}
  {[...Array(4)].map((_, i) => (
    <span key={i} className="text-yellow-500">⭐</span>
  ))}

  {/* 1 estrela cinza */}
  <span className="text-gray-300">⭐</span>
</div>

        <p className="text-lg font-semibold mt-4">{espaco.preco}</p>
        <p className="text-gray-500 text-sm mb-6">{espaco.duracao}</p>

        <p className="text-lg font-semibold mt-4">Capacidade: {espaco.capacidade} pessoas</p>
        <p className="text-gray-500 text-sm mb-6">Área: {espaco.area}</p>

        <button className="bg-[#02aeee] h-10 w-35 rounded-full text-sm text-white">Ver disponibilidade</button>

<div className="flex gap-50">
        {/* Facilidades */}
{espaco.facilidades && (
  <div className="mt-8">
    <h2 className="font-bold text-xl mb-3">Facilidades incluídas</h2>
    <ul className=" list-inside text-gray-700">
      {espaco.facilidades.map((item, index) => (
        <li key={index}>{item}</li>
      ))}
    </ul>
  </div>
)}

{/* Regras */}
{espaco.regras && (
  <div className="mt-8">
    <h2 className="font-bold text-xl mb-3">Regras do local</h2>
    <ul className=" list-inside text-gray-700">
      {espaco.regras.map((item, index) => (
        <li key={index}>{item}</li>
      ))}
    </ul>
  </div>
)}
</div>
{/* Serviços adicionais */}
{espaco.servicosAdicionais && (
  <div className="mt-8">
    <h2 className="font-bold text-xl mb-3">Serviços adicionais</h2>
    <ul className=" list-inside text-gray-700">
      {espaco.servicosAdicionais.map((item, index) => (
        <li key={index}>{item}</li>
      ))}
    </ul>
  </div>
)}

<Avaliacoes />
<Comentarios />
<Mapa espacos={[espaco]} />
<Agendar espaco={espaco} />
      </main>
      {/* rodapé */}
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
