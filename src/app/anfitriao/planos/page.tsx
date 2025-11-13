// "use client";

// import Link from "next/link";
// import { CheckCircle, Star, Crown } from "lucide-react";

// export default function PlanosAnfitriao() {
//   const planos = [
//     {
//       id: "basico",
//       nome: "Plano Básico",
//       preco: "Grátis",
//       descricao: "Ideal para quem está começando a anunciar seus espaços.",
//       beneficios: [
//         "Até 2 espaços cadastrados",
//         "Suporte via e-mail",
//         "Taxa de 10% por reserva",
//         "Visibilidade padrão nas buscas",
//       ],
//       icone: <Star className="text-sky-500 w-6 h-6" />,
//       destaque: false,
//     },
//     {
//       id: "premium",
//       nome: "Plano Premium",
//       preco: "R$ 69,90/mês",
//       descricao:
//         "Mais visibilidade, menos taxas e acesso a ferramentas exclusivas.",
//       beneficios: [
//         "Espaços ilimitados",
//         "Taxa reduzida (8% por reserva)",
//         "Suporte prioritário e WhatsApp",
//         "Maior destaque nas buscas",
//         "Painel de estatísticas avançadas",
//         "Gestão de equipe (subcontas)",
//       ],
//       icone: <Crown className="text-yellow-500 w-6 h-6" />,
//       destaque: true,
//     },
//   ];

//   return (
//     <>
//       <div className="min-h-screen bg-white py-12 px-6">
//         <div className="max-w-6xl mx-auto text-center mb-12">
//           <h1 className="text-3xl font-bold text-gray-800 mb-2">
//             Escolha o plano ideal para você
//           </h1>
//           <p className="text-gray-500">
//             Comece grátis ou destaque-se com recursos premium.
//           </p>
//         </div>

//         <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
//           {planos.map((plano) => (
//             <div
//               key={plano.id}
//               className={`border rounded-2xl p-8 shadow-sm transition hover:shadow-md ${
//                 plano.destaque ? "border-yellow-400 bg-yellow-50" : "border-gray-200"
//               }`}
//             >
//               <div className="flex items-center gap-3 mb-4">
//                 {plano.icone}
//                 <h2 className="text-2xl font-semibold text-gray-800">
//                   {plano.nome}
//                 </h2>
//               </div>
//               <p className="text-gray-500 mb-4">{plano.descricao}</p>
//               <p className="text-3xl font-bold text-sky-600 mb-6">{plano.preco}</p>

//               <ul className="text-left space-y-2 mb-8">
//                 {plano.beneficios.map((beneficio, index) => (
//                   <li key={index} className="flex items-center gap-2 text-gray-700">
//                     <CheckCircle className="text-green-500 w-5 h-5" /> {beneficio}
//                   </li>
//                 ))}
//               </ul>

//               <Link
//                 href={`/anfitriao/cadastro?plano=${plano.id}`}
//                 className={`block w-full py-2 rounded-xl text-center font-semibold transition ${
//                   plano.destaque
//                     ? "bg-yellow-500 text-white hover:bg-yellow-600"
//                     : "bg-sky-500 text-white hover:bg-sky-600"
//                 }`}
//               >
//                 Escolher {plano.nome}
//               </Link>
//             </div>
//           ))}
//         </div>

//         <div className="text-center mt-12 text-gray-500 text-sm">
//           <p>
//             Você poderá alterar seu plano a qualquer momento no painel do anfitrião.
//           </p>
//         </div>
//       </div>
//     </>
//   );
// }
