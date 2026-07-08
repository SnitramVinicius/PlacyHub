"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function AdminDashboard() {

const [loading,setLoading] = useState(true);

const [usuarios,setUsuarios] = useState(0);
const [espacos,setEspacos] = useState(0);
const [reservas,setReservas] = useState(0);

const [pendentes,setPendentes] = useState(0);
const [valorRepasse,setValorRepasse] = useState(0);
const [receita,setReceita] = useState(0);
const [anfitrioes,setAnfitrioes] = useState(0);
const [locatarios,setLocatarios] = useState(0);


useEffect(()=>{
 carregar();
},[]);

function calcularReembolso(reserva: any): number {
  if (!reserva.cancelado_em) return 0;

  const criacao = new Date(reserva.created_at);
  const cancelamento = new Date(reserva.cancelado_em);
  const evento = new Date(reserva.data_inicio);

  const horas =
    (cancelamento.getTime() - criacao.getTime()) /
    (1000 * 60 * 60);

  const dias =
    (evento.getTime() - cancelamento.getTime()) /
    (1000 * 60 * 60 * 24);

  if (horas <= 48) return 1;

  if (dias > 7) return 0.5;

  return 0;
}

async function carregar(){

try {


const { data: usuariosLista } = await supabase
  .from("users")
  .select("roles");

  const totalUsuarios = usuariosLista?.length || 0;


const totalAnfitrioes =
usuariosLista?.filter((usuario) =>
  usuario.roles?.includes("ANFITRIAO")
).length || 0;


const totalLocatarios =
usuariosLista?.filter((usuario) =>
  usuario.roles?.includes("LOCATARIO")
).length || 0;


setUsuarios(totalUsuarios);
setAnfitrioes(totalAnfitrioes);
setLocatarios(totalLocatarios);

const {count:totalSpaces}=await supabase
.from("spaces")
.select("*",{count:"exact",head:true});


const { data: lista } = await supabase
  .from("reservas")
  .select(`
    valor_base,
    repasse_anfitriao,
    comissao_placyhub,
    taxa_placyhub,
    repasse_realizado,
    status,
    pagamento_status,
    cancelado_em,
    created_at,
    data_inicio
  `);

setEspacos(totalSpaces || 0);

setReservas(lista?.length || 0);



const aguardando =
lista?.filter(
(r)=>
!r.repasse_realizado &&
r.pagamento_status === "approved"
) || [];



setPendentes(aguardando.length);


setValorRepasse(

  aguardando.reduce((acc, reserva) => {

    if (
    reserva.status === "cancelada" &&
    reserva.pagamento_status === "approved"
) {

      const percentualReembolso =
        calcularReembolso(reserva);

      if (percentualReembolso === 1) {
        return acc;
      }

      const percentualMantido =
        1 - percentualReembolso;

      const taxa =
        (reserva.comissao_placyhub || 0) *
        percentualMantido;

      const repasse =
        (reserva.valor_base || 0) *
        percentualMantido -
        taxa;

      return acc + repasse;
    }

    return acc + (reserva.repasse_anfitriao || 0);

  }, 0)

);



setReceita(

  lista?.reduce((acc, reserva) => {

    const taxaCliente =
      reserva.taxa_placyhub || 0;

    const comissaoAnfitriao =
      reserva.comissao_placyhub || 0;

    if (
    reserva.status === "cancelada" &&
    reserva.pagamento_status === "approved"
) {

      const percentualReembolso =
        calcularReembolso(reserva);

      // Reembolso integral
      if (percentualReembolso === 1) {
        return acc;
      }

      const percentualMantido =
        1 - percentualReembolso;

      return (
        acc +
        (taxaCliente * percentualMantido) +
        (comissaoAnfitriao * percentualMantido)
      );

    }

    // Reserva normal
    return (
      acc +
      taxaCliente +
      comissaoAnfitriao
    );

  }, 0) || 0

);



}catch(e){

console.log(e);

}finally{

setLoading(false);

}


}



if(loading)
return <div>Carregando...</div>



return (

<div className="p-6">

<h1 className="text-3xl font-bold mb-8">
Painel Administrativo
</h1>


<div className="grid grid-cols-1 md:grid-cols-3 gap-6">

<Card 
titulo="Usuários"
valor={usuarios}
/>

<Card 
titulo="Anfitriões"
valor={anfitrioes}
/>

<Card 
titulo="Locatários"
valor={locatarios}
/>

<Card titulo="Espaços" valor={espacos}/>

<Card titulo="Reservas" valor={reservas}/>

<Card 
titulo="Aguardando repasse"
valor={pendentes}
/>


<Card 
titulo="Valor a pagar"
valor={`R$ ${valorRepasse.toFixed(2)}`}
/>


<Card 
titulo="Receita PlacyHub"
valor={`R$ ${receita.toFixed(2)}`}
/>


</div>


</div>

)

}



function Card({titulo,valor}:any){

return (

<div className="bg-white rounded-xl shadow p-6">

<p className="text-gray-500">
{titulo}
</p>

<h2 className="text-3xl font-bold mt-2">
{valor}
</h2>

</div>

)

}