
import Image from "next/image";
import { Heart, ChevronDown, ChevronLeft } from "lucide-react";
import Navbar from "@/components/navbar"; 
import Link from "next/link";

export default function Home(){
    return(
<>
        <Navbar/>

 <div className="flex justify-center">
        <h1 className="font-bold text-2xl mt-10 mb-10">
          Favoritos
        </h1>
      </div>


        

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