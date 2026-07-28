// import { NextResponse } from "next/server";
// import { supabaseAdmin } from "@/lib/supabaseAdmin";

// export async function GET() {
//   try {

//     // Buscar usuários antigos
//     const { data: usuarios, error } = await supabaseAdmin
//       .from("users")
//       .select("*");


//     if (error) {
//       return NextResponse.json(
//         { erro: error.message },
//         { status: 500 }
//       );
//     }


//     const resultados = [];


//     for (const usuario of usuarios) {


//       // verificar se já existe no Auth
//       const { data: authUsers } =
//         await supabaseAdmin.auth.admin.listUsers();


//       const jaExiste = authUsers.users.some(
//         (u) => u.email === usuario.email
//       );


//       if (jaExiste) {
//         resultados.push({
//           email: usuario.email,
//           status: "já existe",
//         });

//         continue;
//       }


//       // criar usuário no Auth
//       const { data, error } =
//         await supabaseAdmin.auth.admin.createUser({
//           id: usuario.id,
//           email: usuario.email,
//           password: "TrocarSenha@2026",
//           email_confirm: true,
//         });


//       if (error) {

//         resultados.push({
//           email: usuario.email,
//           status: "erro",
//           erro: error.message,
//         });

//         continue;
//       }


//       resultados.push({
//         email: usuario.email,
//         status: "criado",
//       });

//     }


//     return NextResponse.json({
//       sucesso: true,
//       resultados,
//     });


//   } catch (err:any) {

//     return NextResponse.json(
//       {
//         erro: err.message
//       },
//       {
//         status:500
//       }
//     );

//   }
// }