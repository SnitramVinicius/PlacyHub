"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";


interface Reserva {
  id: string;

  user_id: string;
  espaco_id: string;

  valor_total: number;
  valor_base: number;

  taxa_placyhub: number;
  comissao_placyhub: number;

  repasse_anfitriao: number;

  pagamento_status: string;
  status: string;

  created_at: string;
  data_inicio: string;
  data_fim: string;

  cancelado_em?: string;

  repasse_realizado?: boolean;
  repasse_realizado_em?: string;
valorBase?: number;

taxaServico?: number;

taxaPlacy?: number;
valorReembolso?: number;
valorReembolsoCliente?: number;

repasse?: number;
lucroPlacy?: number;
descricao?: string;
  users?: {
    name?: string;
    email?: string;
  };

  spaces?: {
    nome_espaco?: string;
  };
}
export default function AdminReservas() {


const [reservas, setReservas] = useState<Reserva[]>([]);
const [loading, setLoading] = useState(true);

const [processando, setProcessando] = useState<string | null>(null);
function calcularReembolso(reserva: Reserva) {

  if (reserva.status !== "cancelada")
    return 0;

  if (!reserva.cancelado_em)
    return 0;

  const criacao = new Date(reserva.created_at);

  const cancelamento = new Date(reserva.cancelado_em);

const evento = new Date(
  reserva.data_inicio + "T12:00:00"
);

  const horas =
    (cancelamento.getTime() - criacao.getTime()) /
    (1000 * 60 * 60);

  const dias =
    (evento.getTime() - cancelamento.getTime()) /
    (1000 * 60 * 60 * 24);

  if (horas <= 48)
    return 1;

  if (dias > 7)
    return 0.5;

  return 0;

}

function getDescricaoCancelamento(reserva: Reserva) {

  if (reserva.status !== "cancelada")
    return "Reserva confirmada";

  const percentual = calcularReembolso(reserva);

  if (percentual === 1)
    return "Reembolso total";

  if (percentual === 0.5)
    return "Reembolso de 50%";

  return "Cancelamento tardio";

}

function calcularRepasse(reserva: Reserva) {

  const valorBase = reserva.valor_base;

  if (reserva.status !== "cancelada") {
    const taxa =
      reserva.taxa_placyhub ??
      reserva.comissao_placyhub ??
      0;

    return valorBase - taxa;
  }

  const percentual = calcularReembolso(reserva);

  // Reembolso total
  if (percentual === 1) {
    return 0;
  }

  const valorRetido = valorBase * (1 - percentual);

  const taxa =
    percentual === 0.5
      ? valorRetido * 0.05
      : valorBase * 0.05;

  return valorRetido - taxa;
}

function calcularLucroPlacy(reserva: Reserva) {

  const taxaServico = calcularTaxaServico(reserva);

  if (reserva.status !== "cancelada") {
    return taxaServico + (reserva.valor_base * 0.05);
  }

  const percentual = calcularReembolso(reserva);

  if (percentual === 1) {
    return 0;
  }

  const valorRetido = reserva.valor_base * (1 - percentual);

  return taxaServico + (valorRetido * 0.05);
}
function calcularValorReembolso(reserva: Reserva) {

  const percentual = calcularReembolso(reserva);


  if(percentual === 1){

    return reserva.valor_total;

  }


  if(percentual === 0.5){

    return reserva.valor_base * 0.5;

  }


  return 0;

}

function calcularTaxaServico(reserva: Reserva) {

  return reserva.valor_total - reserva.valor_base;

}

function formatarData(data:string){

  const [ano, mes, dia] = data.split("-");

  return `${dia}/${mes}/${ano}`;

}

useEffect(() => {

  carregarReservas();

}, []);


async function carregarReservas(){

 try {


 const { data: reservasData, error } = await supabase
    .from("reservas")
    .select("*")
    .order("created_at", {
      ascending:false
    });


 if(error) throw error;

const reservasComDados = await Promise.all(

(reservasData || []).map(async (reserva)=>{

const { data: usuario } = await supabase
.from("users")
.select("name,email")
.eq("id", reserva.user_id)
.single();

const { data: espaco } = await supabase
.from("spaces")
.select("nome_espaco")
.eq("id", reserva.espaco_id)
.single();

return {

  ...reserva,

  valorBase: reserva.valor_base,

  taxaServico: calcularTaxaServico(reserva),

 taxaPlacy: (() => {

  if (reserva.status !== "cancelada") {
    return reserva.valor_base * 0.05;
  }

  const percentual = calcularReembolso(reserva);

  if (percentual === 1) {
    return 0;
  }

  const valorRetido = reserva.valor_base * (1 - percentual);

  return valorRetido * 0.05;

})(),

  valorReembolso:
    calcularValorReembolso(reserva),

  repasse:
    calcularRepasse(reserva),

  lucroPlacy:
    calcularLucroPlacy(reserva),

  descricao:
    getDescricaoCancelamento(reserva),

  users: usuario,

  spaces: espaco

};



})

);



 setReservas(reservasComDados);



 } catch(error){

  console.error(
    "ERRO SUPABASE:",
    JSON.stringify(error,null,2)
  );


 } finally {

  setLoading(false);

 }

}

async function marcarRepassePago(id:string){

try{


setProcessando(id);


const { error } = await supabase
.from("reservas")
.update({

repasse_realizado:true,
repasse_realizado_em: new Date().toISOString()
})
.eq("id",id);



if(error) throw error;



setReservas(prev=>
prev.map(r=>
r.id === id
?
{
...r,
repasse_realizado:true,
repasse_realizado_em:new Date().toISOString()
}
:
r
)
);



}catch(error){

console.error(
"Erro ao marcar repasse:",
error
);


}finally{

setProcessando(null);

}


}

if(loading){

 return (
  <div className="p-6">
    Carregando reservas...
  </div>
 )

}



return (

<div className="p-6">


<h1 className="text-3xl font-bold mb-6">
Reservas
</h1>



<div className="bg-white rounded-xl shadow overflow-hidden">


<table className="w-full">


<thead className="bg-gray-100">

<tr>

<th className="p-3 text-left">
ID
</th>

<th className="p-3 text-left">
Cliente
</th>

<th className="p-3 text-left">
Espaço
</th>

<th className="p-3 text-left">
Datas
</th>

<th className="p-3 text-left">
Cliente pagou
</th>

<th className="p-3 text-left">
Taxa serviço
</th>
<th className="p-3 text-left">
Valor espaço
</th>
<th className="p-3 text-left">
Comissão Placyhub
</th>
<th className="p-3 text-left">
Lucro Placyhub
</th>

<th className="p-3 text-left">
Devolver ao cliente
</th>

<th className="p-3 text-left">
Repasse
</th>

<th className="p-3 text-left">
Pagamento
</th>

<th className="p-3 text-left">
Status
</th>

<th className="p-3 text-left">
Repasse
</th>

<th className="p-3 text-left">
Ação
</th>

</tr>

</thead>


<tbody>

{reservas.map((r)=>(

<tr 
key={r.id}
className="border-t"
>


<td className="p-3 text-xs">

{r.id.slice(0,8)}

</td>


<td className="p-3">

{r.users?.name || r.users?.email || "Cliente"}

</td>


<td className="p-3">

{r.spaces?.nome_espaco || "Espaço"}

</td>


<td className="p-3">

{formatarData(r.data_inicio)}

{" - "}

{formatarData(r.data_fim)}

</td>


<td className="p-3 font-semibold">

R$ {r.valor_total.toFixed(2)}

</td>

<td className="p-3 text-blue-600">
  R$ {(r.taxaServico ?? 0).toFixed(2)}
</td>

<td className="p-3">
  R$ {(r.valorBase ?? 0).toFixed(2)}
</td>

<td className="p-3 text-red-500">

R$ {r.taxaPlacy?.toFixed(2)}

</td>
<td className="p-3 text-purple-600 font-bold">
R$ {(r.lucroPlacy ?? 0).toFixed(2)}
</td>

<td className="p-3 text-orange-600 font-bold">
R$ {(r.valorReembolso ?? 0).toFixed(2)}
</td>

<td className="p-3 text-green-600 font-bold">
R$ {(r.repasse ?? 0).toFixed(2)}
</td>


<td className="p-3">

{r.pagamento_status}

</td>



<td className="p-3">

<span
className={`px-3 py-1 rounded-full text-sm font-semibold ${
  r.status === "cancelada"
    ? "bg-red-100 text-red-700"
    :
  r.status === "confirmada"
    ? "bg-green-100 text-green-700"
    :
  "bg-yellow-100 text-yellow-700"
}`}
>

{r.status}

</span>

</td>

<td className="p-3">

{
r.repasse_realizado
?
<span className="text-green-600 font-bold">
Pago
</span>
:
<span className="text-orange-500 font-bold">
Pendente
</span>
}

<p className="text-xs mt-2 text-gray-500">

{r.descricao}

</p>
</td>


<td className="p-3">


{
!r.repasse_realizado &&
(r.repasse ?? 0) > 0 &&

<button

onClick={()=>marcarRepassePago(r.id)}

disabled={processando === r.id}

className="
bg-green-600
text-white
px-3
py-2
rounded-lg
"

>

{
processando === r.id
?
"Salvando..."
:
"Marcar pago"
}


</button>

}


</td>

</tr>

))}

</tbody>


</table>


</div>


</div>


)

}