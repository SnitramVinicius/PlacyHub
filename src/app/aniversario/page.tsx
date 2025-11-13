import Image from "next/image";
import { Heart, ChevronDown, ChevronLeft } from "lucide-react";
import Navbar from "@/components/navbar"; 
import Link from "next/link";

export default function Home() {
  return (
    <>
    
    {/* <Navbar/> */}
  
      <div className="flex w-full mb-10">
  {/* Outros itens de navegação se houver */}

  <Link 
    href="/" 
    className="flex ml-auto px-4 py-2  rounded-lg text-sm font-medium" // <- ADICIONAR ml-auto
  >
    <ChevronLeft size={18} className="text-[#02aeee] fill-[#02aeee]" />
    Voltar
    
  </Link>
</div>
      

 <div className="flex justify-center">
        <h1 className="font-bold text-2xl mt-10 mb-10">Espaços perfeitos para aniversários</h1>
      </div>

      <section className="flex gap-5 justify-center ">
        <div className="bg-white w-[380px] rounded-2xl shadow-md overflow-hidden">
          <div className="relative">
            <img
              src="/1.jpg"
              alt="Salão de Festas"
              className="w-full h-[200px] object-cover"
            />
            <button className="absolute top-2 right-2 bg-white/80 hover:bg-white rounded-full p-2 shadow-sm transition">
              <Heart size={20} className="text-[#02aeee]" />
            </button>
          </div>
          <div className="p-3">
            <div className="flex justify-between items-center">
              <p className="font-semibold text-[16px]">
                Salão de Festas Salagadum Buffet
              </p>
              <div className="flex items-center gap-1">
                <span className="text-gray-700  text-sm">⭐</span>
                <p className="text-gray-700 text-sm font-medium">4,0</p>
              </div>
            </div>

            <p className="text-gray-500 text-sm mt-1">
              R$ 500,00 • 5 horas de festa
            </p>
          </div>
        </div>

        <div className="bg-white w-[380px] rounded-2xl shadow-md overflow-hidden">
          <div className="relative">
            <img
              src="/2.jpg"
              alt="Salão de Festas"
              className="w-full h-[200px] object-cover"
            />
            <button className="absolute top-2 right-2 bg-white/80 hover:bg-white rounded-full p-2 shadow-sm transition">
              <Heart size={20} className="text-[#02aeee]" />
            </button>
          </div>
          <div className="p-3">
            <div className="flex justify-between items-center">
              <p className="font-semibold text-[16px]">
                Salão de Festas Salagadum Buffet
              </p>
              <div className="flex items-center gap-1">
                <span className="text-gray-700 text-sm">⭐</span>
                <p className="text-gray-700 text-sm font-medium">4,0</p>
              </div>
            </div>

            <p className="text-gray-500 text-sm mt-1">
              R$ 500,00 • 5 horas de festa
            </p>
          </div>
        </div>

        <div className="bg-white w-[380px] rounded-2xl shadow-md overflow-hidden">
          <div className="relative">
            <img
              src="/3.jpg"
              alt="Salão de Festas"
              className="w-full h-[200px] object-cover"
            />
            <button className="absolute top-2 right-2 bg-white/80 hover:bg-white rounded-full p-2 shadow-sm transition">
              <Heart size={20} className="text-[#02aeee]" />
            </button>
          </div>
          <div className="p-3">
            <div className="flex justify-between items-center">
              <p className="font-semibold text-[16px]">
                Salão de Festas Salagadum Buffet
              </p>
              <div className="flex items-center gap-1">
                <span className="text-gray-700 text-sm">⭐</span>
                <p className="text-gray-700 text-sm font-medium">4,0</p>
              </div>
            </div>

            <p className="text-gray-500 text-sm mt-1">
              R$ 500,00 • 5 horas de festa
            </p>
          </div>
        </div>

        <div className="bg-white w-[380px] rounded-2xl shadow-md overflow-hidden">
          <div className="relative">
            <img
              src="/4.jpeg"
              alt="Salão de Festas"
              className="w-full h-[200px] object-cover"
            />
            <button className="absolute top-2 right-2 bg-white/80 hover:bg-white rounded-full p-2 shadow-sm transition">
              <Heart size={20} className="text-[#02aeee]" />
            </button>
          </div>
          <div className="p-3">
            <div className="flex justify-between items-center">
              <p className="font-semibold text-[16px]">
                Salão de Festas Salagadum Buffet
              </p>
              <div className="flex items-center gap-1">
                <span className="text-gray-700 text-sm">⭐</span>
                <p className="text-gray-700 text-sm font-medium">4,0</p>
              </div>
            </div>

            <p className="text-gray-500 text-sm mt-1">
              R$ 500,00 • 5 horas de festa
            </p>
          </div>
        </div>

        <div className="bg-white w-[380px] rounded-2xl shadow-md overflow-hidden">
          <div className="relative">
            <img
              src="/5.jpeg"
              alt="Salão de Festas"
              className="w-full h-[200px] object-cover"
            />
            <button className="absolute top-2 right-2 bg-white/80 hover:bg-white rounded-full p-2 shadow-sm transition">
              <Heart size={20} className="text-[#02aeee]" />
            </button>
          </div>
          <div className="p-3">
            <div className="flex justify-between items-center">
              <p className="font-semibold text-[16px]">
                Salão de Festas Salagadum Buffet
              </p>
              <div className="flex items-center gap-1">
                <span className="text-gray-700 text-sm">⭐</span>
                <p className="text-gray-700 text-sm font-medium">4,0</p>
              </div>
            </div>

            <p className="text-gray-500 text-sm mt-1">
              R$ 500,00 • 5 horas de festa
            </p>
          </div>
        </div>

        <div className="bg-white w-[380px] rounded-2xl shadow-md overflow-hidden">
          <div className="relative">
            <img
              src="/1.jpg"
              alt="Salão de Festas"
              className="w-full h-[200px] object-cover"
            />
            <button className="absolute top-2 right-2 bg-white/80 hover:bg-white rounded-full p-2 shadow-sm transition">
              <Heart size={20} className="text-[#02aeee]" />
            </button>
          </div>
          <div className="p-3">
            <div className="flex justify-between items-center">
              <p className="font-semibold text-[16px]">
                Salão de Festas Salagadum Buffet
              </p>
              <div className="flex items-center gap-1">
                <span className="text-gray-700 text-sm">⭐</span>
                <p className="text-gray-700 text-sm font-medium">4,0</p>
              </div>
            </div>

            <p className="text-gray-500 text-sm mt-1">
              R$ 500,00 • 5 horas de festa
            </p>
          </div>
        </div>
      </section>

      <section className="flex gap-5 justify-center mt-10">
        <div className="bg-white w-[380px] rounded-2xl shadow-md overflow-hidden">
          <div className="relative">
            <img
              src="/1.jpg"
              alt="Salão de Festas"
              className="w-full h-[200px] object-cover"
            />
            <button className="absolute top-2 right-2 bg-white/80 hover:bg-white rounded-full p-2 shadow-sm transition">
              <Heart size={20} className="text-[#02aeee]" />
            </button>
          </div>
          <div className="p-3">
            <div className="flex justify-between items-center">
              <p className="font-semibold text-[16px]">
                Salão de Festas Salagadum Buffet
              </p>
              <div className="flex items-center gap-1">
                <span className="text-gray-700  text-sm">⭐</span>
                <p className="text-gray-700 text-sm font-medium">4,0</p>
              </div>
            </div>

            <p className="text-gray-500 text-sm mt-1">
              R$ 500,00 • 5 horas de festa
            </p>
          </div>
        </div>

        <div className="bg-white w-[380px] rounded-2xl shadow-md overflow-hidden">
          <div className="relative">
            <img
              src="/2.jpg"
              alt="Salão de Festas"
              className="w-full h-[200px] object-cover"
            />
            <button className="absolute top-2 right-2 bg-white/80 hover:bg-white rounded-full p-2 shadow-sm transition">
              <Heart size={20} className="text-[#02aeee]" />
            </button>
          </div>
          <div className="p-3">
            <div className="flex justify-between items-center">
              <p className="font-semibold text-[16px]">
                Salão de Festas Salagadum Buffet
              </p>
              <div className="flex items-center gap-1">
                <span className="text-gray-700 text-sm">⭐</span>
                <p className="text-gray-700 text-sm font-medium">4,0</p>
              </div>
            </div>

            <p className="text-gray-500 text-sm mt-1">
              R$ 500,00 • 5 horas de festa
            </p>
          </div>
        </div>

        <div className="bg-white w-[380px] rounded-2xl shadow-md overflow-hidden">
          <div className="relative">
            <img
              src="/3.jpg"
              alt="Salão de Festas"
              className="w-full h-[200px] object-cover"
            />
            <button className="absolute top-2 right-2 bg-white/80 hover:bg-white rounded-full p-2 shadow-sm transition">
              <Heart size={20} className="text-[#02aeee]" />
            </button>
          </div>
          <div className="p-3">
            <div className="flex justify-between items-center">
              <p className="font-semibold text-[16px]">
                Salão de Festas Salagadum Buffet
              </p>
              <div className="flex items-center gap-1">
                <span className="text-gray-700 text-sm">⭐</span>
                <p className="text-gray-700 text-sm font-medium">4,0</p>
              </div>
            </div>

            <p className="text-gray-500 text-sm mt-1">
              R$ 500,00 • 5 horas de festa
            </p>
          </div>
        </div>

        <div className="bg-white w-[380px] rounded-2xl shadow-md overflow-hidden">
          <div className="relative">
            <img
              src="/4.jpeg"
              alt="Salão de Festas"
              className="w-full h-[200px] object-cover"
            />
            <button className="absolute top-2 right-2 bg-white/80 hover:bg-white rounded-full p-2 shadow-sm transition">
              <Heart size={20} className="text-[#02aeee]" />
            </button>
          </div>
          <div className="p-3">
            <div className="flex justify-between items-center">
              <p className="font-semibold text-[16px]">
                Salão de Festas Salagadum Buffet
              </p>
              <div className="flex items-center gap-1">
                <span className="text-gray-700 text-sm">⭐</span>
                <p className="text-gray-700 text-sm font-medium">4,0</p>
              </div>
            </div>

            <p className="text-gray-500 text-sm mt-1">
              R$ 500,00 • 5 horas de festa
            </p>
          </div>
        </div>

        <div className="bg-white w-[380px] rounded-2xl shadow-md overflow-hidden">
          <div className="relative">
            <img
              src="/5.jpeg"
              alt="Salão de Festas"
              className="w-full h-[200px] object-cover"
            />
            <button className="absolute top-2 right-2 bg-white/80 hover:bg-white rounded-full p-2 shadow-sm transition">
              <Heart size={20} className="text-[#02aeee]" />
            </button>
          </div>
          <div className="p-3">
            <div className="flex justify-between items-center">
              <p className="font-semibold text-[16px]">
                Salão de Festas Salagadum Buffet
              </p>
              <div className="flex items-center gap-1">
                <span className="text-gray-700 text-sm">⭐</span>
                <p className="text-gray-700 text-sm font-medium">4,0</p>
              </div>
            </div>

            <p className="text-gray-500 text-sm mt-1">
              R$ 500,00 • 5 horas de festa
            </p>
          </div>
        </div>

        <div className="bg-white w-[380px] rounded-2xl shadow-md overflow-hidden">
          <div className="relative">
            <img
              src="/1.jpg"
              alt="Salão de Festas"
              className="w-full h-[200px] object-cover"
            />
            <button className="absolute top-2 right-2 bg-white/80 hover:bg-white rounded-full p-2 shadow-sm transition">
              <Heart size={20} className="text-[#02aeee]" />
            </button>
          </div>
          <div className="p-3">
            <div className="flex justify-between items-center">
              <p className="font-semibold text-[16px]">
                Salão de Festas Salagadum Buffet
              </p>
              <div className="flex items-center gap-1">
                <span className="text-gray-700 text-sm">⭐</span>
                <p className="text-gray-700 text-sm font-medium">4,0</p>
              </div>
            </div>

            <p className="text-gray-500 text-sm mt-1">
              R$ 500,00 • 5 horas de festa
            </p>
          </div>
        </div>
      </section>

      
      <section>
        <div className="bg-[#e5e5e5] w-full h-[500px] flex justify-between items-center px-80">
          <div>
            <h1 className="font-bold">Anunciantes</h1>
            <h1>cadastre seu espaço</h1>
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
