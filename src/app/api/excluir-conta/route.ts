import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get("authorization");

    if (!authHeader) {
      return NextResponse.json(
        { success: false, message: "Token não enviado." },
        { status: 401 }
      );
    }

    const token = authHeader.replace("Bearer ", "");

    // valida usuário pelo token
    const {
      data: { user },
      error: userError,
    } = await supabaseAdmin.auth.getUser(token);

    if (userError || !user) {
      return NextResponse.json(
        { success: false, message: "Usuário não autenticado." },
        { status: 401 }
      );
    }

    const userId = user.id;


    // verifica repasses existentes
    const { data: repasses, error: repasseError } =
      await supabaseAdmin
        .from("repasse")
        .select("id")
        .eq("anfitriao_id", userId);


    if (repasseError) {
      throw repasseError;
    }


    if (repasses && repasses.length > 0) {
      return NextResponse.json({
        success: false,
        message:
          "Não é possível excluir a conta pois existem repasses financeiros vinculados."
      });
    }


   // remove usuário do Auth
const { error: authDeleteError } =
  await supabaseAdmin.auth.admin.deleteUser(userId);


if (authDeleteError) {
  throw authDeleteError;
}


// remove usuário da tabela pública
const { error: deleteUserTableError } =
  await supabaseAdmin
    .from("users")
    .delete()
    .eq("id", userId);


if (deleteUserTableError) {
  throw deleteUserTableError;
}


    return NextResponse.json({
      success: true,
      message: "Conta excluída com sucesso."
    });


  } catch (error: any) {

    console.error("Erro excluir conta:", error);

    return NextResponse.json(
      {
        success: false,
        message: error.message || "Erro ao excluir conta."
      },
      {
        status: 500
      }
    );
  }
}


export async function GET() {
  return NextResponse.json({
    success: true,
    message: "API funcionando."
  });
}